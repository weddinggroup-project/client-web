"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepPackage } from "./step-package";
import { StepInvitationDetails } from "./step-invitation-details";
import { StepLocation } from "./step-location";
import { StepCollaboration } from "./step-collaboration";
import { StepTemplate } from "./step-template";
import { StepSummary } from "./step-summary";
import { StepInvoice } from "./step-invoice";

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
};

const emptyInvitationDetails: InvitationDetails = {
  groomName: "",
  brideName: "",
  invitationTitle: "",
  invitationUrl: "",
  eventDate: "",
  preparationStage: "",
};

const emptyLocationDetails: LocationDetails = {
  address: "",
  venue: "",
  province: "",
  city: "",
  district: "",
  village: "",
  postalCode: "",
  guestCount: "",
};

const WIZARD_STEPS = [
  "package",
  "invitation",
  "location",
  "collaboration",
  "template",
  "summary",
  "invoice",
] as const;

type WizardStep = (typeof WIZARD_STEPS)[number];

/**
 * Orchestrates the "Pesan Undangan Digital" flow. This starter doesn't wire
 * orders or payment to a real backend — every step just collects data into
 * local state, which is enough to demo the full checkout experience.
 */
export function OrderWizard() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [packageId, setPackageId] = useState<string | null>(null);
  const [invitationDetails, setInvitationDetails] = useState(emptyInvitationDetails);
  const [locationDetails, setLocationDetails] = useState(emptyLocationDetails);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const currentStep: WizardStep = WIZARD_STEPS[stepIndex] ?? "package";

  function goToStep(step: WizardStep) {
    setStepIndex(WIZARD_STEPS.indexOf(step));
  }

  function goNext() {
    setStepIndex((index) => Math.min(index + 1, WIZARD_STEPS.length - 1));
  }

  function goBack() {
    setStepIndex((index) => Math.max(index - 1, 0));
  }

  switch (currentStep) {
    case "package":
      return (
        <StepPackage
          selectedPackageId={packageId}
          onSelectPackage={setPackageId}
          onNext={goNext}
        />
      );

    case "invitation":
      return (
        <StepInvitationDetails
          details={invitationDetails}
          onChange={setInvitationDetails}
          onBack={goBack}
          onNext={goNext}
        />
      );

    case "location":
      return (
        <StepLocation
          location={locationDetails}
          onChange={setLocationDetails}
          onBack={goBack}
          onNext={goNext}
        />
      );

    case "collaboration":
      return (
        <StepCollaboration
          collaborators={collaborators}
          onAddCollaborator={(collaborator) =>
            setCollaborators((current) => [...current, collaborator])
          }
          onBack={goBack}
          onNext={goNext}
        />
      );

    case "template":
      return (
        <StepTemplate
          packageId={packageId ?? "promise"}
          selectedTemplateId={templateId}
          onSelectTemplate={setTemplateId}
          onBack={goBack}
          onNext={goNext}
        />
      );

    case "summary":
      return (
        <StepSummary
          packageId={packageId ?? "promise"}
          selectedPaymentMethod={paymentMethod}
          onSelectPaymentMethod={setPaymentMethod}
          onBack={() => goToStep("template")}
          onNext={goNext}
        />
      );

    case "invoice":
      return (
        <StepInvoice
          packageId={packageId ?? "promise"}
          onBack={() => goToStep("summary")}
          onFinish={() => router.push("/dashboard")}
        />
      );

    default:
      return null;
  }
}
