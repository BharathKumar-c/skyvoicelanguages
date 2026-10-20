"use client";

import { Check, Globe } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

import { useI18n } from "@/i18n/client";
import { localeInfo, locales, type Locale } from "@/i18n/config";
import { format } from "@/i18n/merge";

/**
 * Globe button with a one-level language menu. Options come from the central
 * `locales` list, so a new language appears here without component changes.
 *
 * Keyboard: Enter/Space/ArrowDown opens the menu on the current language;
 * arrows, Home, and End move; Enter or Space chooses; Escape or Tab closes.
 * A click outside closes it too.
 */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, m, setLocale, switching } = useI18n();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = localeInfo(locale);

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }, []);

  const focusItem = (index: number) => {
    const count = locales.length;
    itemRefs.current[(index + count) % count]?.focus();
  };

  // Move focus into the menu (on the current language) when it opens.
  useEffect(() => {
    if (!open) return;
    const index = Math.max(0, locales.findIndex((item) => item.code === locale));
    itemRefs.current[index]?.focus();
  }, [open, locale]);

  // Close on a click or tap outside the switcher.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, close]);

  const choose = (code: Locale) => {
    close(true);
    setLocale(code);
  };

  const onButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
    }
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = itemRefs.current.findIndex((item) => item === document.activeElement);
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusItem(index + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusItem(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusItem(0);
        break;
      case "End":
        event.preventDefault();
        focusItem(locales.length - 1);
        break;
      case "Escape":
        event.preventDefault();
        event.stopPropagation(); // keep the mobile menu open behind it
        close(true);
        break;
      case "Tab":
        close(false);
        break;
    }
  };

  return (
    <div className={`language-switcher ${className}`} data-open={open} ref={rootRef}>
      <button
        aria-busy={switching || undefined}
        aria-controls={open ? menuId : undefined}
        aria-expanded={open}
        aria-haspopup="menu"
        className="language-button"
        onClick={() => setOpen((value) => !value)}
        onKeyDown={onButtonKeyDown}
        ref={buttonRef}
        type="button"
      >
        <Globe aria-hidden="true" />
        {/* The name is built from content, so it includes the visible code
            (voice users can say what they see): "Change language. Current
            language: English EN". */}
        <span className="sr-only">{format(m.language.button, { language: current.nativeName })}</span>{" "}
        <span className="language-code">{current.code.toUpperCase()}</span>
      </button>
      {open ? (
        <div aria-label={m.language.menuLabel} className="language-menu" id={menuId} onKeyDown={onMenuKeyDown} role="menu">
          {locales.map((item, index) => {
            const selected = item.code === locale;
            return (
              <button
                aria-checked={selected}
                className={selected ? "is-selected" : undefined}
                key={item.code}
                lang={item.htmlLang}
                onClick={() => choose(item.code)}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                role="menuitemradio"
                tabIndex={-1}
                type="button"
              >
                <span>{item.nativeName}</span>
                {selected ? <Check aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
