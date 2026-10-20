import type { SiteSettings } from "./schema";

/**
 * SAMPLE CONTENT for design review while Sky Voice confirms the real details.
 *
 * Off unless the server sets SAMPLE_CONTENT=on. When on, every page shows a
 * "sample content" banner and is marked noindex, and these values fill ONLY the
 * Website Settings fields that are still empty: anything an administrator has
 * saved always wins. None of this is real: names, figures, awards, countries,
 * contact details, and quotes are placeholders. Never copy them into Website
 * Settings or the built-in defaults.
 */
export function sampleContentEnabled() {
  return ["on", "true", "1", "yes"].includes((process.env.SAMPLE_CONTENT ?? "").trim().toLowerCase());
}

type SampleOf<T> = T extends readonly unknown[] ? T : T extends object ? { [K in keyof T]?: SampleOf<T[K]> } : T;

const samplePhone = "+91 90000 00000";

export const sampleSettings: SampleOf<SiteSettings> = {
  company: {
    tagline: "Find your voice. Reach your score. (sample tagline)",
    portalUrl: "https://portal.example.com",
    // Platform home pages, not Sky Voice profiles: only to preview the icons.
    socialLinks: [
      { platform: "instagram", url: "https://www.instagram.com/" },
      { platform: "facebook", url: "https://www.facebook.com/" },
      { platform: "youtube", url: "https://www.youtube.com/" },
      { platform: "linkedin", url: "https://www.linkedin.com/" },
    ],
  },
  contact: {
    phones: [samplePhone],
    whatsapp: samplePhone,
    email: "hello@example.com",
    address: ["Sample street address", "Chennai, Tamil Nadu 600 000"],
    hours: ["Mon–Sat · 9:00 am – 7:00 pm (sample)"],
    weeklyHoliday: "Sunday (sample)",
    branches: [
      {
        id: "chennai-sample",
        name: "Chennai centre (sample)",
        address: ["Sample street address", "Chennai, Tamil Nadu 600 000"],
        phone: samplePhone,
        hours: "Mon–Sat · 9:00 am – 7:00 pm (sample)",
        mapQuery: "Chennai, Tamil Nadu",
      },
    ],
  },
  courses: {
    portalAccessDuration: "3 months (sample)",
    pte: {
      offersAcademic: true,
      offersCore: true,
      feeNote: "Sample fees for layout review only.",
      plans: [
        {
          name: "PTE focused group (sample)",
          size: "3-5 students",
          description: "Item-type drills and timed mock sections",
          schedule: "Weekday evening or weekend batch",
          duration: "6 weeks (sample)",
          fee: "15999",
          featured: false,
        },
        {
          name: "PTE 1-on-1 (sample)",
          size: "One student, one tutor",
          description: "Targeted work on your lowest-scoring items",
          schedule: "Flexible and agreed with your tutor",
          duration: "4 weeks (sample)",
          fee: "18999",
          featured: true,
        },
      ],
    },
  },
  team: {
    trainers: [
      {
        id: "sample-tutor-a",
        name: "Sample Tutor A",
        designation: "Senior IELTS & PTE Trainer",
        photoUrl: "",
        qualifications: ["M.A. English (sample)", "CELTA (sample)"],
        expertise: ["IELTS Writing", "PTE Speaking"],
        experienceYears: "12",
        achievements: ["Sample achievement: replace with verified details"],
        bio: "Sample biography. The real trainer profile, approved by the trainer, will replace this text.",
        videoUrl: "",
        published: true,
      },
      {
        id: "sample-tutor-b",
        name: "Sample Tutor B",
        designation: "IELTS Trainer",
        photoUrl: "",
        qualifications: ["B.Ed. English (sample)"],
        expertise: ["IELTS Reading", "IELTS Listening"],
        experienceYears: "8",
        achievements: [],
        bio: "Sample biography for layout review.",
        videoUrl: "",
        published: true,
      },
      {
        id: "sample-tutor-c",
        name: "Sample Tutor C",
        designation: "PTE Trainer",
        photoUrl: "",
        qualifications: ["M.A. Linguistics (sample)"],
        expertise: ["PTE Reading", "PTE Writing"],
        experienceYears: "6",
        achievements: [],
        bio: "Sample biography for layout review.",
        videoUrl: "",
        published: true,
      },
    ],
  },
  results: {
    stats: [
      { value: "500+", label: "students coached (sample figure)", verified: true },
      { value: "12", label: "years of IELTS teaching (sample figure)", verified: true },
    ],
    testimonials: [
      {
        name: "Sample Student A",
        detail: "MSc applicant · Chennai (sample)",
        from: "6.0",
        to: "7.0",
        module: "IELTS Academic",
        outcome: "University offer (sample)",
        quote: "Sample testimonial. A real student's words will appear here once they agree in writing.",
        journey: [
          { question: "Where were you stuck before Sky Voice?", answer: "Writing Task 2 stayed at 6.0. (sample)" },
          { question: "What changed in your preparation?", answer: "I knew exactly which criterion to fix each week. (sample)" },
          { question: "How confident do you feel now?", answer: "Much more confident. (sample)" },
        ],
        photoUrl: "",
        consent: true,
        published: true,
      },
      {
        name: "Sample Student B",
        detail: "Registered nurse · Kochi (sample)",
        from: "6.5",
        to: "7.5",
        module: "IELTS Academic · Speaking",
        outcome: "Met registration requirement (sample)",
        quote: "Sample testimonial for layout review only.",
        journey: [
          { question: "What worried you most?", answer: "Speaking Part 3 answers were too short. (sample)" },
          { question: "Which part of coaching helped?", answer: "Recorded practice with corrections. (sample)" },
        ],
        photoUrl: "",
        consent: true,
        published: true,
      },
      {
        name: "Sample Student C",
        detail: "Software engineer · Bengaluru (sample)",
        from: "",
        to: "",
        module: "PTE Academic",
        outcome: "Skilled visa application (sample)",
        quote: "Sample testimonial for layout review only.",
        journey: [],
        photoUrl: "",
        consent: true,
        published: true,
      },
    ],
    awards: [
      {
        title: "Sample award title",
        issuer: "Awarding organisation (sample)",
        year: "2025",
        evidenceNote: "Sample",
        verified: true,
        published: true,
      },
      {
        title: "Sample recognition",
        issuer: "Partner organisation (sample)",
        year: "2024",
        evidenceNote: "Sample",
        verified: true,
        published: true,
      },
    ],
    countries: {
      list: [
        "India (sample)",
        "United Arab Emirates (sample)",
        "United Kingdom (sample)",
        "Canada (sample)",
        "Australia (sample)",
        "New Zealand (sample)",
        "Ireland (sample)",
        "Singapore (sample)",
      ],
      verified: true,
      source: "Sample list",
    },
  },
  pages: {
    home: {
      learningTitle: "Learning that fits how you study today.",
      learningIntro: "Sample copy. Sky Voice will confirm what its learning style looks like in practice.",
      learningPoints: [
        { title: "Short, focused sessions", body: "Practice in bite-sized blocks you can fit around college or work." },
        { title: "Study from your phone", body: "Practise and review feedback on any device." },
        { title: "See your progress", body: "Every practice set shows what improved and what to fix next." },
        { title: "Live, interactive classes", body: "Small groups where everyone speaks, not lectures to a crowd." },
      ],
    },
  },
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Fills empty strings, empty lists, and unset (false) flags from `sample`. */
function fillEmpty(real: unknown, sample: unknown): unknown {
  if (typeof real === "string") return real === "" && typeof sample === "string" ? sample : real;
  if (Array.isArray(real)) return real.length === 0 && Array.isArray(sample) ? sample : real;
  if (typeof real === "boolean") return real || sample === true;
  if (isPlainObject(real) && isPlainObject(sample)) {
    const merged: Record<string, unknown> = { ...real };
    for (const [key, value] of Object.entries(sample)) {
      if (key in real) merged[key] = fillEmpty(real[key], value);
    }
    return merged;
  }
  return real;
}

export function withSampleContent(settings: SiteSettings): SiteSettings {
  return fillEmpty(settings, sampleSettings) as SiteSettings;
}
