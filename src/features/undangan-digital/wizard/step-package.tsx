import { HiCheckCircle } from "react-icons/hi2";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WizardTopBar } from "./wizard-top-bar";
import { packages, formatRupiah } from "./wizard-data";

type StepPackageProps = {
  selectedPackageId: string | null;
  onSelectPackage: (packageId: string) => void;
  onNext: () => void;
};

export function StepPackage({
  selectedPackageId,
  onSelectPackage,
  onNext,
}: StepPackageProps) {
  return (
    <div className="min-h-screen bg-background">
      <WizardTopBar />

      <div className="mx-auto max-w-5xl px-6 pb-16 sm:px-10">
        <h1 className="text-center font-serif text-2xl font-bold text-foreground sm:text-3xl">
          Apa saja fitur yang akan di dapatkan?
        </h1>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {packages.map((pkg) => {
            const isSelected = pkg.id === selectedPackageId;

            return (
              <Card
                key={pkg.id}
                className={cn(
                  "relative flex h-full flex-col rounded-2xl border-card-border p-6 text-center shadow-sm shadow-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-lg",
                  isSelected && "border-primary ring-2 ring-primary/30",
                )}
              >
                {pkg.isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold tracking-wide text-primary-foreground uppercase">
                    Terpopuler
                  </span>
                )}

                <h2 className="mt-2 font-serif text-lg font-semibold text-foreground">
                  {pkg.name}
                </h2>
                <p className="mt-2 text-xl font-bold text-primary">
                  {formatRupiah(pkg.price)}
                </p>

                <ul className="mt-6 flex-1 space-y-3 text-left text-sm text-foreground/80">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <HiCheckCircle
                        className="mt-0.5 size-4 shrink-0 text-success"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  type="button"
                  variant={isSelected ? "rose" : "outline"}
                  className="mt-6 h-10 w-full rounded-full"
                  onClick={() => onSelectPackage(pkg.id)}
                >
                  {isSelected ? "Dipilih" : "Lihat Detail"}
                </Button>
              </Card>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Button
            type="button"
            variant="rose"
            className="h-12 px-10"
            disabled={!selectedPackageId}
            onClick={onNext}
          >
            Pesan Sekarang
          </Button>
        </div>
      </div>
    </div>
  );
}
