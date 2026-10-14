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
  MessagesSquare,
  Mic2,
  Plane,
  RefreshCw,
  SearchCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

export const trustPoints = [
  { value: "1-on-1", label: "or groups of 3-5" },
  { value: "80 sets", label: "exam-style practice" },
  { value: "4 modules", label: "trained separately" },
  { value: "A + G", label: "fully online" },
] as const;

export const scoreGaps = [
  {
    icon: SearchCheck,
    title: "Where marks disappear",
    body: "A mock gives you a score. We identify the exact question types, habits, and decisions costing you marks.",
  },
  {
    icon: Target,
    title: "What examiners expect",
    body: "Public band descriptors become clear, practical changes you can apply to your own answers.",
  },
  {
    icon: Lightbulb,
    title: "How to fix each mistake",
    body: "You get a focused correction—not another model answer that never explains the gap.",
  },
  {
    icon: Clock3,
    title: "How to repeat it under pressure",
    body: "Techniques are practised with feedback until they still work when the exam clock is running.",
  },
] as const;

export const methodSteps = [
  {
    number: "01",
    label: "Assess",
    body: "Understand your starting level on the CEFR scale.",
    icon: ClipboardCheck,
    free: true,
  },
  {
    number: "02",
    label: "Identify",
    body: "Test Listening, Reading, Writing, and Speaking separately.",
    icon: SearchCheck,
    free: true,
  },
  {
    number: "03",
    label: "Plan",
    body: "Build a written roadmap around your target band and exam date.",
    icon: Map,
    free: false,
  },
  {
    number: "04",
    label: "Train",
    body: "Work live online in 1-on-1 or a focused group of 3-5.",
    icon: GraduationCap,
    free: false,
  },
  {
    number: "05",
    label: "Evaluate",
    body: "Receive personal corrections against IELTS band descriptors.",
    icon: Target,
    free: false,
  },
  {
    number: "06",
    label: "Improve",
    body: "Repeat with purpose until practice scores reach your target.",
    icon: Sparkles,
    free: false,
  },
] as const;

export const modules = [
  {
    name: "Listening",
    icon: Headphones,
    kicker: "Hear the trap before it catches you",
    description:
      "Train all question types, distractors, spelling, plurals, and one-play accuracy.",
    stats: ["10 question types", "Accuracy drills", "Timed practice"],
  },
  {
    name: "Reading",
    icon: BookOpenText,
    kicker: "Read for the answer, not every word",
    description:
      "Use skimming, scanning, T/F/NG logic, matching strategies, and a 60-minute plan.",
    stats: ["Question strategy", "T/F/NG logic", "60-min timing"],
  },
  {
    name: "Writing",
    icon: RefreshCw,
    kicker: "Turn feedback into a better next draft",
    description:
      "Build Task 1 and Task 2 structure, coherence, grammar range, and line-by-line control.",
    stats: ["Personal marking", "Clear structure", "Repeatable fixes"],
  },
  {
    name: "Speaking",
    icon: Mic2,
    kicker: "Sound natural, structured, and ready",
    description:
      "Improve fluency, Part 2 structure, Part 3 depth, and pronunciation through replayable practice.",
    stats: ["Recorded practice", "Fluency feedback", "Band criteria"],
  },
] as const;

export const audiences = [
  {
    icon: Plane,
    title: "Study abroad",
    body: "You have an intake deadline and a target band to meet.",
  },
  {
    icon: GraduationCap,
    title: "Scholarships",
    body: "Half a band may decide eligibility or funding.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Working professionals",
    body: "You need focused preparation around work—not endless study hours.",
  },
  {
    icon: RefreshCw,
    title: "IELTS retakers",
    body: "You have seen the same score twice and need to understand why.",
  },
  {
    icon: Map,
    title: "PR and immigration",
    body: "Every 0.5 can matter in a General Training pathway.",
  },
  {
    icon: HeartPulse,
    title: "Nurses and healthcare",
    body: "You need strong, consistent Academic scores across modules.",
  },
] as const;

export const faqs = [
  {
    question: "I am weak in English. Can I still improve?",
    answer:
      "The assessment begins with your current level, not an assumed starting point. It shows whether your immediate need is language development, IELTS technique, or both. Your roadmap is then built from that evidence. No result is guaranteed, because progress depends on your starting level, practice, feedback, and available time.",
  },
  {
    question: "I do not have much time. Will this work for me?",
    answer:
      "The goal is to remove random preparation. Group batches suit candidates with a steadier two-to-three-month runway, while 1-on-1 training can focus more tightly on a weak module or shorter timeline. Your assessment helps decide what is realistic before you enrol.",
  },
  {
    question: "I already took IELTS and missed my band. Can you help?",
    answer:
      "Yes. Retakers are a core audience for the diagnostic approach. Your previous score is useful context, but the assessment looks beyond the overall band to find the specific module, question type, timing issue, or marking criterion holding you back.",
  },
  {
    question: "Does online coaching work for Speaking?",
    answer:
      "Speaking practice is live and can be recorded, scored, replayed, and corrected against the band descriptors. That makes filler words, answer structure, depth, pronunciation, and recurring habits easier to notice and improve.",
  },
  {
    question: "Should I choose a group or 1-on-1?",
    answer:
      "Choose based on the diagnosis, not guesswork. A focused group of 3-5 offers peer speaking practice and a fixed rhythm. 1-on-1 is better when one module needs intensive attention, your exam is close, or your schedule needs more flexibility.",
  },
  {
    question: "Is the IELTS assessment really free?",
    answer:
      "Yes. The assessment and preparation roadmap are free whether you join a course or not. After you submit the form, the team confirms a suitable online slot with you.",
  },
] as const;

export const pricing = [
  {
    name: "Focused group",
    size: "3-5 students",
    bestFor: "A 2-3 month runway and peer Speaking practice",
    schedule: "Fixed morning, evening, or weekend batch",
    academic: "₹17,499",
    general: "₹16,499",
    icon: Users,
    featured: false,
  },
  {
    name: "1-on-1 training",
    size: "One student, one tutor",
    bestFor: "One weak module, a close exam date, or a flexible schedule",
    schedule: "Flexible and agreed with your tutor",
    academic: "₹19,499",
    general: "₹18,499",
    icon: MessagesSquare,
    featured: true,
  },
] as const;
