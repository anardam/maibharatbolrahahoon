import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Format slug into a readable title
  const title = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #B8380F 0%, #D44A1A 50%, #E8652E 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Tricolor top */}
        <div style={{ display: "flex", height: "6px", width: "100%" }}>
          <div style={{ flex: 1, background: "#FF9933" }} />
          <div style={{ flex: 1, background: "#FFFFFF" }} />
          <div style={{ flex: 1, background: "#138808" }} />
        </div>

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            padding: "60px 80px",
          }}
        >
          <div
            style={{
              fontSize: title.length > 60 ? "38px" : "48px",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              maxWidth: "900px",
            }}
          >
            {title}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 80px",
            borderTop: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <div style={{ fontSize: "16px", fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>
            Mai Bharat Bol Raha Hoon
          </div>
          <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
            maibharatbolrahahoon.com
          </div>
        </div>

        {/* Tricolor bottom */}
        <div style={{ display: "flex", height: "6px", width: "100%" }}>
          <div style={{ flex: 1, background: "#FF9933" }} />
          <div style={{ flex: 1, background: "#FFFFFF" }} />
          <div style={{ flex: 1, background: "#138808" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
