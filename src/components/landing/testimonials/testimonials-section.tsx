import { Container } from "@/components/ui/container";
import { testimonials } from "@/components/landing/landing-data";
import { TestimonialCard } from "./testimonial-card";

export function TestimonialsSection() {
  return (
    <section className="bg-muted py-20 sm:py-28">
      <Container>
        <h2 className="text-center font-serif text-2xl font-bold text-foreground sm:text-3xl">
          Bagaimana Kata Mereka?
        </h2>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </div>
      </Container>
    </section>
  );
}
