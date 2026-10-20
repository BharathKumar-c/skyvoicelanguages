import { act, cleanup, fireEvent, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { LOCALE_COOKIE, LOCALE_STORAGE_KEY } from "@/i18n/config";
import { renderWithI18n } from "@/i18n/test-utils";

import { LanguageSwitcher } from "../language-switcher";

const button = () => screen.getByRole("button", { name: /language|மொழி/i });

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    document.cookie = `${LOCALE_COOKIE}=; max-age=0; path=/`;
    window.localStorage.clear();
    document.documentElement.lang = "en";
    (useRouter().refresh as unknown as { mockClear: () => void }).mockClear();
  });
  afterEach(cleanup);

  it("is a labelled globe button that exposes its expanded state", () => {
    renderWithI18n(<LanguageSwitcher />);
    expect(button()).toHaveAccessibleName("Change language. Current language: English EN");
    expect(button()).toHaveAttribute("aria-haspopup", "menu");
    expect(button()).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("opens one menu with English and Tamil, marking the current language", () => {
    renderWithI18n(<LanguageSwitcher />);
    fireEvent.click(button());
    expect(button()).toHaveAttribute("aria-expanded", "true");
    const items = screen.getAllByRole("menuitemradio");
    expect(items.map((item) => item.textContent)).toEqual(["English", "தமிழ்"]);
    expect(items[0]).toHaveAttribute("aria-checked", "true");
    expect(items[1]).toHaveAttribute("aria-checked", "false");
    expect(items[1]).toHaveAttribute("lang", "ta");
    // Focus moves to the current language.
    expect(items[0]).toHaveFocus();
  });

  it("supports the keyboard: arrows move, Escape closes and returns focus", () => {
    renderWithI18n(<LanguageSwitcher />);
    fireEvent.keyDown(button(), { key: "ArrowDown" });
    const menu = screen.getByRole("menu");
    const items = screen.getAllByRole("menuitemradio");
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(items[1]).toHaveFocus();
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(items[0]).toHaveFocus();
    fireEvent.keyDown(menu, { key: "End" });
    expect(items[1]).toHaveFocus();
    fireEvent.keyDown(menu, { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
    expect(button()).toHaveFocus();
  });

  it("closes when clicking outside", () => {
    renderWithI18n(
      <div>
        <LanguageSwitcher />
        <p>Outside</p>
      </div>,
    );
    fireEvent.click(button());
    expect(screen.getByRole("menu")).toBeInTheDocument();
    fireEvent.pointerDown(screen.getByText("Outside"));
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("choosing Tamil remembers it, updates <html lang>, and refreshes the current page", () => {
    renderWithI18n(<LanguageSwitcher />);
    fireEvent.click(button());
    act(() => {
      fireEvent.click(screen.getByRole("menuitemradio", { name: "தமிழ்" }));
    });
    expect(document.cookie).toContain(`${LOCALE_COOKIE}=ta`);
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("ta");
    expect(document.documentElement.lang).toBe("ta");
    expect(useRouter().refresh).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("shows Tamil labels when the page is in Tamil", () => {
    renderWithI18n(<LanguageSwitcher />, "ta");
    expect(button()).toHaveAccessibleName("மொழியை மாற்றவும். தற்போதைய மொழி: தமிழ் TA");
    fireEvent.click(button());
    expect(screen.getByRole("menu")).toHaveAttribute("aria-label", "ஒரு மொழியைத் தேர்ந்தெடுக்கவும்");
    expect(screen.getByRole("menuitemradio", { name: "தமிழ்" })).toHaveAttribute("aria-checked", "true");
  });

  it("restores a choice kept in localStorage when the cookie is missing", () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, "ta");
    renderWithI18n(<LanguageSwitcher />);
    expect(document.cookie).toContain(`${LOCALE_COOKIE}=ta`);
    expect(useRouter().refresh).toHaveBeenCalledTimes(1);
  });
});
