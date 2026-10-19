import type { SiteSettings } from "./schema";

/**
 * Built-in values used until an administrator saves Website Settings, and as
 * the fallback for any section that is missing or fails validation.
 *
 * Everything filled in here is the copy the site already published before the
 * settings system existed. Everything Sky Voice has not yet confirmed (contact
 * numbers, address, trainers, statistics, testimonials, portal access
 * duration, instalments, analytics IDs) is deliberately EMPTY: the public site
 * hides those items or shows an honest "being confirmed" note. Never put
 * invented results, reviews, or credentials here.
 */
export const defaultSettings: SiteSettings = {
  company: {
    name: "Sky Voice Languages",
    websiteName: "Sky Voice",
    domain: "https://skyvoicelanguages.com",
    logoUrl: "",
    logoWhiteUrl: "",
    faviconUrl: "",
    description:
      "Personalised online IELTS coaching for Academic and General Training, beginning with a free IELTS assessment and a clear preparation roadmap.",
    serviceArea: "Online",
    address: [],
    socialLinks: [],
  },
  contact: {
    phones: [],
    whatsapp: "",
    email: "",
    address: [],
    hours: [],
    weeklyHoliday: "",
    pageTitle: "Talk to the Sky Voice team.",
    pageIntro:
      "Questions about courses, fees, class timings, or the free assessment? Send an enquiry below, or book the free assessment directly.",
    branches: [],
  },
  courses: {
    plans: [
      {
        name: "Focused group",
        size: "3-5 students",
        description: "A 2-3 month runway and peer Speaking practice",
        schedule: "Fixed morning, evening, or weekend batch",
        duration: "",
        academicFee: "17499",
        generalFee: "16499",
        featured: false,
      },
      {
        name: "1-on-1 training",
        size: "One student, one tutor",
        description: "One weak module, a close exam date, or a flexible schedule",
        schedule: "Flexible and agreed with your tutor",
        duration: "",
        academicFee: "19499",
        generalFee: "18499",
        featured: true,
      },
    ],
    feeNote: "Both include the assessment, roadmap, portal, and tutor support.",
    installmentInfo: "",
    assessmentDuration: "45-minute",
    assessmentDescription:
      "A free online assessment that maps your current level, weak modules, target band, and clearest route forward.",
    portalPracticeSets: "80",
    portalAccessDuration: "",
  },
  team: { trainers: [] },
  results: { stats: [], testimonials: [] },
  content: {
    hero: {
      eyebrow: "Online IELTS coaching",
      titleLine1: "Stuck at Band 5 or 6?",
      titleLine2: "Find the exact gap.",
      titleUnderline: "exact gap.",
      lede: "Stop preparing blindly. Start with a free assessment that maps your current level, weak modules, target band, and clearest route forward.",
      primaryCtaLabel: "Book my free assessment",
      secondaryCtaLabel: "See how it works",
      secondaryCtaHref: "#method",
      reassurance: "Free whether you join or not. No payment details.",
    },
    headerCtaLabel: "Free assessment",
    headerCtaHref: "/free-ielts-assessment#assessment-form",
    about: {
      title: "IELTS coaching that starts with a diagnosis.",
      lede: "Sky Voice Languages is an online IELTS coaching provider for Academic and General Training candidates. Every learner starts with a free assessment, so the coaching that follows is built around their own score gaps rather than a fixed syllabus.",
      mission:
        "Help every IELTS candidate understand exactly what is holding back their score, and give them a clear, personal plan to fix it.",
      vision:
        "IELTS preparation that feels clear and manageable, where progress is explained by evidence rather than left to guesswork.",
      goals:
        "Diagnose before we teach, keep groups small enough for real feedback, and publish results only when they are verified and shared with consent.",
    },
    faqs: [
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
    ],
    contactFaqs: [
      {
        question: "Is Sky Voice coaching online or in person?",
        answer:
          "Coaching is fully online for both IELTS Academic and General Training, in 1-on-1 sessions or focused groups of 3–5.",
      },
      {
        question: "How do I book the free assessment?",
        answer:
          "Use the assessment form on the IELTS coaching page. The team follows up to arrange a time, and you leave with your current level, weak modules, and a written roadmap.",
      },
      {
        question: "Can I ask about fees before booking anything?",
        answer:
          "Yes. Current fees for both formats are listed on the coaching page, and the free assessment ends with a format recommendation before you pay.",
      },
      {
        question: "What should I write in the enquiry form?",
        answer:
          "Tell us your test type, target band, and exam date if you have one. The more specific the question, the more useful the reply.",
      },
    ],
    footer: {
      tagline:
        "Personalised online IELTS preparation for people with a real target and a reason to reach it.",
      disclaimer:
        "Sky Voice is an independent coaching provider. IELTS is jointly owned by the British Council, IDP: IELTS Australia, and Cambridge University Press & Assessment. Results vary by student effort and starting level.",
    },
    serviceVideoUrl: "",
    heroVideoUrl: "",
  },
  integrations: {
    email: { notifyTo: "" },
    whatsapp: { provider: "link", watiEndpoint: "", watiTemplateName: "" },
    analytics: { enabled: false, ga4MeasurementId: "", metaPixelId: "" },
  },
};
