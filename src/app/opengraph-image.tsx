import { ImageResponse } from "next/og";

export const alt = "Ganipedia Next.js Starter";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "radial-gradient(circle at 78% 32%, #4338ca 0, #172554 25%, #070a12 58%)",
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
              color: "#93c5fd",
              display: "flex",
              fontSize: 26,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Ganipedia starter
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
            Mulai lebih cepat. Tetap rapi saat bertumbuh.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
