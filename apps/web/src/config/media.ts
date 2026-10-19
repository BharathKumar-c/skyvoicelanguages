import type { SiteSettings } from "@/lib/settings/schema";

/**
 * Landing-page videos.
 *
 * No approved videos exist yet, so every `src` stays empty until the client
 * supplies one. Set the matching NEXT_PUBLIC_* variable in .env.local or the
 * hosting environment (see .env.example), or place the file in
 * apps/web/public/video/ and point the variable at "/video/<file>.mp4".
 * While `src` is empty a player shows its blurred preview and opens the written
 * assessment overview instead of playing.
 */
export type VideoConfig = {
  src: string | null;
  type: string;
  /** WebVTT captions; required before launch for instructional video. */
  captions: string | null;
  /** 16:9 preview frame. Replace with a real frame once the video exists. */
  poster: string;
  title: string;
  /** Short kicker shown on the preview, e.g. "Quick look". */
  label: string;
};

/** Full service introduction in the "Meet Sky Voice" section. */
export const serviceVideo: VideoConfig = {
  src: process.env.NEXT_PUBLIC_SERVICE_VIDEO_SRC || null,
  type: process.env.NEXT_PUBLIC_SERVICE_VIDEO_TYPE || "video/mp4",
  captions: process.env.NEXT_PUBLIC_SERVICE_VIDEO_CAPTIONS || null,
  poster: "/assets/generated/images/service-video-poster-feature.webp",
  title: "Why your IELTS score feels stuck, and what to do next",
  label: "Full introduction",
};

/** Short teaser in the hero, above the assessment form. */
export const heroVideo: VideoConfig = {
  src: process.env.NEXT_PUBLIC_HERO_VIDEO_SRC || null,
  type: process.env.NEXT_PUBLIC_HERO_VIDEO_TYPE || "video/mp4",
  captions: process.env.NEXT_PUBLIC_HERO_VIDEO_CAPTIONS || null,
  poster: "/assets/generated/images/service-video-poster.webp",
  title: "How the free assessment works",
  label: "Quick look",
};

/** Videos with the sources set in Website Settings (falling back to the env vars above). */
export function landingVideos(settings: SiteSettings) {
  const typeFor = (src: string, fallback: string) => (src.endsWith(".webm") ? "video/webm" : fallback);
  const { heroVideoUrl, serviceVideoUrl } = settings.content;
  return {
    hero: heroVideoUrl ? { ...heroVideo, src: heroVideoUrl, type: typeFor(heroVideoUrl, heroVideo.type) } : heroVideo,
    service: serviceVideoUrl
      ? { ...serviceVideo, src: serviceVideoUrl, type: typeFor(serviceVideoUrl, serviceVideo.type) }
      : serviceVideo,
  };
}
