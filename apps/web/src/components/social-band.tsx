import { getMessages } from "@/i18n/server";
import { sampleContentEnabled } from "@/lib/settings/sample";
import { getResolvedSettings, getSettings } from "@/lib/settings/store";

import { SocialIcon, socialLabels } from "./social-icon";

/**
 * "Follow Sky Voice" band near the bottom of a page. Shows only the official
 * profiles saved in Website Settings, and nothing until at least one exists.
 */
export async function SocialBand() {
  const [{ company }, m] = await Promise.all([getSettings(), getMessages()]);
  if (!company.socialLinks.length) return null;
  // In sample mode, links that were not saved by an administrator are placeholders.
  const isSample =
    sampleContentEnabled() && !(await getResolvedSettings()).settings.company.socialLinks.length;

  return (
    <section aria-labelledby="social-band-title" className="social-band">
      <div className="site-shell social-band-inner">
        <div>
          <h2 id="social-band-title">{m.socialBand.title}</h2>
          <p>{isSample ? m.socialBand.sampleBody : m.socialBand.body}</p>
        </div>
        <ul className="social-band-list">
          {company.socialLinks.map((link) => (
            <li key={link.platform}>
              <a
                aria-label={`${socialLabels[link.platform]}${m.client.common.opensNewTab}`}
                href={link.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                <SocialIcon platform={link.platform} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
