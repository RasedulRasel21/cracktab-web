import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

/**
 * The default share image (1200×630) for every page that doesn't set its own:
 * LinkedIn, Facebook, X and Slack showed links with no image at all before.
 * Blog posts with a cover image and the Shopify app pages override it.
 */
export const alt = "Cracktab — Shopify CRO Agency for DTC Brands";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT = "#b4f03a";
const CREAM = "#f3eee4";
const INK = "#141413";
const MUTED = "#5f594f";

export default async function OpengraphImage() {
  const fonts = path.join(process.cwd(), "public", "fonts");
  const [bold, medium] = await Promise.all([
    readFile(path.join(fonts, "Urbanist-Bold.ttf")),
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
          padding: "64px 80px",
          background: CREAM,
          color: INK,
          fontFamily: "Urbanist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ display: "flex", gap: 10 }}>
              {["#ff5f57", "#febc2e", ACCENT].map((c) => (
                <div key={c} style={{ width: 22, height: 22, borderRadius: 11, background: c }} />
              ))}
            </div>
            <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1 }}>cracktab</div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 24px",
              borderRadius: 999,
              border: "2px solid rgba(20,20,19,0.12)",
              background: "#fbf8f2",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 3,
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: 6, background: ACCENT }} />
            SHOPIFY CRO AGENCY
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 84, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2.5 }}>
          <span>Helping DTC brands turn</span>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 22 }}>
            <span>more visitors into</span>
            <div style={{ display: "flex", position: "relative" }}>
              <div style={{ position: "absolute", left: -6, right: -6, bottom: 8, height: 30, background: ACCENT, borderRadius: 4 }} />
              <span style={{ position: "relative" }}>revenue</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, fontWeight: 500, color: MUTED }}>
          <span>CRO · Ecommerce management · Shopify development</span>
          <span style={{ color: INK, fontWeight: 700 }}>cracktab.com</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Urbanist", data: bold, weight: 700, style: "normal" },
        { name: "Urbanist", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}
