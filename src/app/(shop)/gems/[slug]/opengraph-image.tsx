import { ImageResponse } from "next/og";
import { getGemBySlug } from "@/actions/gems";
import { formatGemCarats, formatGemPrice } from "@/lib/utils";
import { DETAIL_ON_REQUEST } from "@/lib/catalog-gems";

export const alt = "Ceylon Natural Gemstone Specimen";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gem = await getGemBySlug(slug);

  const title = gem ? gem.name : "Ceylon Natural Gemstone Specimen";
  const variety = gem ? gem.variety : "Natural Corundum";
  const carats = gem ? formatGemCarats(gem.carat) : "Natural Weight";
  const price = gem ? formatGemPrice(gem.price, gem.currency) : "Price Upon Request";
  const origin = gem ? gem.origin : "Ratnapura, Sri Lanka";
  const lab = gem ? gem.certificate.lab : "NGJA Certified";
  const labBadge = lab ? `${lab} Authenticated` : "Natural Gemstone";
  const treatment = gem ? (gem.treatment === DETAIL_ON_REQUEST ? gem.cut : gem.treatment) : "Unheated";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0F172A",
          backgroundImage: "radial-gradient(circle at 60% 30%, #1E293B 0%, #090D16 100%)",
          color: "#FAF6EE",
          fontFamily: "serif",
          padding: "50px",
          border: "14px solid #B8924A",
          boxSizing: "border-box",
        }}
      >
        {/* Top Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(184, 146, 74, 0.4)",
            paddingBottom: "20px",
          }}
        >
          <div
            style={{
              fontSize: 20,
              textTransform: "uppercase",
              letterSpacing: "0.25em",
              color: "#B8924A",
              fontWeight: 600,
            }}
          >
            ISURU GEMS CEYLON
          </div>
          <div
            style={{
              fontSize: 14,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              backgroundColor: "rgba(184, 146, 74, 0.2)",
              color: "#E2D9C8",
              padding: "6px 14px",
              borderRadius: "4px",
              border: "1px solid #B8924A",
              fontFamily: "sans-serif",
            }}
          >
            {labBadge}
          </div>
        </div>

        {/* Center Specimen Details */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "auto",
            marginBottom: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "12px",
              fontFamily: "sans-serif",
              fontSize: 15,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#B8924A",
            }}
          >
            <span>{variety}</span>
            <span>•</span>
            <span>{carats}</span>
            <span>•</span>
            <span>{treatment}</span>
          </div>

          <div
            style={{
              fontSize: 52,
              fontWeight: 600,
              color: "#FAF6EE",
              lineHeight: 1.15,
              textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: 20,
              color: "#E2D9C8",
              fontFamily: "sans-serif",
              fontWeight: 300,
            }}
          >
            Origin: {origin} • Earth-Mined Direct Provenance
          </div>
        </div>

        {/* Bottom Acquisition Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid rgba(184, 146, 74, 0.4)",
            paddingTop: "20px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "rgba(250, 246, 238, 0.6)",
                fontFamily: "sans-serif",
              }}
            >
              Direct Mine Valuation
            </span>
            <span
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: "#60A5FA",
              }}
            >
              {price}
            </span>
          </div>

          <div
            style={{
              fontSize: 14,
              fontFamily: "sans-serif",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#B8924A",
            }}
          >
            Insured Armoured Courier Worldwide
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
