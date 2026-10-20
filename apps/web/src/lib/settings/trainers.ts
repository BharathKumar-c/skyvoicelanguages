import type { Trainer } from "@/content/about";
import { format } from "@/i18n/merge";
import type { ClientMessages } from "@/i18n/messages";

import type { SiteSettings } from "./schema";

/** Published trainers only, shaped for the directory component, with labels in the given language. */
export function publishedTrainers(settings: SiteSettings, t: ClientMessages["trainer"]): Trainer[] {
  return settings.team.trainers
    .filter((trainer) => trainer.published)
    .map((trainer) => ({
      achievements: trainer.achievements,
      bio: trainer.bio,
      designation: trainer.designation,
      experienceYears: trainer.experienceYears ? Number(trainer.experienceYears) : null,
      expertise: trainer.expertise,
      id: trainer.id,
      name: trainer.name,
      photo: trainer.photoUrl ? { alt: format(t.portraitOf, { name: trainer.name }), src: trainer.photoUrl } : null,
      qualifications: trainer.qualifications,
      video: trainer.videoUrl
        ? {
            captions: null,
            label: t.introduction,
            poster: "/assets/generated/images/service-video-poster-feature.webp",
            src: trainer.videoUrl,
            title: format(t.meet, { name: trainer.name }),
            type: trainer.videoUrl.endsWith(".webm") ? "video/webm" : "video/mp4",
          }
        : null,
    }));
}

/** Public proof: only verified, published, or consented items. */
export function publicProof(settings: SiteSettings) {
  const { results } = settings;
  return {
    awards: results.awards.filter((award) => award.verified && award.published),
    countries: results.countries.verified ? results.countries.list : [],
    stats: results.stats.filter((stat) => stat.verified),
    testimonials: results.testimonials.filter((story) => story.published && story.consent),
  };
}
