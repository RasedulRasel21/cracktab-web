import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { SITE_URL } from "./lib/site";

// Self-hosted Urbanist (files in /public/fonts) — used site-wide.
const urbanist = localFont({
  src: [
    { path: "../public/fonts/Urbanist-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/Urbanist-Medium.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/Urbanist-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/Urbanist-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Every page sets its own; this is the default for anything that doesn't.
  // The site had no canonical tag at all before — an SEO audit flagged it.
  alternates: { canonical: "/" },
  title: {
    default: "Cracktab — Shopify Website Design and Development Agency",
    template: "%s · Cracktab",
  },
  description:
    "Scale your Shopify store with Cracktab. Expert custom web development, store redesigns, and data-driven CRO strategies to boost conversions and sales.",
  keywords: [
    "Shopify agency",
    "Shopify Plus partner",
    "Shopify development",
    "ecommerce design",
    "CRO",
    "Shopify apps",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Cracktab",
    title: "Cracktab — Shopify Website Design and Development Agency",
    description:
      "Shopify stores built to perform. Built to last. From launch to scale.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cracktab — Shopify Website Design and Development Agency",
    description:
      "Shopify stores built to perform. Built to last. From launch to scale.",
  },
  icons: { icon: { url: "/favicon.svg", type: "image/svg+xml" } },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${urbanist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-black text-white font-sans">
        {/* `site-chrome` is hidden on studio pages by CSS (see globals.css).
            A client-side URL check would need the studio path in the
            JavaScript served to every public visitor. */}
        <div className="site-chrome contents">
          <Header />
        </div>
        <main className="flex flex-1 flex-col">{children}</main>
        <div className="site-chrome contents">
          <Footer />
        </div>
      </body>
    </html>
  );
}
