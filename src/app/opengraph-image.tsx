import { ImageResponse } from "next/og";

export const alt = "Isuru Gems Ceylon | Fine Natural Sapphires & Island Gemstones";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0F172A",
          backgroundImage: "radial-gradient(circle at 50% 40%, #1E293B 0%, #090D16 100%)",
          color: "#FAF6EE",
          fontFamily: "serif",
          padding: "60px",
          position: "relative",
          border: "16px solid #B8924A",
        }}
      >
        {/* Inner decorative border */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            bottom: "20px",
            left: "20px",
            right: "20px",
            border: "1px solid rgba(184, 146, 74, 0.4)",
            display: "flex",
          }}
        />

        {/* Brand Tagline */}
        <div
          style={{
            fontSize: 16,
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            color: "#B8924A",
            marginBottom: 20,
            fontWeight: 600,
          }}
        >
          Treasures of Serendib • Established 1964
        </div>

        {/* Main Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 600,
            color: "#FAF6EE",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: 20,
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          ISURU GEMS CEYLON
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: "#E2D9C8",
            textAlign: "center",
            maxWidth: "850px",
            lineHeight: 1.4,
            marginBottom: 40,
            fontFamily: "sans-serif",
            fontWeight: 300,
          }}
        >
          Natural Unheated Ceylon Sapphires, Padparadschas & Rare Earth-Mined Island Gemstones
        </div>

        {/* Bottom Trust Markers */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            alignItems: "center",
            fontFamily: "sans-serif",
            fontSize: 15,
            color: "#B8924A",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
          }}
        >
          <span>Ratnapura Alluvial Mines</span>
          <span>•</span>
          <span>NGJA & GRS Certified</span>
          <span>•</span>
          <span>Mine-to-Market Provenance</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
