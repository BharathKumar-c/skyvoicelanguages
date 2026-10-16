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

export const aboutIntro = {
  eyebrow: "About Sky Voice",
  title: "IELTS coaching that starts with a diagnosis.",
  lede: "Sky Voice Languages is an online IELTS coaching provider for Academic and General Training candidates. Every learner starts with a free assessment, so the coaching that follows is built around their own score gaps rather than a fixed syllabus.",
};

export const philosophy = {
  eyebrow: "Our approach",
  title: "Find the gap first. Then train it until it holds under exam pressure.",
  paragraphs: [
    "Most candidates already practise a lot. What they rarely get is a clear explanation of where their marks disappear and what to change next. Sky Voice exists to close that gap.",
    "We test Listening, Reading, Writing, and Speaking separately, turn public band descriptors into specific corrections, and keep practising each fix with feedback until it still works when the clock is running.",
  ],
};

export const differentiators = [
  {
    icon: SearchCheck,
    title: "Diagnosis before coaching",
    body: "A free assessment maps your current level, weak modules, and target band before you pay for anything.",
  },
  {
    icon: Users,
    title: "1-on-1 or groups of 3–5",
    body: "Small formats only, so feedback stays personal. No 40-student lecture batches.",
  },
  {
    icon: Target,
    title: "Four modules, one plan",
    body: "Each skill is trained the way the examiner sees it, inside one connected roadmap.",
  },
  {
    icon: Laptop2,
    title: "Fully online",
    body: "Live classes and exam-style practice for Academic and General Training, wherever you are.",
  },
] as const;

export const purpose = [
  {
    label: "Mission",
    statement:
      "Help every IELTS candidate understand exactly what is holding back their score, and give them a clear, personal plan to fix it.",
  },
  {
    label: "Vision",
    statement:
      "IELTS preparation that feels clear and manageable, where progress is explained by evidence rather than left to guesswork.",
  },
  {
    label: "Goals",
    statement:
      "Diagnose before we teach, keep groups small enough for real feedback, and publish results only when they are verified and shared with consent.",
  },
] as const;

export const learningEnvironment = [
  {
    icon: GraduationCap,
    title: "Live online classes",
    body: "1-on-1 sessions or focused groups of 3–5, scheduled around work and study.",
  },
  {
    icon: Headphones,
    title: "Exam-style practice portal",
    body: "80 practice sets across all four modules in a computer-delivered format.",
  },
  {
    icon: MessagesSquare,
    title: "Writing and Speaking feedback",
    body: "Personal corrections against the public band descriptors after each task.",
  },
  {
    icon: ClipboardCheck,
    title: "A written roadmap",
    body: "Your plan, priorities, and recommended format, in writing, from the first assessment.",
  },
] as const;

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
  bio: string;
  /** Introduction video; leave null until the file exists. */
  video: VideoConfig | null;
};

/**
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
