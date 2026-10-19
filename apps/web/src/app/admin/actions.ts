"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  adminConfigured,
  credentialsValid,
  endSession,
  getAdminSession,
  startSession,
} from "@/lib/admin/auth";
import { createRateLimiter } from "@/lib/rate-limit";
import { settingsSchema } from "@/lib/settings/schema";
import { saveSettings } from "@/lib/settings/store";

const isLoginLimited = createRateLimiter({ limit: 5, windowMs: 15 * 60 * 1000 });

export type LoginState = { error: string | null };

export async function loginAction(_previous: LoginState, formData: FormData): Promise<LoginState> {
  if (!adminConfigured()) {
    return { error: "Admin access is not configured on this server yet." };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (isLoginLimited(`login:${ip}`)) {
    return { error: "Too many sign-in attempts. Wait 15 minutes and try again." };
  }

  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!username || !password) return { error: "Enter your username and password." };
  if (!credentialsValid(username, password)) {
    return { error: "That username and password do not match." };
  }

  await startSession(username.trim());
  redirect("/admin/settings");
}

export async function logoutAction() {
  await endSession();
  redirect("/admin/login");
}

export type SaveResult =
  | { ok: true; message: string; updatedAt: string }
  | { ok: false; message: string; issues?: { path: string; message: string }[] };

export async function saveSettingsAction(input: unknown): Promise<SaveResult> {
  // Server Actions are public endpoints: re-check the session on every call.
  const session = await getAdminSession();
  if (!session) {
    return { ok: false, message: "Your session has expired. Sign in again, then save." };
  }

  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) {
    return {
      issues: parsed.error.issues.map((issue) => ({
        message: issue.message,
        path: issue.path.join("."),
      })),
      message: "Some fields need attention. Nothing was saved.",
      ok: false,
    };
  }

  try {
    const meta = await saveSettings(parsed.data, session.user);
    // Every public page reads settings, so refresh the whole tree.
    revalidatePath("/", "layout");
    return { message: "Settings saved. The website now shows the new details.", ok: true, updatedAt: meta.updatedAt };
  } catch (error) {
    console.error(`[settings] save failed: ${(error as Error).message}`);
    return { message: "The server could not store the settings. Try again, or check the server logs.", ok: false };
  }
}
