import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { BrandLogo } from "@/components/brand-logo";
import { adminConfigured, getAdminSession } from "@/lib/admin/auth";

import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin/settings");
  const configured = adminConfigured();

  return (
    <main className="admin-login" id="main-content">
      <div className="admin-login-card">
        <BrandLogo />
        <h1>Website Settings</h1>
        <p>Sign in as the site administrator to manage company details and website content.</p>
        {configured ? (
          <LoginForm />
        ) : (
          <div className="admin-notice is-error" role="alert">
            Admin access is not configured on this server. Set ADMIN_PASSWORD_HASH and
            ADMIN_SESSION_SECRET in the server environment (see .env.example), then restart.
          </div>
        )}
      </div>
    </main>
  );
}
