"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { navigation } from "@/config/site";

import { BrandLogo } from "./brand-logo";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    document.body.dataset.menuOpen = open ? "true" : "false";
    return () => {
      delete document.body.dataset.menuOpen;
    };
  }, [open]);

  return (
    <header className="site-header" data-scrolled={scrolled}>
      <div className="site-shell header-inner">
        <Link aria-label="Sky Voice Languages home" className="header-brand" href="/">
          <BrandLogo />
        </Link>

        <nav aria-label="Primary navigation" className="desktop-nav">
          {navigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Link className="button button-primary header-cta" href="#assessment-form">
          Free assessment
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
          {navigation.map((item) => (
            <Link href={item.href} key={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link
            className="button button-primary"
            href="#assessment-form"
            onClick={() => setOpen(false)}
          >
            Book free assessment
          </Link>
        </nav>
      </div>
    </header>
  );
}
