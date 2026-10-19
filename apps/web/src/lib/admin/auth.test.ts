import { randomBytes } from "node:crypto";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

const auth = await import("./auth");

const secret = "s".repeat(40);

describe("admin auth", () => {
  beforeEach(() => {
    vi.stubEnv("ADMIN_SESSION_SECRET", secret);
    vi.stubEnv("ADMIN_USERNAME", "owner");
  });

  afterEach(() => vi.unstubAllEnvs());

  it("stays locked when no secret or password is configured", () => {
    vi.stubEnv("ADMIN_SESSION_SECRET", "");
    expect(auth.adminConfigured()).toBe(false);
    expect(auth.credentialsValid("owner", "anything")).toBe(false);
  });

  it("verifies a scrypt password hash and the username", () => {
    vi.stubEnv("ADMIN_PASSWORD_HASH", auth.hashPassword("correct horse battery", randomBytes(16)));
    expect(auth.adminConfigured()).toBe(true);
    expect(auth.credentialsValid("owner", "correct horse battery")).toBe(true);
    expect(auth.credentialsValid("owner", "wrong password")).toBe(false);
    expect(auth.credentialsValid("admin", "correct horse battery")).toBe(false);
  });

  it("ignores a plain-text password in production", () => {
    vi.stubEnv("ADMIN_PASSWORD", "dev-only-password");
    vi.stubEnv("NODE_ENV", "development");
    expect(auth.credentialsValid("owner", "dev-only-password")).toBe(true);
    vi.stubEnv("NODE_ENV", "production");
    expect(auth.adminConfigured()).toBe(false);
    expect(auth.credentialsValid("owner", "dev-only-password")).toBe(false);
  });

  it("accepts its own session token and rejects tampered or expired ones", () => {
    const now = Date.now();
    const token = auth.createSessionToken("owner", now);
    expect(auth.readSessionToken(token, now)).toMatchObject({ user: "owner" });

    const [payload, signature] = token.split(".");
    const forged = Buffer.from(JSON.stringify({ exp: now + 1e9, user: "owner" })).toString("base64url");
    expect(auth.readSessionToken(`${forged}.${signature}`, now)).toBeNull();
    expect(auth.readSessionToken(`${payload}.${signature.slice(0, -2)}xx`, now)).toBeNull();
    expect(auth.readSessionToken(token, now + 9 * 3600_000)).toBeNull();
    expect(auth.readSessionToken(undefined, now)).toBeNull();

    vi.stubEnv("ADMIN_SESSION_SECRET", "t".repeat(40));
    expect(auth.readSessionToken(token, now)).toBeNull();
  });
});
