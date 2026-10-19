import Script from "next/script";

import { getSettings } from "@/lib/settings/store";

/**
 * Google Analytics 4 and Meta Pixel, loaded only when an administrator has
 * enabled analytics AND entered the matching ID in Website Settings. Only page
 * views are sent — never form contents (see the privacy notice).
 */
export async function Analytics() {
  const { analytics } = (await getSettings()).integrations;
  if (!analytics.enabled) return null;
  const { ga4MeasurementId: ga4, metaPixelId: pixel } = analytics;

  return (
    <>
      {ga4 ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(ga4)});`}
          </Script>
        </>
      ) : null}
      {pixel ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(pixel)});fbq('track','PageView');`}
        </Script>
      ) : null}
    </>
  );
}
