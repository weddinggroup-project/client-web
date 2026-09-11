import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "radial-gradient(circle at 78% 32%, #a97078 0, #6b3f45 25%, #201c1b 58%)",
          color: "white",
          display: "flex",
          height: "100%",
          padding: "80px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 880 }}>
          <div
            style={{
              color: "#f6e4e8",
              display: "flex",
              fontSize: 26,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            {siteConfig.name} — Wedding Planner
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: -5,
              lineHeight: 1.02,
              marginTop: 24,
            }}
          >
            Rencanakan Pernikahan Impianmu Tanpa Ribet
          </div>
        </div>
      </div>
    ),
    size,
  );
}
