import { HiCheckCircle } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WizardTopBar } from "./wizard-top-bar";
import { invitationTemplates, packages, formatRupiah } from "./wizard-data";

type StepTemplateProps = {
  packageId: string;
  selectedTemplateId: string | null;
  onSelectTemplate: (templateId: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export function StepTemplate({
  packageId,
  selectedTemplateId,
  onSelectTemplate,
  onBack,
  onNext,
}: StepTemplateProps) {
  const selectedPackage = packages.find((pkg) => pkg.id === packageId) ?? packages[0]!;

  return (
    <div className="min-h-screen bg-background pb-28">
      <WizardTopBar onBack={onBack} />

      <div className="mx-auto max-w-3xl px-6 sm:px-10">
        <h1 className="font-serif text-xl font-bold text-foreground sm:text-2xl">
          Berikut paket yang dapat kamu pilih sesuai dengan kebutuhanmu
        </h1>

        <Card className="mt-6 rounded-2xl border-card-border p-6 shadow-sm shadow-black/5">
          <div className="flex items-center justify-between">
            <span className="font-serif text-lg font-semibold text-foreground">
              {selectedPackage.name}
            </span>
            <span className="font-semibold text-primary">
              {formatRupiah(selectedPackage.price)}
            </span>
          </div>
          <ul className="mt-4 grid gap-2 text-sm text-foreground/80 sm:grid-cols-2">
            {selectedPackage.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <HiCheckCircle className="size-4 shrink-0 text-success" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
        </Card>

        <div className="mt-10 text-center">
          <h2 className="font-serif text-lg font-bold text-foreground">
            Template Desain
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pilih tema undangan dan dekorasi dasar yang sesuai dengan
            karakter hari bahagiamu.
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {invitationTemplates.map((template) => {
            const isSelected = template.id === selectedTemplateId;

            return (
              <button
                key={template.id}
                type="button"
                onClick={() => onSelectTemplate(template.id)}
                className={cn(
                  "flex flex-col items-center rounded-2xl border border-card-border bg-card p-4 text-center shadow-sm shadow-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-lg",
                  isSelected && "border-primary ring-2 ring-primary/30",
                )}
              >
                <div
                  className="flex aspect-3/4 w-full items-center justify-center rounded-xl border"
                  style={{
                    borderColor: template.colors[1],
                    background: `linear-gradient(160deg, ${template.colors[0]} 0%, ${template.colors[0]} 100%)`,
                  }}
                >
                  <span
                    className="font-serif text-sm font-semibold tracking-wide"
                    style={{ color: template.colors[1] }}
                  >
                    {template.name}
                  </span>
                </div>

                <p className="mt-3 text-sm font-semibold text-foreground">
                  {template.name}
                </p>
                <p className="text-xs text-muted-foreground">{template.tagline}</p>

                <span className="mt-2 flex items-center gap-1.5 text-xs font-medium text-primary">
                  <span
                    className={cn(
                      "grid size-3.5 place-items-center rounded-full border",
                      isSelected ? "border-primary bg-primary" : "border-border",
                    )}
                  >
                    {isSelected && (
                      <span className="size-1.5 rounded-full bg-primary-foreground" />
                    )}
                  </span>
                  {isSelected ? "Dipilih" : "Pilih Desain"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-card-border bg-background/95 px-6 py-4 backdrop-blur sm:px-10">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-bold text-primary">
              {formatRupiah(selectedPackage.price)}
            </p>
          </div>
          <Button
            type="button"
            variant="rose"
            className="h-11 px-8"
            disabled={!selectedTemplateId}
            onClick={onNext}
          >
            Pesan Sekarang
          </Button>
        </div>
      </div>
    </div>
  );
}
