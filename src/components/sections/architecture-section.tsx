import {
  HiOutlineFolder,
  HiOutlineFolderOpen,
  HiOutlineMap,
  HiOutlineShieldCheck,
} from "react-icons/hi2";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const tree = [
  { name: "app", note: "routing & metadata", icon: HiOutlineMap },
  { name: "features", note: "domain modules", icon: HiOutlineFolder },
  { name: "components", note: "shared UI", icon: HiOutlineFolderOpen },
  { name: "lib", note: "api, logger, helpers", icon: HiOutlineShieldCheck },
];

export function ArchitectureSection() {
  return (
    <section
      id="architecture"
      className="scroll-mt-20 overflow-hidden bg-[#f7f9fc] py-20 sm:py-28"
    >
      <Container className="grid items-center gap-14 lg:grid-cols-[.9fr_1.1fr]">
        <SectionHeading
          eyebrow="Struktur proyek"
          title="Layout yang membuat fitur ecommerce mudah ditemukan."
          description="Route memegang halaman, feature menyimpan order dan product, component membawa UI reusable, dan lib menjaga auth, env, logger, serta helper tetap terpusat."
        />
        <div className="relative">
          <div className="absolute -inset-8 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl shadow-blue-100/60">
            <div className="flex items-center gap-2 border-b border-neutral-200 px-3 py-3">
              <span className="size-2.5 rounded-full bg-red-400" />
              <span className="size-2.5 rounded-full bg-amber-300" />
              <span className="size-2.5 rounded-full bg-emerald-400" />
              <span className="ml-3 font-mono text-xs text-neutral-400">src/</span>
            </div>
            <div className="space-y-2 p-3 sm:p-5">
              {tree.map(({ name, note, icon: Icon }) => (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50/80 p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-lg bg-blue-50 text-blue-600">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-sm font-semibold text-neutral-950">{name}/</span>
                  </div>
                  <span className="text-xs text-neutral-500">{note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
