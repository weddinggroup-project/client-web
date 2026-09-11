import { useState } from "react";
import Image from "next/image";
import { HiExclamationCircle } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { AuthField, authLabelClassName } from "@/features/auth/components/auth-field";
import { Label } from "@/components/ui/label";
import { WizardTopBar } from "./wizard-top-bar";
import { WizardDateField } from "./wizard-date-field";
import { WizardSelect, type WizardSelectOption } from "./wizard-select";
import { preparationStages } from "./wizard-data";
import type { InvitationDetails } from "./order-wizard";

const backgroundImage = {
  src: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?q=80&w=900&auto=format&fit=crop",
  alt: "Buket bunga sebagai inspirasi undangan pernikahan",
};

const preparationStageOptions: WizardSelectOption[] = preparationStages.map(
  (stage) => ({ value: stage.value, label: stage.label }),
);

type StepInvitationDetailsProps = {
  details: InvitationDetails;
  onChange: (details: InvitationDetails) => void;
  onBack: () => void;
  onNext: () => void;
};

export function StepInvitationDetails({
  details,
  onChange,
  onBack,
  onNext,
}: StepInvitationDetailsProps) {
  const [error, setError] = useState<string>();

  function updateField<K extends keyof InvitationDetails>(
    key: K,
    value: InvitationDetails[K],
  ) {
    onChange({ ...details, [key]: value });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!details.eventDate || !details.preparationStage) {
      setError("Lengkapi tanggal acara dan tahap persiapanmu terlebih dahulu.");
      return;
    }

    setError(undefined);
    onNext();
  }

  const selectedStage =
    preparationStageOptions.find(
      (option) => option.value === details.preparationStage,
    ) ?? null;

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src={backgroundImage.src}
          alt={backgroundImage.alt}
          fill
          unoptimized
          sizes="50vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col">
        <WizardTopBar onBack={onBack} />

        <div className="flex flex-1 items-center justify-center px-6 py-8 sm:px-10">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground">
                Mari Mulai Impianmu Sekarang
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Harap Isi Formulir dibawah
              </p>
            </div>

            <div>
              <Label className={authLabelClassName}>Nama Mempelai</Label>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <AuthField
                  id="groomName"
                  aria-label="Nama mempelai pria"
                  value={details.groomName}
                  onChange={(event) => updateField("groomName", event.target.value)}
                  placeholder="Mempelai Pria"
                  required
                />
                <AuthField
                  id="brideName"
                  aria-label="Nama mempelai wanita"
                  value={details.brideName}
                  onChange={(event) => updateField("brideName", event.target.value)}
                  placeholder="Mempelai Wanita"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <AuthField
                label="Judul Undangan"
                id="invitationTitle"
                value={details.invitationTitle}
                onChange={(event) => updateField("invitationTitle", event.target.value)}
                placeholder="Pria dan Wanita"
                required
              />
              <div className="space-y-2">
                <AuthField
                  label="Url Undangan"
                  id="invitationUrl"
                  value={details.invitationUrl}
                  onChange={(event) => updateField("invitationUrl", event.target.value)}
                  placeholder="undangan-id"
                  required
                />
                <p className="text-[11px] text-muted-foreground">
                  {details.invitationUrl || "undangan"}.vowly.id
                </p>
              </div>
            </div>

            <WizardDateField
              id="eventDate"
              label="Waktu acara akan dilaksanakan"
              value={details.eventDate}
              onChange={(value) => updateField("eventDate", value)}
            />

            <div className="space-y-2">
              <Label htmlFor="preparationStage" className={authLabelClassName}>
                Sejauh mana Persiapanmu?
              </Label>
              <WizardSelect
                inputId="preparationStage"
                options={preparationStageOptions}
                value={selectedStage}
                onChange={(option) =>
                  updateField("preparationStage", option?.value ?? "")
                }
                placeholder="Pilih Tahap Persiapan"
              />
            </div>

            {error ? (
              <p className="flex items-start gap-2 rounded-xl bg-error/10 p-3 text-sm leading-6 text-error">
                <HiExclamationCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                {error}
              </p>
            ) : null}

            <Button type="submit" variant="rose" className="h-12 w-full px-8">
              Lanjut
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
