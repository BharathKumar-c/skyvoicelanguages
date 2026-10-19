import { ExternalLink, LogOut } from "lucide-react";
import type { Metadata } from "next";

import { BrandLogo } from "@/components/brand-logo";
import { requireAdmin } from "@/lib/admin/auth";
import { getResolvedSettings } from "@/lib/settings/store";

import { logoutAction } from "../actions";
import type { IntegrationStatus } from "./sections";
import { SettingsEditor } from "./settings-editor";

export const metadata: Metadata = { title: "Website Settings" };

export default async function AdminSettingsPage() {
  const session = await requireAdmin();
  const resolved = await getResolvedSettings();
  const env = process.env;

  // Booleans only: the browser learns whether a secret exists, never its value.
  const status: IntegrationStatus = {
    adminUsesHash: Boolean(env.ADMIN_PASSWORD_HASH),
    enquiryWebhook: Boolean(env.CONTACT_ENQUIRY_WEBHOOK_URL),
    leadWebhook: Boolean(env.ASSESSMENT_LEAD_WEBHOOK_URL),
    notifyToEnv: Boolean(env.NOTIFY_EMAIL_TO),
    smtp: Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS),
    watiToken: Boolean(env.WATI_API_TOKEN),
  };

  return (
    <>
      <header className="admin-header">
        <BrandLogo />
        <div className="admin-header-actions">
          <a className="button button-secondary" href="/" rel="noopener" target="_blank">
            View website
            <ExternalLink aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <form action={logoutAction}>
            <button className="button button-secondary" type="submit">
              <LogOut aria-hidden="true" />
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="admin-main" id="main-content">
        <h1>Website Settings</h1>
        <p className="admin-intro">
          Signed in as <strong>{session.user}</strong>. Changes appear on the website as soon as you save —
          no deployment needed.
        </p>
        <SettingsEditor
          fallbackSections={resolved.fallbackSections}
          initial={resolved.settings}
          status={status}
          updatedAt={resolved.updatedAt}
          updatedBy={resolved.updatedBy}
        />
      </main>
    </>
  );
}
