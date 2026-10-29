import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

/**
 * The default share image (1200×630) for every page that doesn't set its own:
 * LinkedIn, Facebook, X and Slack showed links with no image at all before.
 * Blog posts with a cover image and the Shopify app pages override it.
 */
export const alt = "Cracktab — Shopify Website Design and Development Agency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT = "#b4f03a";

export default async function OpengraphImage() {
  const fonts = path.join(process.cwd(), "public", "fonts");
  const [semiBold, medium] = await Promise.all([
    readFile(path.join(fonts, "Urbanist-SemiBold.ttf")),
    readFile(path.join(fonts, "Urbanist-Medium.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0b0b0d",
          color: "#ffffff",
          fontFamily: "Urbanist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", gap: 10 }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div key={c} style={{ width: 22, height: 22, borderRadius: 11, background: c }} />
            ))}
          </div>
          <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: -1 }}>cracktab</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 82, fontWeight: 600, lineHeight: 1.05, letterSpacing: -2 }}>
            <span>Shopify stores built</span>
            <span style={{ color: ACCENT }}>to perform.</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 500, color: "#a1a1aa" }}>
            Store design and development, custom apps, SEO and CRO
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, fontWeight: 500, color: "#a1a1aa" }}>
          <span>cracktab.com</span>
          <span style={{ color: ACCENT }}>Shopify agency</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Urbanist", data: semiBold, weight: 600, style: "normal" },
        { name: "Urbanist", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}
