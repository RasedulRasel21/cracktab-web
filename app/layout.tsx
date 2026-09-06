import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

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

const SITE_URL = "https://cracktab.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${urbanist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-black text-white font-sans">
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
