import type { Metadata, Viewport } from "next";
import { Nunito, Nunito_Sans } from "next/font/google";

import { Analytics } from "@/components/analytics";
import { getSettings } from "@/lib/settings/store";

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

export async function generateMetadata(): Promise<Metadata> {
  const { company } = await getSettings();
  const title = `${company.name} | Personalised IELTS Coaching`;
  return {
    metadataBase: new URL(company.domain),
    title: { default: title, template: `%s | ${company.name}` },
    description: company.description,
    applicationName: company.name,
    alternates: { canonical: "/" },
    // Without a configured favicon, Next serves app/icon.svg automatically.
    ...(company.faviconUrl ? { icons: { icon: company.faviconUrl } } : {}),
    openGraph: {
      description: company.description,
      locale: "en_IN",
      siteName: company.name,
      title,
      type: "website",
      url: company.domain,
    },
    twitter: { card: "summary_large_image", description: company.description, title },
  };
}

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#ffffff",
  width: "device-width",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      className={`${nunito.variable} ${nunitoDisplay.variable}`}
      data-scroll-behavior="smooth"
      lang="en"
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
