import { ImageResponse } from "next/og";

export const alt = "Sky Voice Languages — Know what is holding back your IELTS score";
export const size = { height: 630, width: 1200 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "radial-gradient(circle at 85% 20%, rgba(235,157,19,.35), transparent 25%), linear-gradient(135deg, #0e2d5e 0%, #1655d8 100%)",
          color: "white",
          display: "flex",
          fontFamily: "Arial, sans-serif",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px 82px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: 760 }}>
          <div style={{ color: "#f7c35f", fontSize: 28, fontWeight: 700 }}>
            SKY VOICE LANGUAGES
          </div>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, marginTop: 30 }}>
            Know what is holding back your IELTS score.
          </div>
          <div style={{ color: "#dce8ff", fontSize: 28, marginTop: 28 }}>
            Free assessment · Personal roadmap · Academic + General
          </div>
        </div>
        <div
          style={{
            alignItems: "center",
            background: "#ffffff",
            border: "12px solid rgba(255,255,255,.25)",
            borderRadius: 999,
            color: "#0e2d5e",
            display: "flex",
            flexDirection: "column",
            height: 260,
            justifyContent: "center",
            width: 260,
          }}
        >
          <div style={{ color: "#52657a", fontSize: 24 }}>YOUR TARGET</div>
          <div style={{ color: "#1655d8", fontSize: 86, fontWeight: 900 }}>7.0</div>
        </div>
      </div>
    ),
    size,
  );
}
