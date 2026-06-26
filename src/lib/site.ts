export const siteConfig = {
  name: "Ganipedia",
  title: "Ganipedia Next.js Starter",
  description:
    "Starter Next.js modern dari Ganipedia untuk membangun produk web yang rapi, aman, dan mudah dikembangkan.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  links: {
    github: "https://github.com/ganiramadhan",
    docs: "https://nextjs.org/docs",
  },
} as const;
