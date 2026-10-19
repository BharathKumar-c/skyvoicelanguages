"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";

/**
 * Link to the home (campaign) page. When the visitor is already on that page —
 * e.g. reading Fees — a plain navigation to the same URL leaves the scroll
 * position where it is, so this scrolls smoothly to the top instead and drops
 * any #section from the address bar. From other pages it is a normal link.
 */
export function HomeLink({ href, onClick, ...props }: ComponentProps<typeof Link> & { href: string }) {
  const pathname = usePathname();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    const plainClick = event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
    if (event.defaultPrevented || !plainClick || pathname !== href) return;

    event.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ behavior: reduceMotion ? "auto" : "smooth", top: 0 });
    if (window.location.hash) window.history.replaceState(window.history.state, "", href);
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
