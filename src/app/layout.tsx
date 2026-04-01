import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import type { ReactNode } from "react";

import "../styles/globals.css";

const bodyFont = Barlow({
  subsets: ["latin"],
  variable: "--font-barlow",
  weight: ["400", "500", "600", "700"],
  display: "swap"
});

const displayFont = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
  weight: ["600", "700"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Content-Driven Business Website",
  description: "A Next.js site rendered directly from the project source material."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#10273f"
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
