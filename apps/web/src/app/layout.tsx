import type { Metadata, Viewport } from "next";
import { Noto_Sans_Tamil, Nunito, Nunito_Sans } from "next/font/google";

import { Analytics } from "@/components/analytics";
import { I18nProvider } from "@/i18n/client";
import { localeInfo } from "@/i18n/config";
import { format } from "@/i18n/merge";
import { getLocale, getMessages } from "@/i18n/server";
import { sampleContentEnabled } from "@/lib/settings/sample";
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

// Nunito has no Tamil glyphs. Every font stack lists this face right after
// Nunito, so Tamil characters use it while Latin text keeps Nunito. Not
// preloaded: the browser only downloads it when a page shows Tamil text.
const notoTamil = Noto_Sans_Tamil({
  display: "swap",
  preload: false,
  subsets: ["tamil"],
  variable: "--font-tamil",
});

export async function generateMetadata(): Promise<Metadata> {
  const [{ company }, m, locale] = await Promise.all([getSettings(), getMessages(), getLocale()]);
  const title = format(m.layout.siteTitle, { company: company.name });
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
      locale: locale === "ta" ? "ta_IN" : "en_IN",
      siteName: company.name,
      title,
      type: "website",
      url: company.domain,
    },
    twitter: { card: "summary_large_image", description: company.description, title },
    // Sample content must never be indexed.
    ...(sampleContentEnabled() ? { robots: { index: false, follow: false } } : {}),
  };
}

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#ffffff",
  width: "device-width",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [locale, m] = await Promise.all([getLocale(), getMessages()]);
  return (
    <html
      className={`${nunito.variable} ${nunitoDisplay.variable} ${notoTamil.variable}`}
      data-scroll-behavior="smooth"
      lang={localeInfo(locale).htmlLang}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <a className="skip-link" href="#main-content">
          {m.layout.skipLink}
        </a>
        {sampleContentEnabled() ? (
          <p className="sample-banner" role="note">
            <strong>{m.layout.sampleBannerStrong}</strong> {m.layout.sampleBanner}
          </p>
        ) : null}
        <I18nProvider locale={locale} messages={m.client}>
          {children}
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  );
}
