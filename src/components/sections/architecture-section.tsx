import { getTranslations } from "next-intl/server";
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

export async function ArchitectureSection() {
  const t = await getTranslations("Architecture");

  return (
    <section
      id="architecture"
      className="scroll-mt-20 overflow-hidden bg-slate-50 py-24 sm:py-32"
    >
      <Container className="grid items-center gap-14 lg:grid-cols-[.9fr_1.1fr]">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />
        <div className="relative">
          <div className="absolute -inset-8 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 p-3 shadow-2xl shadow-slate-300/50">
            <div className="flex items-center gap-2 border-b border-white/10 px-3 py-3">
              <span className="size-2.5 rounded-full bg-red-400" />
              <span className="size-2.5 rounded-full bg-amber-300" />
              <span className="size-2.5 rounded-full bg-emerald-400" />
              <span className="ml-3 font-mono text-xs text-slate-500">src/</span>
            </div>
            <div className="space-y-2 p-3 sm:p-5">
              {tree.map(({ name, note, icon: Icon }) => (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[.04] p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-lg bg-blue-500/15 text-blue-300">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-sm text-slate-100">{name}/</span>
                  </div>
                  <span className="text-xs text-slate-500">{note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
