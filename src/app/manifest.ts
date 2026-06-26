import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ganipedia Next.js Starter",
    short_name: "Ganipedia",
    description: "Starter Next.js modern dari Ganipedia.",
    start_url: "/",
    display: "standalone",
    background_color: "#070a12",
    theme_color: "#070a12",
  };
}
