import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

const display = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const SITE_URL = "https://cracktab.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Cracktab — Shopify Website Design Agency",
    template: "%s · Cracktab",
  },
  description:
    "Cracktab designs and develops Shopify stores that look premium, move fast, and turn browsers into buyers — built for brands ready to grow.",
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
    title: "Cracktab — Shopify Website Design Agency",
    description:
      "Shopify stores built to perform. Built to last. From launch to scale.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cracktab — Shopify Website Design Agency",
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
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white font-sans">
        {children}
      </body>
    </html>
  );
}
