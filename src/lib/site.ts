export const siteConfig = {
  name: "Vowly",
  title: "Vowly — Rencanakan Pernikahan Impianmu",
  description:
    "Vowly membantu calon pengantin merencanakan pernikahan yang lebih terarah, hemat waktu, dan minim stres — mulai dari vendor, budget, hingga tamu undangan.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3303",
  links: {
    github: "https://github.com/ganiramadhan",
    docs: "https://nextjs.org/docs",
  },
} as const;
