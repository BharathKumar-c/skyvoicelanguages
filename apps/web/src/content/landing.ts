import {
  BookOpenText,
  BriefcaseBusiness,
  ClipboardCheck,
  Clock3,
  GraduationCap,
  Headphones,
  HeartPulse,
  Lightbulb,
  Map,
  Mic2,
  Plane,
  RefreshCw,
  SearchCheck,
  Sparkles,
  Target,
} from "lucide-react";

import type { Messages } from "@/i18n/messages";

/**
 * Campaign-page structure: icons, step numbers, and ids. The wording lives in
 * the interface text (i18n/messages, `landing` and `client.destinations`) so it
 * can be translated; each list here lines up with its text item by item.
 */

const scoreGapIcons = [SearchCheck, Target, Lightbulb, Clock3];

const methodStepMeta = [
  { number: "01", icon: ClipboardCheck, free: true },
  { number: "02", icon: SearchCheck, free: true },
  { number: "03", icon: Map, free: false },
  { number: "04", icon: GraduationCap, free: false },
  { number: "05", icon: Target, free: false },
  { number: "06", icon: Sparkles, free: false },
];

/** Skill-signal artwork per module, in the same order as the module text. */
const moduleMeta = [
  { signal: "listening", icon: Headphones },
  { signal: "reading", icon: BookOpenText },
  { signal: "writing", icon: RefreshCw },
  { signal: "speaking", icon: Mic2 },
] as const;

const audienceIcons = [Plane, GraduationCap, BriefcaseBusiness, RefreshCw, Map, HeartPulse];

type Landing = Messages["landing"];

export const scoreGaps = (t: Landing) => t.scoreGaps.map((gap, i) => ({ ...gap, icon: scoreGapIcons[i] }));

export const methodSteps = (t: Landing) => t.methodSteps.map((step, i) => ({ ...step, ...methodStepMeta[i] }));

export const modules = (t: Landing) => t.modules.map((module, i) => ({ ...module, ...moduleMeta[i] }));

export const audiences = (t: Landing) => t.audiences.map((audience, i) => ({ ...audience, icon: audienceIcons[i] }));

/**
 * "Where IELTS can take you": ids and country codes. Deliberately general —
 * which test, version, and score each university, regulator, or visa route
 * accepts changes over time, so no band requirements are stated, and the
 * section tells visitors to check with the organisation itself.
 */
export const ieltsPathways = [
  { id: "study", codes: ["UK", "CA", "AU", "NZ", "IE", "US"] },
  { id: "work", codes: ["UK", "AU", "NZ", "IE", "CA", "GCC"] },
  { id: "migrate", codes: ["CA", "AU", "NZ", "UK"] },
] as const;

export type PathwayId = (typeof ieltsPathways)[number]["id"];
