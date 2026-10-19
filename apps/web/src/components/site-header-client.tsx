"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { navigation, siteConfig } from "@/config/site";

import { BrandLogo } from "./brand-logo";
import { HomeLink } from "./home-link";

/** Splits "/path#section" into its parts; plain page links have no section. */
function parseHref(href: string) {
  const [path, section] = href.split("#");
  return { path, section: section ?? null };
}

export type SiteHeaderProps = { logoSrc: string; ctaLabel: string; ctaHref: string };

export function SiteHeaderClient({ logoSrc, ctaLabel, ctaHref }: SiteHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState<string | null>(null);

  // Scroll-spy (campaign page only): underline the section crossing mid-screen.
  // "Home" is tracked by the hero (#top), so it is active only at the top of the
  // page, not while Fees or any other lower section is in view.
  useEffect(() => {
    const tracked: { href: string; el: HTMLElement }[] = [];
    for (const item of navigation) {
      const { path, section } = parseHref(item.href);
      if (path !== pathname) continue;
      const el = document.getElementById(section ?? "top");
      if (el) tracked.push({ href: item.href, el });
    }
    if (!tracked.length) return;

    const hrefFor = new Map(tracked.map((item) => [item.el, item.href]));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const href = hrefFor.get(entry.target as HTMLElement) ?? null;
          if (entry.isIntersecting) setActiveHref(href);
          else setActiveHref((current) => (current === href ? null : current));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    tracked.forEach((item) => observer.observe(item.el));
    return () => {
      observer.disconnect();
      setActiveHref(null);
    };
  }, [pathname]);

  const currentFor = (href: string) => {
    if (href.includes("#")) return activeHref === href ? ("location" as const) : undefined;
    // On the campaign page Home follows the scroll-spy; other pages match by path.
    if (href === siteConfig.campaignPath && pathname === href) {
      return activeHref === href ? ("page" as const) : undefined;
    }
    return pathname === href ? ("page" as const) : undefined;
  };
  const NavLink = (href: string) => (href === siteConfig.campaignPath ? HomeLink : Link);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // The hero already shows the assessment CTA and form, so the header button and
  // the mobile bar only appear once the hero has scrolled away (CSS reads this).
  useEffect(() => {
    const root = document.documentElement;
    const hero = document.getElementById("top");
    if (!hero) {
      root.dataset.hero = "passed";
      return () => {
        delete root.dataset.hero;
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        root.dataset.hero = entry.isIntersecting ? "in-view" : "passed";
      },
      { rootMargin: "-96px 0px 0px 0px" },
    );
    observer.observe(hero);
    return () => {
      observer.disconnect();
      delete root.dataset.hero;
    };
  }, [pathname]);

  useEffect(() => {
    document.body.dataset.menuOpen = open ? "true" : "false";
    if (!open) {
      return () => {
        delete document.body.dataset.menuOpen;
      };
    }

    // Escape closes the open menu, and widening past the mobile breakpoint
    // (where the menu is hidden) resets it so it is not stuck open later.
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 921px)");
    const onWiden = () => {
      if (desktop.matches) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onWiden);
    return () => {
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onWiden);
      delete document.body.dataset.menuOpen;
    };
  }, [open]);

  return (
    <header className="site-header" data-scrolled={scrolled}>
      <div className="site-shell header-inner">
        <Link aria-label="Sky Voice Languages home" className="header-brand" href="/">
          <BrandLogo src={logoSrc} />
        </Link>

        <nav aria-label="Primary navigation" className="desktop-nav">
          {navigation.map((item) => {
            const ItemLink = NavLink(item.href);
            return (
              <ItemLink aria-current={currentFor(item.href)} href={item.href} key={item.href}>
                {item.label}
              </ItemLink>
            );
          })}
        </nav>

        <Link className="button button-primary header-cta" href={ctaHref}>
          {ctaLabel}
        </Link>

        <button
          aria-controls="mobile-menu"
          aria-expanded={open}
          aria-label={open ? "Close navigation" : "Open navigation"}
          className="menu-button"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <div className={`mobile-menu ${open ? "is-open" : ""}`} id="mobile-menu">
        <nav aria-label="Mobile navigation" className="site-shell mobile-menu-inner">
          {navigation.map((item) => {
            const ItemLink = NavLink(item.href);
            return (
              <ItemLink
                aria-current={currentFor(item.href)}
                href={item.href}
                key={item.href}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </ItemLink>
            );
          })}
          <Link
            className="button button-primary"
            href={ctaHref}
            onClick={() => setOpen(false)}
          >
            {ctaLabel}
          </Link>
        </nav>
      </div>
    </header>
  );
}
