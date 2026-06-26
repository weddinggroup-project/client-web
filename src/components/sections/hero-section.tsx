import { getTranslations } from "next-intl/server";
import { HiArrowRight, HiCheckCircle } from "react-icons/hi2";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

function ArchitectureVisual() {
  return (
    <svg
      viewBox="0 0 720 620"
      role="img"
      aria-labelledby="hero-visual-title hero-visual-description"
      className="h-auto w-full"
    >
      <title id="hero-visual-title">Arsitektur modular aplikasi Next.js</title>
      <desc id="hero-visual-description">
        Node dan kartu yang menggambarkan routing, feature, API, dan validasi.
      </desc>
      <defs>
        <linearGradient id="panel" x1="60" y1="40" x2="640" y2="590">
          <stop stopColor="#172554" stopOpacity=".94" />
          <stop offset="1" stopColor="#0f172a" stopOpacity=".96" />
        </linearGradient>
        <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#22d3ee" />
          <stop offset=".5" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0V32" fill="none" stroke="#94a3b8" strokeOpacity=".08" />
        </pattern>
      </defs>
      <rect x="24" y="24" width="672" height="572" rx="40" fill="url(#panel)" />
      <rect x="24" y="24" width="672" height="572" rx="40" fill="url(#grid)" />
      <rect
        x="24.5"
        y="24.5"
        width="671"
        height="571"
        rx="39.5"
        fill="none"
        stroke="#e2e8f0"
        strokeOpacity=".16"
      />
      <g fill="none" stroke="#60a5fa" strokeOpacity=".42" strokeWidth="2">
        <path d="M360 310 192 168" />
        <path d="M360 310 528 168" />
        <path d="M360 310 192 452" />
        <path d="M360 310 528 452" />
      </g>
      <circle cx="360" cy="310" r="72" fill="#2563eb" fillOpacity=".18" />
      <circle cx="360" cy="310" r="52" fill="url(#accent)" />
      <path
        d="m337 311 15 15 32-36"
        fill="none"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="10"
      />
      <text x="360" y="390" fill="#cbd5e1" fontSize="15" textAnchor="middle">
        production ready
      </text>
      {[
        { x: 92, y: 104, label: "app/", detail: "routes & layouts", color: "#22d3ee" },
        { x: 428, y: 104, label: "features/", detail: "business domain", color: "#60a5fa" },
        { x: 92, y: 408, label: "lib/api", detail: "typed fetch", color: "#818cf8" },
        { x: 428, y: 408, label: "validation", detail: "safe boundaries", color: "#c084fc" },
      ].map((card) => (
        <g key={card.label}>
          <rect
            x={card.x}
            y={card.y}
            width="200"
            height="112"
            rx="20"
            fill="#0f172a"
            stroke="#e2e8f0"
            strokeOpacity=".16"
          />
          <circle cx={card.x + 30} cy={card.y + 32} r="7" fill={card.color} />
          <text
            x={card.x + 50}
            y={card.y + 38}
            fill="#f8fafc"
            fontFamily="ui-monospace, monospace"
            fontSize="18"
            fontWeight="600"
          >
            {card.label}
          </text>
          <text x={card.x + 24} y={card.y + 78} fill="#94a3b8" fontSize="14">
            {card.detail}
          </text>
        </g>
      ))}
    </svg>
  );
}

export async function HeroSection() {
  const t = await getTranslations("Hero");
  const checks = [t("check1"), t("check2"), t("check3")];

  return (
    <section className="relative isolate overflow-hidden bg-slate-950 pb-24 pt-36 text-white sm:pt-44">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_28%,rgba(37,99,235,.18),transparent_36%),radial-gradient(circle_at_85%_70%,rgba(124,58,237,.12),transparent_30%)]" />
      <Container className="relative grid items-center gap-14 lg:grid-cols-[1.02fr_.98fr]">
        <div className="max-w-3xl">
          <Badge>
            <span className="size-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#67e8f9]" />
            {t("badge")}
          </Badge>
          <h1 className="mt-7 text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl">
            {t("title")}
            <span className="block bg-gradient-to-r from-blue-300 via-cyan-200 to-violet-300 bg-clip-text text-transparent">
              {t("highlight")}
            </span>
          </h1>
          <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-slate-300 sm:text-xl">
            {t("description")}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#architecture">
              {t("structure")}
              <HiArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="#components" variant="secondary">
              {t("components")}
            </ButtonLink>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
            {checks.map((check) => (
              <li key={check} className="flex items-center gap-2">
                <HiCheckCircle className="size-4 text-cyan-300" aria-hidden="true" />
                {check}
              </li>
            ))}
          </ul>
        </div>
        <div className="mx-auto w-full max-w-2xl lg:mx-0">
          <ArchitectureVisual />
        </div>
      </Container>
    </section>
  );
}
