import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const alt = "Sky Voice Languages — Know what is holding back your IELTS score";
export const size = { height: 630, width: 1200 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  // Validated canonical pose (384×456, transparent) so link previews show Aira.
  const aira = await readFile(join(process.cwd(), "public/mascot/canonical/aira-front.png"));
  const airaSrc = `data:image/png;base64,${aira.toString("base64")}`;

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
            background:
              "radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 55%, transparent 70%)",
            borderRadius: 999,
            display: "flex",
            height: 420,
            justifyContent: "center",
            width: 420,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img */}
          <img alt="" height={392} src={airaSrc} width={330} />
        </div>
      </div>
    ),
    size,
  );
}
