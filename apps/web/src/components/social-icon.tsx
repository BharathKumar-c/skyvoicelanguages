import type { SVGProps } from "react";

import type { SocialPlatform } from "@/content/contact";

/**
 * Outline social glyphs drawn on lucide's 24px grid with a 2px rounded stroke,
 * so they sit naturally beside the site's lucide icons (the installed lucide
 * version no longer ships brand icons).
 */
const paths: Record<SocialPlatform, React.ReactNode> = {
  facebook: <path d="M14.5 8H17V4.5h-2.5A4 4 0 0 0 10.5 8.5V11H8v3.5h2.5V21H14v-6.5h2.6l.4-3.5h-3V9a1 1 0 0 1 1-1Z" />,
  instagram: (
    <>
      <rect height="17" rx="5" width="17" x="3.5" y="3.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" fill="currentColor" r="0.8" stroke="none" />
    </>
  ),
  youtube: (
    <>
      <rect height="14" rx="4" width="20" x="2" y="5" />
      <path d="m10 9 5 3-5 3Z" />
    </>
  ),
  linkedin: (
    <>
      <rect height="17" rx="3" width="17" x="3.5" y="3.5" />
      <path d="M8 10.5V16M8 7.5v.01M11.5 16v-3.2a2.3 2.3 0 0 1 4.5 0V16M11.5 10.5V16" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3.1 3.1Z" />
      <path d="M9 9.2c0 3 2.8 5.8 5.8 5.8l1.2-1.4-1.9-1-1 .8a4 4 0 0 1-2.5-2.5l.8-1-1-1.9Z" />
    </>
  ),
  google: (
    <>
      <path d="M20 12a8 8 0 1 1-2.4-5.7" />
      <path d="M20 12h-7.5" />
    </>
  ),
};

export const socialLabels: Record<SocialPlatform, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  whatsapp: "WhatsApp",
  google: "Google Business Profile",
};

export function SocialIcon({
  platform,
  ...props
}: { platform: SocialPlatform } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      {...props}
    >
      {paths[platform]}
    </svg>
  );
}
