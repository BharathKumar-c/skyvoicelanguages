import type { Metadata, Viewport } from "next";
import { Nunito, Nunito_Sans } from "next/font/google";

import { siteConfig } from "@/config/site";

import "./globals.css";

const nunito = Nunito_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-nunito",
});

// Rounded display face for H1/H2 only (design-system amendment, 15 Oct 2026).
const nunitoDisplay = Nunito({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Sky Voice Languages | Personalised IELTS Coaching",
    template: "%s | Sky Voice Languages",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    description: siteConfig.description,
    locale: "en_IN",
    siteName: siteConfig.name,
    title: "Sky Voice Languages | Personalised IELTS Coaching",
    type: "website",
    url: siteConfig.url,
  },
  twitter: {
    card: "summary_large_image",
    description: siteConfig.description,
    title: "Sky Voice Languages | Personalised IELTS Coaching",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#ffffff",
  width: "device-width",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={`${nunito.variable} ${nunitoDisplay.variable}`} lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
