import { Container } from "@/components/ui/container";
import { invitationSteps } from "../undangan-digital-data";

export function ProductSteps() {
  return (
    <section className="bg-background py-20 sm:py-24">
      <Container>
        <h2 className="text-center text-lg font-semibold tracking-wide text-foreground uppercase sm:text-xl">
          4 Langkah Saat Akan Mengirimkan Undangan
        </h2>

        <div className="mt-14 grid gap-10 sm:grid-cols-4">
          {invitationSteps.map(({ step, title }, index) => (
            <div key={step} className="group relative text-center">
              {index < invitationSteps.length - 1 && (
                <span
                  className="absolute top-6 left-1/2 hidden h-px w-full border-t border-dashed border-accent/40 sm:block"
                  aria-hidden="true"
                />
              )}

              <span className="relative z-10 mx-auto grid size-12 place-items-center rounded-full border-2 border-accent/50 bg-background font-serif text-lg font-semibold text-accent transition-all duration-300 group-hover:scale-110 group-hover:border-primary group-hover:text-primary">
                {step}
              </span>
              <p className="mt-4 text-sm leading-6 text-foreground/80">
                {title}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
