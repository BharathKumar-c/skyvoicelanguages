import {
  ClipboardCheck,
  GraduationCap,
  Headphones,
  Laptop2,
  MessagesSquare,
  SearchCheck,
  Target,
  Users,
} from "lucide-react";

import type { VideoConfig } from "@/config/media";
import type { Messages } from "@/i18n/messages";

/**
 * About page content.
 *
 * Everything here is derived from the approved campaign copy (formats, modules,
 * portal, method). Items that need client-supplied facts are typed but empty and
 * render an honest "being finalised" state until filled:
 *   - trainers          → names, photos, qualifications, experience, videos
 *   - achievements      → verified figures only
 *   - successStories    → real students, with written consent
 * The mission/vision wording below is drafted from the existing positioning and
 * should be approved by Sky Voice before launch.
 */

type About = Messages["about"];

const differentiatorIcons = [SearchCheck, Users, Target, Laptop2];
const environmentIcons = [GraduationCap, Headphones, MessagesSquare, ClipboardCheck];

/** "Our approach" points, with icons; the wording comes from the interface text. */
export const differentiators = (t: About) =>
  t.differentiators.map((item, i) => ({ ...item, icon: differentiatorIcons[i] }));

/** "Facilities and learning environment" points, with icons. */
export const learningEnvironment = (t: About) =>
  t.environment.items.map((item, i) => ({ ...item, icon: environmentIcons[i] }));

export type Trainer = {
  /** Stable slug, used for element ids. */
  id: string;
  name: string;
  designation: string;
  /** Portrait in /public (e.g. "/trainers/<id>.webp"), 4:5 crop recommended. */
  photo: { src: string; alt: string } | null;
  qualifications: string[];
  expertise: string[];
  experienceYears: number | null;
  achievements?: string[];
  bio: string;
  /** Introduction video; leave null until the file exists. */
  video: VideoConfig | null;
};

/**
 * Trainers, achievements, and success stories are now managed in Website
 * Settings (/admin/settings → Trainers, Results & reviews). These empty lists
 * remain only as type references for tests.
 *
 * Add one entry per trainer once Sky Voice supplies approved details.
 *
 * {
 *   id: "trainer-slug",
 *   name: "Full name",
 *   designation: "Lead IELTS Trainer",
 *   photo: { src: "/trainers/trainer-slug.webp", alt: "Portrait of Full name" },
 *   qualifications: ["MA English", "CELTA"],
 *   expertise: ["Writing Task 2", "Speaking Part 3"],
 *   experienceYears: 8,
 *   bio: "Two or three sentences in the trainer's own voice.",
 *   video: { src: "/video/trainer-slug.mp4", type: "video/mp4", captions: null,
 *            poster: "/trainers/trainer-slug-poster.webp",
 *            title: "Meet Full name", label: "Introduction" },
 * }
 */
export const trainers: Trainer[] = [];

/** Verified figures only, e.g. { value: "1,200+", label: "students coached" }. */
export const achievements: { value: string; label: string }[] = [];

/** Real students, published with written consent. */
export const successStories: {
  name: string;
  from: string;
  to: string;
  module: string;
  quote: string;
}[] = [];
