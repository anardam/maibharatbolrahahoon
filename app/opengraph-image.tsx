import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mai Bharat Bol Raha Hoon — Voice of India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #B8380F 0%, #D44A1A 50%, #E8652E 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Tricolor bar at top */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", height: "6px" }}>
          <div style={{ flex: 1, background: "#FF9933" }} />
          <div style={{ flex: 1, background: "#FFFFFF" }} />
          <div style={{ flex: 1, background: "#138808" }} />
        </div>

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px",
          }}
        >
          <div
            style={{
              fontSize: "52px",
              fontWeight: 800,
              color: "white",
              textAlign: "center",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            Mai Bharat Bol Raha Hoon
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "rgba(255,255,255,0.8)",
              marginTop: "16px",
              textAlign: "center",
            }}
          >
            Voice of India — News, Stories & Perspectives
          </div>
        </div>

        {/* Bottom tricolor */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, display: "flex", height: "6px" }}>
          <div style={{ flex: 1, background: "#FF9933" }} />
          <div style={{ flex: 1, background: "#FFFFFF" }} />
          <div style={{ flex: 1, background: "#138808" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
