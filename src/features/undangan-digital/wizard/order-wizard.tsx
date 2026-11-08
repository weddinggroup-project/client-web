"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/vowly/client";
import type { Invitation, InviteCreated, Order, Package as ApiPackage, SubdomainCheck, Template as ApiTemplate, ValidatedCode } from "@/lib/vowly/types";
import { StepPackage } from "./step-package";
import { StepInvitationDetails } from "./step-invitation-details";
import { StepLocation } from "./step-location";
import { StepCollaboration } from "./step-collaboration";
import { StepTemplate } from "./step-template";
import { StepSummary } from "./step-summary";
import { StepInvoice } from "./step-invoice";
import { accessToPermissions, composeAddress, invitationBody, resumeStep, roleToApi, subdomainError } from "./wizard-api";

export type InvitationDetails = {
  groomName: string;
  brideName: string;
  invitationTitle: string;
  invitationUrl: string;
  eventDate: string;
  preparationStage: string;
};

export type LocationDetails = {
  address: string;
  venue: string;
  province: string;
  city: string;
  district: string;
  village: string;
  postalCode: string;
  guestCount: string;
};

export type Collaborator = {
  name: string;
  email: string;
  /** One-time invite token returned by the API; shown to the owner so it can be shared manually. */
  token?: string;
};

export type InviteInput = { email: string; role: string; accessList: string[] };

const emptyInvitationDetails: InvitationDetails = { groomName: "", brideName: "", invitationTitle: "", invitationUrl: "", eventDate: "", preparationStage: "" };
const emptyLocationDetails: LocationDetails = { address: "", venue: "", province: "", city: "", district: "", village: "", postalCode: "", guestCount: "" };

const WIZARD_STEPS = ["package", "invitation", "location", "collaboration", "template", "summary", "invoice"] as const;
type WizardStep = (typeof WIZARD_STEPS)[number];

function messageOf(cause: unknown): string {
  return cause instanceof ApiError ? cause.message : "Terjadi kesalahan. Coba lagi.";
}

/**
 * Orchestrates the "Pesan Undangan Digital" flow against the Vowly API: the project is created after the
 * invitation step, saved step by step, and the order (Virtual Account) is created from the summary step.
 * Prices and totals always come from the API; nothing is computed here.
 */
export function OrderWizard({ resumeProjectId }: { resumeProjectId?: string }) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [packageCode, setPackageCode] = useState<string | null>(null);
  const [invitationDetails, setInvitationDetails] = useState(emptyInvitationDetails);
  const [locationDetails, setLocationDetails] = useState(emptyLocationDetails);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [templateSlug, setTemplateSlug] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>("Mandiri");
  const [projectId, setProjectId] = useState<string | undefined>(resumeProjectId);
  const [packages, setPackages] = useState<ApiPackage[]>([]);
  const [templates, setTemplates] = useState<ApiTemplate[]>([]);
  const [codes, setCodes] = useState<{ voucher?: ValidatedCode; referral?: ValidatedCode }>({});
  const [order, setOrder] = useState<Order>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);

  // Catalog (public) and, when resuming, the existing project.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [pkgs, tpls] = await Promise.all([api.get<ApiPackage[]>("/packages"), api.get<ApiTemplate[]>("/templates")]);
        if (cancelled) return;
        setPackages(pkgs.data);
        setTemplates(tpls.data);
        if (resumeProjectId) {
          const { data: project } = await api.get<Invitation>(`/invitations/${resumeProjectId}`);
          if (cancelled) return;
          setInvitationDetails({
            groomName: project.groom_name,
            brideName: project.bride_name,
            invitationTitle: project.title,
            invitationUrl: project.subdomain,
            eventDate: project.event_date.slice(0, 10),
            preparationStage: project.stage,
          });
          setTemplateSlug(tpls.data.find((template) => template.id === project.template_id)?.slug ?? null);
          const orders = await api.get<Order[]>(`/invitations/${resumeProjectId}/orders`, { limit: 5 });
          if (cancelled) return;
          const pending = orders.data.find((item) => item.status === "pending");
          if (pending) {
            setOrder(pending);
            setStepIndex(WIZARD_STEPS.indexOf("invoice"));
          } else {
            setStepIndex(WIZARD_STEPS.indexOf(resumeStep(project)));
          }
        }
      } catch (cause) {
        if (!cancelled) setError(messageOf(cause));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [resumeProjectId]);

  const apiPackage = useMemo(() => packages.find((pkg) => pkg.code === packageCode), [packages, packageCode]);
  const currentStep: WizardStep = WIZARD_STEPS[stepIndex] ?? "package";

  function goToStep(step: WizardStep) {
    setError(undefined);
    setStepIndex(WIZARD_STEPS.indexOf(step));
  }
  function goBack() {
    setError(undefined);
    setStepIndex((index) => Math.max(index - 1, 0));
  }
  function goNext() {
    setError(undefined);
    setStepIndex((index) => Math.min(index + 1, WIZARD_STEPS.length - 1));
  }

  /** Runs a step's API call; advances only on success, otherwise shows the API's message. */
  async function advance(work: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError(undefined);
    try {
      await work();
      goNext();
    } catch (cause) {
      setError(messageOf(cause));
    } finally {
      setBusy(false);
    }
  }

  async function saveInvitation() {
    const body = invitationBody(invitationDetails);
    if (projectId) {
      await api.put(`/invitations/${projectId}`, body);
      return;
    }
    const subdomain = invitationDetails.invitationUrl.trim();
    const problem = subdomainError(subdomain);
    if (problem) throw new ApiError(problem, 422);
    const check = await api.get<SubdomainCheck>("/invitations/subdomain-check", { subdomain });
    if (!check.data.available) throw new ApiError("URL undangan sudah dipakai. Coba yang lain.", 409);
    const created = await api.post<Invitation>("/invitations", { ...body, subdomain });
    setProjectId(created.data.id);
  }

  async function saveLocation() {
    if (!projectId) throw new ApiError("Proyek belum dibuat.", 400);
    const guests = Number(locationDetails.guestCount);
    await api.put(`/invitations/${projectId}`, {
      address: composeAddress(locationDetails),
      venue: locationDetails.venue.trim(),
      city: locationDetails.city,
      ...(Number.isInteger(guests) && guests > 0 ? { guest_count: guests } : {}),
    });
  }

  async function invite(input: InviteInput): Promise<string | undefined> {
    if (!projectId) return "Proyek belum dibuat.";
    try {
      const permissions = accessToPermissions(input.accessList);
      const { data } = await api.post<InviteCreated>(`/invitations/${projectId}/collaborators`, {
        email: input.email,
        role: roleToApi(input.role),
        ...(permissions ? { permissions } : {}),
      });
      setCollaborators((current) => [...current, { name: input.email.split("@")[0] ?? input.email, email: input.email, token: data.invite_token }]);
      return undefined;
    } catch (cause) {
      return messageOf(cause);
    }
  }

  async function saveTemplate() {
    const template = templates.find((item) => item.slug === templateSlug);
    if (!projectId || !template) throw new ApiError("Pilih template terlebih dahulu.", 422);
    await api.put(`/invitations/${projectId}`, { template_id: template.id });
  }

  async function applyCode(kind: "voucher" | "referral", code: string): Promise<string | undefined> {
    if (!projectId || !apiPackage) return "Pilih paket terlebih dahulu.";
    try {
      const { data } = await api.post<ValidatedCode>("/vouchers/validate", { invitation_id: projectId, package_id: apiPackage.id, code: code.trim() });
      setCodes((current) => ({ ...current, [kind]: data }));
      return undefined;
    } catch (cause) {
      setCodes((current) => ({ ...current, [kind]: undefined }));
      return messageOf(cause);
    }
  }

  async function createOrder() {
    if (!projectId || !apiPackage) throw new ApiError("Pilih paket terlebih dahulu.", 422);
    // Reuse a waiting order instead of tripping the "one pending order" rule.
    const existing = await api.get<Order[]>(`/invitations/${projectId}/orders`, { limit: 5 });
    const pending = existing.data.find((item) => item.status === "pending");
    if (pending) {
      setOrder(pending);
      return;
    }
    const created = await api.post<Order>("/orders", {
      invitation_id: projectId,
      package_id: apiPackage.id,
      payment_method: "mandiri_va",
      ...(codes.voucher ? { voucher_code: codes.voucher.code } : {}),
      ...(codes.referral ? { referral_code: codes.referral.code } : {}),
    });
    setOrder(created.data);
  }

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">Memuat…</div>;
  }

  const banner = error ? (
    <div role="alert" className="fixed inset-x-4 top-4 z-50 mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-lg">
      {error}
    </div>
  ) : null;

  const staticId = packageCode ?? "promise";

  return (
    <div aria-busy={busy}>
      {banner}
      {renderStep()}
    </div>
  );

  function renderStep() {
    switch (currentStep) {
      case "package":
        return <StepPackage selectedPackageId={packageCode} onSelectPackage={setPackageCode} onNext={projectId ? () => goToStep("invitation") : goNext} />;

      case "invitation":
        return <StepInvitationDetails details={invitationDetails} onChange={setInvitationDetails} onBack={goBack} onNext={() => void advance(saveInvitation)} />;

      case "location":
        return <StepLocation location={locationDetails} onChange={setLocationDetails} onBack={goBack} onNext={() => void advance(saveLocation)} />;

      case "collaboration":
        return <StepCollaboration collaborators={collaborators} onInvite={invite} onBack={goBack} onNext={goNext} />;

      case "template":
        return <StepTemplate packageId={staticId} selectedTemplateId={templateSlug} onSelectTemplate={setTemplateSlug} onBack={goBack} onNext={() => void advance(saveTemplate)} />;

      case "summary":
        return (
          <StepSummary
            packageName={apiPackage?.name ?? staticId}
            packagePrice={apiPackage?.price ?? 0}
            codes={codes}
            selectedPaymentMethod={paymentMethod}
            onSelectPaymentMethod={setPaymentMethod}
            onApplyCode={applyCode}
            busy={busy}
            onBack={() => goToStep("template")}
            onNext={() => void advance(createOrder)}
          />
        );

      case "invoice":
        return order ? (
          <StepInvoice
            order={order}
            packageName={apiPackage?.name}
            onOrderChange={setOrder}
            onBack={() => goToStep("summary")}
            onFinish={() => router.push(projectId ? `/dashboard/${projectId}` : "/dashboard")}
          />
        ) : null;

      default:
        return null;
    }
  }
}
