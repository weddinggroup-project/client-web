import {
  HiOutlineBeaker,
  HiOutlineBolt,
  HiOutlineCloudArrowUp,
  HiOutlineCommandLine,
  HiOutlineShieldCheck,
  HiOutlineSquares2X2,
} from "react-icons/hi2";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export function FeaturesSection() {
  const features = [
    { icon: HiOutlineBolt, title: "Dashboard-first shell", description: "Overview, order, product, profile, dan settings memakai satu layout admin yang konsisten." },
    { icon: HiOutlineShieldCheck, title: "Akses email/password", description: "Login dummy admin, UI email/password, protected route, dan helper session siap diganti ke auth asli." },
    { icon: HiOutlineSquares2X2, title: "Routing satu bahasa", description: "Route publik tanpa prefix locale, copy Indonesia, dan navigation disederhanakan untuk starter lokal." },
    { icon: HiOutlineCommandLine, title: "Boundary app yang typed", description: "Infrastruktur shared untuk env, auth, logger, API helper, dan validasi route." },
    { icon: HiOutlineBeaker, title: "Kontrol profesional", description: "React Select, date picker, modal CRUD, alert, pagination, filter, skeleton, dan empty state." },
    {
      icon: HiOutlineCloudArrowUp,
      title: "Workflow quality",
      description: "Lint, typecheck, E2E test, production build, Docker, dan default yang ramah CI.",
    },
  ];

  return (
    <section id="features" className="scroll-mt-20 bg-white py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Fondasi siap commerce"
          title="Semua kebutuhan awal admin panel sebelum data asli disambungkan."
          description="Template ini membawa workflow ecommerce yang utuh, layout clean, dan tempat yang jelas untuk mengganti dummy data ke service production."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-xl border border-neutral-200/70 bg-white p-6 shadow-sm shadow-neutral-200/50"
            >
              <div className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-950">
                {title}
              </h3>
              <p className="mt-2 leading-7 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
