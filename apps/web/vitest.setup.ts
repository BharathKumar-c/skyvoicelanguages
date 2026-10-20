import "@testing-library/jest-dom/vitest";

import { vi } from "vitest";

// Components read the App Router (the language switcher refreshes the route).
// Unit tests run without one, so provide a minimal stand-in.
export const routerRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ back: vi.fn(), forward: vi.fn(), prefetch: vi.fn(), push: vi.fn(), refresh: routerRefresh, replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
