import { enValidation } from "./en-validation";

/**
 * English interface text: the source of truth for every translation key.
 *
 * Other languages provide the same shape (see ta.ts); anything they leave out
 * falls back to the text here. `client` holds only the text that interactive
 * (client) components need, so just that part is sent to the browser.
 * Placeholders in {braces} are filled in with `format()`.
 *
 * Exam material shown as an example (e.g. the practice-portal question) stays in
 * English on purpose and is not part of this file.
 */
export const en = {
  client: {
    nav: {
      home: "Home",
      about: "About Us",
      expertise: "Our Expertise",
      ieltsPte: "IELTS & PTE",
      why: "Why Choose Us",
      contact: "Contact Us",
      primaryLabel: "Primary navigation",
      mobileLabel: "Mobile navigation",
      openMenu: "Open navigation",
      closeMenu: "Close navigation",
      homeLink: "Sky Voice Languages home",
      studentLogin: "Student login",
    },
    language: {
      button: "Change language. Current language: {language}",
      menuLabel: "Choose a language",
    },
    common: {
      opensWhatsapp: " (opens WhatsApp)",
      opensNewTab: " (opens in a new tab)",
      sendingSecurely: "Sending securely",
      previewValidated: "Preview validated successfully.",
      readOur: "Read our",
      privacyNotice: "privacy notice",
      networkError: "We could not reach the server. Check your connection and try again.",
      honeypot: "Website",
    },
    leadForm: {
      badge: "Free · {duration}online assessment",
      heading: "Book your free IELTS assessment",
      intro: "Five quick details. No payment. No obligation.",
      fullName: "Full name",
      namePlaceholder: "Your name",
      whatsapp: "WhatsApp number",
      city: "City",
      cityPlaceholder: "Your city",
      ieltsType: "IELTS type",
      academic: "Academic",
      general: "General Training",
      notSure: "Not sure yet",
      targetBand: "Target band",
      submit: "Book my free assessment",
      privacy: "Your details are used only to arrange the assessment.",
      previewFallback: "Your form is valid. Lead delivery must be connected before launch.",
      errorFallback: "We could not send your request. Please try again.",
    },
    contactForm: {
      badge: "Courses · fees · timings · assessment",
      heading: "Send us an enquiry",
      intro: "All fields are required. We use your details only to reply.",
      fullName: "Full name",
      namePlaceholder: "Your name",
      email: "Email address",
      emailPlaceholder: "you@example.com",
      mobile: "Mobile number",
      enquiryAbout: "Enquiry about",
      enquiryTypes: {
        assessment: "Free assessment",
        courses: "IELTS courses and formats",
        pte: "PTE coaching",
        fees: "Fees and payment",
        schedule: "Class timings",
        other: "Something else",
      },
      branch: "Preferred branch",
      noPreference: "No preference",
      message: "Message",
      messagePlaceholder: "Your test type, target band, exam date, and your question.",
      characterCount: "{count}/{max} characters",
      submit: "Send enquiry",
      success: "Thank you. Your enquiry has been sent and the team will reply soon.",
      errorFallback: "We could not send your enquiry. Please try again.",
      privacy: "Your details are used only to answer this enquiry.",
    },
    enquireForm: {
      badge: "IELTS · PTE · free assessment",
      heading: "Enquire now",
      intro: "Four quick details. Email, target, and message are optional.",
      fullName: "Full name",
      namePlaceholder: "Your name",
      whatsapp: "WhatsApp number",
      city: "City",
      cityPlaceholder: "Your city",
      exam: "Exam",
      examOptions: {
        "ielts-academic": "IELTS Academic",
        "ielts-general": "IELTS General Training",
        "pte-academic": "PTE Academic",
        "pte-core": "PTE Core",
        "not-sure": "Not sure yet",
      },
      format: "Preferred format",
      formatOptions: {
        "not-sure": "Not sure yet",
        group: "Small group (3–5)",
        "one-to-one": "1-on-1",
      },
      email: "Email (optional)",
      emailPlaceholder: "you@example.com",
      target: "Target score (optional)",
      targetPlaceholder: "e.g. 7.0 or 65",
      message: "Message (optional)",
      messagePlaceholder: "Your exam date, preferred timings, or any question.",
      submit: "Send enquiry",
      success: "Thank you. Your enquiry has been sent. Watch for our WhatsApp message.",
      errorFallback: "We could not send your enquiry. Please try again.",
      privacy: "Your details are used only to reply to this enquiry.",
    },
    validation: enValidation,
    trainer: {
      closeProfile: "Close {name}'s profile",
      qualifications: "Qualifications",
      achievements: "Achievements",
      expertise: "Skills and expertise",
      videoIntro: "Video introduction",
      videoSoon: "Video coming soon",
      meet: "Meet {name}",
      introduction: "Introduction",
      yearsTeaching: "{years}+ years of teaching",
      viewProfile: "View profile",
      viewProfileOf: " of {name}",
      portraitOf: "Portrait of {name}",
    },
    video: {
      comingSoon: " · coming soon",
      comingSoonNotice: "{title}: video coming soon.",
      play: "Play video: {label}, {title}",
      openOverview: "{label} · coming soon: {title}. See what the free assessment covers",
      expand: "Expand video to full screen",
      captions: "English",
      closeOverview: "Close assessment overview",
      overviewEyebrow: "Your first clear step",
      overviewTitle: "Know what to practise before you practise more.",
      overviewBody:
        "The trainer-led video will be added after final production approval. The free assessment already has one simple job: turn a vague score problem into an actionable plan.",
      overviewSteps: ["Find your current level", "Spot the module holding you back", "Leave with a written roadmap"],
      overviewCta: "Book my free assessment",
      serviceTitle: "Why your IELTS score feels stuck, and what to do next",
      serviceLabel: "Full introduction",
      heroTitle: "How the free assessment works",
      heroLabel: "Quick look",
    },
    branches: {
      showOnMap: "Show on map",
      directions: "Get directions",
      directionsTo: " to {name} (opens Google Maps)",
      mapTitle: "Map showing {name}",
      mapNotice: "The map loads from Google Maps when you ask for it.",
      loadMap: "Load map",
    },
    stories: {
      listLabel: "Student success stories",
      ownWords: "{name} in their own words",
      previous: "Previous stories",
      next: "Next stories",
    },
    destinations: {
      tabsLabel: "IELTS pathways",
      pathways: [
        {
          id: "study",
          label: "Study abroad",
          test: "Usually IELTS Academic",
          summary:
            "Universities and colleges use IELTS to check you can follow lectures, read research, and write assignments in English.",
          destinations: [
            { country: "United Kingdom", note: "Undergraduate and postgraduate admission" },
            { country: "Canada", note: "Universities and colleges" },
            { country: "Australia", note: "University and vocational courses" },
            { country: "New Zealand", note: "Universities and polytechnics" },
            { country: "Ireland", note: "Undergraduate and postgraduate study" },
            { country: "United States", note: "Accepted by many universities" },
          ],
        },
        {
          id: "work",
          label: "Work & registration",
          test: "Academic or General Training, as required",
          summary:
            "Employers and professional bodies, such as nursing and healthcare regulators, may ask for IELTS before you can practise.",
          destinations: [
            { country: "United Kingdom", note: "Healthcare and professional registration" },
            { country: "Australia", note: "Professional registration and skills assessment" },
            { country: "New Zealand", note: "Healthcare and professional registration" },
            { country: "Ireland", note: "Healthcare and professional roles" },
            { country: "Canada", note: "Professional licensing bodies" },
            { country: "Gulf countries", note: "Employer and licensing requirements" },
          ],
        },
        {
          id: "migrate",
          label: "Migrate & settle",
          test: "Usually IELTS General Training",
          summary:
            "Immigration routes use English scores in eligibility and, in points-based systems, to award points.",
          destinations: [
            { country: "Canada", note: "Economic immigration programmes" },
            { country: "Australia", note: "Skilled and family visas" },
            { country: "New Zealand", note: "Skilled residence routes" },
            { country: "United Kingdom", note: "Visa routes (IELTS for UKVI)" },
          ],
        },
      ],
    },
    errorPage: {
      eyebrow: "Something went wrong",
      title: "That step did not load correctly.",
      body: "Your form details have not been submitted. Retry the page when you are ready.",
      retry: "Try again",
    },
  },

  api: {
    tooMany: "Too many attempts. Please wait a few minutes and try again.",
    invalidRequest: "Invalid request.",
    reviewForm: "Please review the highlighted form details.",
    leadPreview:
      "Preview validated successfully. Connect lead delivery (email or webhook) before production launch.",
    leadUnavailable: "Online booking is temporarily unavailable while lead delivery is being connected.",
    leadFailed: "We could not send your request. Please try again shortly.",
    enquiryPreview:
      "Preview validated successfully. Connect enquiry delivery (email or webhook) before production launch.",
    enquiryUnavailable: "The enquiry form is temporarily unavailable. Please try again later.",
    enquiryFailed: "We could not send your enquiry. Please try again shortly.",
  },

  layout: {
    skipLink: "Skip to main content",
    siteTitle: "{company} | Personalised IELTS Coaching",
    sampleBannerStrong: "Sample content preview.",
    sampleBanner:
      "Tutors, figures, awards, countries, contact details, fees, and quotes on this site may be placeholders awaiting confirmation from Sky Voice. Not for publication.",
  },

  footer: {
    explore: "Explore",
    support: "Support",
    home: "Home",
    ieltsPte: "IELTS & PTE",
    expertise: "Our expertise",
    why: "Why choose us",
    fees: "Fees",
    studentLogin: "Student login",
    about: "About us",
    contact: "Contact",
    enquire: "Enquire now",
    faq: "FAQ",
    legal: "Legal",
    disclaimer: "Disclaimer",
    privacy: "Privacy Policy",
    terms: "Terms",
    whatsapp: "WhatsApp",
    copyright: "© {year} {company}.",
  },

  socialBand: {
    title: "Follow Sky Voice",
    body: "Study tips, exam updates, and student moments.",
    sampleBody: "Sample links (each platform's home page) until the official profiles are added.",
  },

  shared: {
    bookAssessment: "Book my free assessment",
    enquireNow: "Enquire now",
    askQuestion: "Ask a question",
    contactUs: "Contact us",
    meetTutors: "Meet our tutors",
    free: "Free",
    feeOnRequest: "Fee on request",
    mostFocused: "Most focused",
    writingSpeakingFeedback: "Writing and Speaking feedback",
    enquireIelts: "Enquire about IELTS",
    enquirePte: "Enquire about PTE",
    ieltsAcademic: "IELTS Academic",
    ieltsGeneral: "IELTS General Training",
    pteAcademic: "PTE Academic",
    pteCore: "PTE Core",
    pte: "PTE",
    and: " and ",
    gettingStarted: "Getting started",
    howYouLearn: "How you’ll learn",
    howYouLearnFallback: "How you'll learn with Sky Voice.",
    proof: {
      awardsLabel: "Awards and recognition",
      countriesLabel: "Countries our students join from",
      studentsFrom: "Students from {count} countries",
      studentsFromOne: "Students from 1 country",
      pendingTitle: "Verified results and recognition are on their way.",
      pendingBody:
        "Awards, student numbers, and student stories appear here only after they are verified and, for students, shared with written consent.",
    },
  },

  landing: {
    trustPoints: [
      { value: "1-on-1", label: "or groups of 3-5" },
      { value: "80 sets", label: "exam-style practice" },
      { value: "4 modules", label: "trained separately" },
      { value: "A + G", label: "fully online" },
    ],
    scoreGaps: [
      {
        title: "Where marks disappear",
        body: "A mock gives you a score. We identify the exact question types, habits, and decisions costing you marks.",
      },
      {
        title: "What examiners expect",
        body: "Public band descriptors become clear, practical changes you can apply to your own answers.",
      },
      {
        title: "How to fix each mistake",
        body: "You get a focused correction—not another model answer that never explains the gap.",
      },
      {
        title: "How to repeat it under pressure",
        body: "Techniques are practised with feedback until they still work when the exam clock is running.",
      },
    ],
    methodSteps: [
      { label: "Assess", body: "Understand your starting level on the CEFR scale." },
      { label: "Identify", body: "Test Listening, Reading, Writing, and Speaking separately." },
      { label: "Plan", body: "Build a written roadmap around your target band and exam date." },
      { label: "Train", body: "Work live online in 1-on-1 or a focused group of 3-5." },
      { label: "Evaluate", body: "Receive personal corrections against IELTS band descriptors." },
      { label: "Improve", body: "Repeat with purpose until practice scores reach your target." },
    ],
    modules: [
      {
        name: "Listening",
        kicker: "Hear the trap before it catches you",
        description: "Train all question types, distractors, spelling, plurals, and one-play accuracy.",
        stats: ["10 question types", "Accuracy drills", "Timed practice"],
      },
      {
        name: "Reading",
        kicker: "Read for the answer, not every word",
        description: "Use skimming, scanning, T/F/NG logic, matching strategies, and a 60-minute plan.",
        stats: ["Question strategy", "T/F/NG logic", "60-min timing"],
      },
      {
        name: "Writing",
        kicker: "Turn feedback into a better next draft",
        description: "Build Task 1 and Task 2 structure, coherence, grammar range, and line-by-line control.",
        stats: ["Personal marking", "Clear structure", "Repeatable fixes"],
      },
      {
        name: "Speaking",
        kicker: "Sound natural, structured, and ready",
        description:
          "Improve fluency, Part 2 structure, Part 3 depth, and pronunciation through replayable practice.",
        stats: ["Recorded practice", "Fluency feedback", "Band criteria"],
      },
    ],
    audiences: [
      { title: "Study abroad", body: "You have an intake deadline and a target band to meet." },
      { title: "Scholarships", body: "Half a band may decide eligibility or funding." },
      { title: "Working professionals", body: "You need focused preparation around work—not endless study hours." },
      { title: "IELTS retakers", body: "You have seen the same score twice and need to understand why." },
      { title: "PR and immigration", body: "Every 0.5 can matter in a General Training pathway." },
      { title: "Nurses and healthcare", body: "You need strong, consistent Academic scores across modules." },
    ],
  },

  campaign: {
    meta: {
      title: "Online IELTS Coaching & Free Assessment",
      description:
        "Find the exact IELTS skills holding back your score. Book a free online assessment for a personalised Academic or General Training roadmap.",
      ogTitle: "Know what is holding back your IELTS score",
      ogDescription:
        "Free IELTS assessment, a clear preparation roadmap, and personalised online coaching for Academic and General Training.",
    },
    availability: "Academic + General",
    heroAiraLabel: "Aira, your SkyVoice IELTS guide, presents your next score move",
    startHere: "Start here",
    trustLabel: "Course highlights",
    video: {
      eyebrow: "Meet Sky Voice",
      title: "See how one assessment turns into a clear plan.",
      body: "A short introduction to the free assessment, the personalised roadmap, and how coaching works week to week.",
      points: ["Find your current level", "Spot the module holding you back", "Leave with a written roadmap"],
    },
    transformation: {
      eyebrow: "A clearer way forward",
      titleLead: "From “I keep practising” to",
      titleEmphasis: " “I know what to fix.”",
      body: "More mock tests do not automatically create progress. A useful plan connects one specific score gap to one specific correction—then gives you a chance to apply it again.",
      checks: [
        "Start from your actual level",
        "Prioritise the modules that matter most",
        "Build toward a realistic target and timeline",
      ],
      proofNote: "Verified student scorecards will be published here only after consent.",
      before: "Before",
      beforeNote: "Practising, but unsure why the score is not moving",
      route: "Personalised roadmap",
      target: "Target",
      targetNote: "A clear plan for the next correction and practice cycle",
    },
    whyStuck: {
      eyebrow: "Why scores get stuck",
      title: "Practice tells you the score. Diagnosis tells you what to change.",
      body: "To move a band, you need four answers that another random mock rarely gives you.",
    },
    method: {
      eyebrow: "The Sky Voice method",
      title: "Your preparation should be personal. Your weaknesses already are.",
      link: "Start with steps 1 and 2—free",
    },
    modules: {
      eyebrow: "Four modules · one connected plan",
      title: "Train each skill the way the examiner sees it.",
      body: "Listening, Reading, Writing, and Speaking need different techniques—and one roadmap that keeps them moving together.",
      airaLabel: "Aira connects feedback across all four IELTS skills",
      tableauTitle: "One guide. Four connected skill signals.",
      tableauBody: "Aira turns feedback from each module into one clear next step.",
      regionLabel: "The four IELTS modules",
      academicBody: "University admission and professional registration.",
      generalBody: "Work, migration, and permanent-residency pathways.",
      chooseLink: "Not sure? We’ll help you choose.",
    },
    portal: {
      eyebrow: "Practice portal",
      title: "Practise inside the format. Get help at the moment you need it.",
      body: "Classes teach the technique. The portal helps you make it automatic in an exam-like computer-delivered environment.",
      practiceSets: "practice sets",
      modules: "IELTS modules",
      testTypes: "test types",
      access: "Portal access: {duration}.",
      accessPending: "Access duration will be displayed after final client confirmation.",
      previewLabel: "IELTS practice portal concept preview",
      windowBar: "Concept preview · final screenshots pending",
      navLabel: "Concept portal navigation",
      navPractice: "Practice",
      navProgress: "Progress",
      navTutor: "Tutor",
    },
    audience: {
      eyebrow: "Built around real life",
      title: "For people preparing with a deadline, a job, or a second attempt.",
      notForTitle: "Probably not for you if…",
      notForBody:
        "You only want last-minute exam tips at 7.5+, or the lowest-cost 40-student lecture batch. Sky Voice is built around small groups and personalised 1-on-1 attention.",
    },
    destinations: {
      eyebrow: "Where IELTS can take you",
      title: "One score. Many doors.",
      body: "IELTS is used for study, work, and migration in many countries. Pick a goal to see where it is commonly used.",
      note: "Accepted tests and required scores differ by university, regulator, and visa route, and they change. Always confirm with the organisation; your free assessment helps you plan for the score you need.",
    },
    fees: {
      eyebrow: "Clear formats · transparent fees",
      title: "Two ways to train. One personalised method.",
      findFormat: "Find my best format",
      noteTitle: "Not sure which format fits?",
      noteBody: "Your free assessment ends with a format recommendation—before you pay.",
    },
    stories: {
      eyebrow: "Student success stories",
      title: "Hear it from the students.",
      body: "Real journeys, in their own words. Every story is shared with the student’s written consent.",
      pendingTitle: "The first student stories are being collected.",
      pendingBody:
        "Stories appear here only after a student agrees in writing to share their journey and results. We would rather show nothing than something we cannot prove.",
      cta: "Start your own story",
    },
    proof: {
      captionTitle: "Progress you can explain",
      caption: "Not a mystery score. A visible chain from feedback to correction.",
      floats: ["Task 2 structure", "Reading timing", "Speaking depth"],
      eyebrow: "Proof, not promises",
      title: "Every claim should be traceable to real student work.",
      body: "Sky Voice will publish score reports, verified reviews, and student stories only with evidence and consent. Until then, the method—not an invented testimonial—does the talking.",
      standards: [
        { title: "Real score reports", body: "Published after verification" },
        { title: "Student stories", body: "Shared only with permission" },
        { title: "Live reviews", body: "Connected to a verified source" },
      ],
    },
    faq: {
      eyebrow: "Questions before you book",
      title: "Clarity should start before the assessment.",
      body: "These answers cover the decisions we can make honestly today. Course access, instalment options, and other policies will appear only after final confirmation.",
      ready: "I’m ready to start",
    },
    final: {
      eyebrow: "Your next step is simple",
      title: "Don’t prepare blindly. Know where you stand.",
      body: "Book your free IELTS assessment and leave with your current level, weak modules, and a clear preparation roadmap.",
      steps: [
        { title: "Share five quick details", body: "Tell us your test type, city, and target." },
        { title: "Fix an online assessment slot", body: "The team follows up on WhatsApp to arrange the time." },
        { title: "Receive your roadmap", body: "Know the weak modules and the best preparation format." },
      ],
    },
    mobileBarLabel: "Mobile assessment shortcut",
    mobileBar: "Free assessment",
  },

  about: {
    meta: {
      title: "About {company}",
      description:
        "Who we are and how we coach: diagnosis-first online IELTS preparation for Academic and General Training, in 1-on-1 sessions or groups of 3–5.",
      ogDescription: "Diagnosis-first online IELTS coaching: our approach, mission, method, and trainers.",
    },
    eyebrow: "About Sky Voice",
    philosophy: {
      eyebrow: "Our approach",
      title: "Find the gap first. Then train it until it holds under exam pressure.",
      paragraphs: [
        "Most candidates already practise a lot. What they rarely get is a clear explanation of where their marks disappear and what to change next. Sky Voice exists to close that gap.",
        "We test Listening, Reading, Writing, and Speaking separately, turn public band descriptors into specific corrections, and keep practising each fix with feedback until it still works when the clock is running.",
      ],
    },
    differentiators: [
      {
        title: "Diagnosis before coaching",
        body: "A free assessment maps your current level, weak modules, and target band before you pay for anything.",
      },
      {
        title: "1-on-1 or groups of 3–5",
        body: "Small formats only, so feedback stays personal. No 40-student lecture batches.",
      },
      {
        title: "Four modules, one plan",
        body: "Each skill is trained the way the examiner sees it, inside one connected roadmap.",
      },
      {
        title: "Fully online",
        body: "Live classes and exam-style practice for Academic and General Training, wherever you are.",
      },
    ],
    purpose: {
      eyebrow: "What we stand for",
      title: "Our mission, vision, and goals.",
      mission: "Mission",
      vision: "Vision",
      goals: "Goals",
    },
    method: {
      eyebrow: "Our teaching methodology",
      title: "Six steps, from first assessment to exam-ready.",
      link: "Steps 1 and 2 are free",
    },
    trainers: {
      eyebrow: "Our trainers",
      title: "The people who read every essay you write.",
      body: "Qualifications, teaching experience, and a short video introduction for every Sky Voice trainer.",
      pendingTitle: "Trainer profiles are being finalised.",
      pendingBody:
        "Each trainer will appear here with a photograph, qualifications, years of teaching, areas of expertise, and a video introduction once Sky Voice has approved the details. Until then, the free assessment is the best way to meet the team.",
    },
    results: {
      eyebrow: "Achievements and student stories",
      title: "Results we can prove, published with consent.",
      pendingTitle: "Verified results are on their way.",
      pendingBody:
        "Score reports, achievements, and student stories are published only after they are verified and the student has agreed in writing. We would rather show nothing than show something we cannot prove.",
    },
    environment: {
      eyebrow: "Facilities and learning environment",
      title: "Everything you need to practise, online.",
      body: "No commute and no crowded classroom: live coaching, exam-format practice, and personal feedback in one place.",
      items: [
        { title: "Live online classes", body: "1-on-1 sessions or focused groups of 3–5, scheduled around work and study." },
        { title: "Exam-style practice portal", body: "80 practice sets across all four modules in a computer-delivered format." },
        { title: "Writing and Speaking feedback", body: "Personal corrections against the public band descriptors after each task." },
        {
          title: "A written roadmap",
          body: "Your plan, priorities, and recommended format, in writing, from the first assessment.",
        },
      ],
    },
    cta: {
      title: "Start with a free assessment.",
      body: "Leave with your current level, your weak modules, and a written roadmap, before you pay for anything.",
    },
  },

  contact: {
    meta: {
      title: "Contact {company}",
      description:
        "Ask Sky Voice about IELTS coaching, fees, class timings, or the free assessment. Send an enquiry and the team will reply.",
      ogDescription: "Questions about IELTS coaching, fees, or the free assessment? Send an enquiry.",
    },
    eyebrow: "Contact Sky Voice",
    callUs: "Call us",
    whatsapp: "WhatsApp",
    email: "Email",
    sendEnquiry: "Send an enquiry",
    infoEyebrow: "Contact information",
    officeAddress: "Office address",
    phone: "Phone",
    phones: "Phone numbers",
    businessHours: "Business hours",
    weeklyHoliday: "Weekly holiday",
    remainingPending: "Remaining contact details will be published once confirmed.",
    allPending:
      "Phone, WhatsApp, email, and business hours will be published once Sky Voice confirms them. Until then, the enquiry form reaches the team.",
    follow: "Follow Sky Voice",
    socialPending: "Official social profiles will be linked here once confirmed.",
    locationsEyebrow: "Office locations",
    locationsTitle: "Find a Sky Voice office.",
    locationsBody: "Choose a branch to see it on the map or get directions.",
    onlineTitle: "Coaching is fully online.",
    onlineBody:
      "Classes, practice, and feedback all happen online, so you can train from anywhere. Any office or branch addresses will be listed here, with maps and directions, once Sky Voice confirms them.",
    faqEyebrow: "Before you write",
    faqTitle: "Quick answers to common questions.",
    faqBodyBefore: "For questions about the course itself, the",
    faqLink: "coaching page FAQ",
    faqBodyAfter: "covers format, timing, and the assessment in more detail.",
  },

  expertise: {
    meta: { title: "Our Expertise — IELTS & PTE Tutors", ogTitle: "Our IELTS & PTE expertise" },
    eyebrow: "Our expertise",
    subjectsEyebrow: "What we teach",
    subjectsTitle: "IELTS and PTE, skill by skill.",
    tutorsEyebrow: "Our tutors",
    tutorsTitle: "Experienced tutors who know both exams.",
    tutorsBody: "Qualifications, teaching experience, and areas of expertise for every Sky Voice tutor.",
    tutorsPendingTitle: "Tutor profiles are being added.",
    tutorsPendingBody:
      "Each tutor will appear here with a photograph, qualifications, and years of teaching once the details are approved. Until then, an enquiry or the free assessment is the best way to meet the team.",
    methodEyebrow: "How we teach",
    methodTitle: "Six steps, from first assessment to exam-ready.",
    ctaTitle: "Learn with a tutor who reads your work.",
    ctaBody: "Tell us your exam and target, and we will suggest the tutor and format that fit.",
    ctaSecondary: "IELTS & PTE courses",
  },

  why: {
    meta: { title: "Why Choose Sky Voice for IELTS & PTE", ogTitle: "Why choose Sky Voice" },
    eyebrow: "Why choose us",
    reasonsEyebrow: "What makes the difference",
    reasonsTitle: "Reasons you can check for yourself.",
    proofEyebrow: "Awards and students worldwide",
    proofTitle: "Recognition and results, published only when verified.",
    ctaTitle: "See the difference for yourself.",
    ctaBody: "Start with a free assessment and a written roadmap, before you pay for anything.",
  },

  ieltsPte: {
    heroEyebrow: "IELTS & PTE coaching · Chennai and online",
    freeAssessment: "Free IELTS assessment",
    jumpLabel: "On this page",
    jumpCompare: "IELTS vs PTE",
    jumpPortal: "Practice portal",
    jumpFaq: "FAQ",
    whyEyebrow: "Why Sky Voice",
    whyTitle: "What you get, whichever exam you take.",
    ieltsEyebrow: "IELTS Academic · IELTS General Training",
    ieltsTitle: "IELTS coaching in Chennai and online.",
    ieltsBody:
      "All four modules (Listening, Reading, Writing, and Speaking), trained against the public band descriptors, with personal feedback on your own work.",
    pteTitle: "PTE coaching in Chennai and online.",
    ptePendingTitle: "PTE packages and fees are being confirmed.",
    ptePendingBody: "Send an enquiry and the team will share the current PTE options, timings, and fees with you directly.",
    compareEyebrow: "IELTS vs PTE",
    compareTitle: "Which test suits you?",
    compareBody: "The main differences at a glance. Always check what your university, employer, or visa route accepts.",
    compareTableLabel: "IELTS and PTE comparison table",
    compareFeature: "Feature",
    compareNote: "Test formats change from time to time; the official test providers have the latest details.",
    portalEyebrow: "Practice portal",
    portalTitle: "Practise in the exam format between classes.",
    portalBody:
      "{sets} in a computer-delivered format, with your progress tracked. Practice scores are estimates to guide your preparation, not official IELTS or PTE results.",
    portalSets: "{count} practice sets",
    portalSetsFallback: "Practice sets",
    studentLogin: "Student login",
    askPortal: "Ask about portal access",
    faqEyebrow: "Questions",
    faqTitle: "IELTS and PTE questions, answered.",
    enquireEyebrow: "Enquire now",
    enquireTitle: "Ask about IELTS or PTE coaching.",
    enquireBody:
      "Share your exam and target. We reply on WhatsApp with timings, fees, and a free assessment slot if you want one.",
  },

  enquire: {
    meta: { title: "Enquire Now — IELTS & PTE Coaching", ogTitle: "Enquire about IELTS & PTE coaching" },
    eyebrow: "Enquire now",
    whatsapp: "WhatsApp us",
    nextTitle: "What happens after you enquire",
  },

  thankYou: {
    metaTitle: "Assessment request received",
    airaLabel: "Aira celebrates your assessment booking!",
    eyebrow: "Request received",
    title: "Your IELTS roadmap starts here.",
    body: "Thank you. The next step is to arrange your online assessment slot and learn which modules deserve your attention first.",
    steps: [
      { title: "Watch for the WhatsApp message", body: "The team will use the number from your form." },
      { title: "Set aside 45 minutes", body: "Your assessment looks across all four modules." },
      { title: "Receive a written roadmap", body: "Know the priorities, format, and next step." },
    ],
    back: "Return to the IELTS guide",
  },

  notFound: {
    eyebrow: "404 · Page not found",
    title: "This is not part of your IELTS route.",
    body: "The page may have moved. Return to the homepage and continue from there.",
    back: "Return to Sky Voice",
  },

  legal: {
    backHome: "Back to the homepage",
    backAssessment: "Back to the assessment page",
    privacy: {
      metaTitle: "Privacy notice",
      metaDescription: "How Sky Voice Languages handles IELTS assessment and contact enquiry details.",
      eyebrow: "Privacy",
      title: "Privacy notice",
      updated: "Last updated: 13 October 2026",
      intro:
        "This notice explains the data used by the Sky Voice IELTS assessment enquiry experience. It should be reviewed alongside the final lead provider and operational contact details before production launch.",
      sections: [
        {
          title: "Information you provide",
          paragraphs: [
            "The assessment form asks for your name, WhatsApp number, city, IELTS type, and target band. Campaign attribution data may also be attached to understand which page or advertisement led to the enquiry.",
            "The contact form asks for your name, email address, mobile number, the topic of your enquiry, an optional preferred branch, and your message.",
          ],
        },
        {
          title: "Why it is used",
          paragraphs: [
            "The information is used to respond to your request, arrange an assessment, understand your stated IELTS goal, and recommend the appropriate next step. Personal details must not be sent to advertising analytics platforms.",
          ],
        },
        {
          title: "Service providers",
          paragraphs: [
            "Sky Voice may use secure hosting, messaging, analytics, and spam-prevention providers. The final provider list, retention period, and privacy contact will be published before live lead collection begins.",
          ],
        },
        {
          title: "Your choices",
          paragraphs: [
            "You may ask the Sky Voice team to correct or delete enquiry information using the verified contact channel that will be displayed on the live website.",
          ],
        },
      ],
    },
    terms: {
      metaTitle: "Website terms",
      metaDescription: "Terms for using the Sky Voice Languages IELTS website.",
      eyebrow: "Terms",
      title: "Website terms",
      updated: "Last updated: 13 October 2026",
      intro:
        "This website describes Sky Voice IELTS assessment and coaching services. The final commercial terms, schedules, access periods, cancellation rules, and verified business contact details must be approved before enrolment is taken.",
      sections: [
        {
          title: "No score guarantee",
          paragraphs: [
            "IELTS outcomes vary according to starting level, attendance, practice, feedback completion, exam conditions, and individual performance. Nothing on this website guarantees a particular band score.",
          ],
        },
        {
          title: "Fees and availability",
          paragraphs: [
            "Displayed fees and format descriptions should be reconfirmed before purchase. A free assessment does not require enrolment in a paid course.",
          ],
        },
        {
          title: "IELTS trademark",
          paragraphs: [
            "Sky Voice is an independent coaching provider. IELTS is jointly owned by the British Council, IDP: IELTS Australia, and Cambridge University Press & Assessment. These organizations do not endorse this independent website.",
          ],
        },
        {
          title: "Acceptable use",
          paragraphs: [
            "Do not misuse the website, attempt to disrupt its operation, submit false enquiries, or reproduce protected materials without permission.",
          ],
        },
      ],
    },
    disclaimer: {
      metaTitle: "Disclaimer",
      metaDescription:
        "Sky Voice Languages' independence from the IELTS and PTE test owners, and how to read practice scores and results.",
      eyebrow: "Disclaimer",
      title: "Disclaimer",
      updated: "Last updated: 20 October 2026",
      intro: "",
      sections: [
        {
          title: "Independent coaching provider",
          paragraphs: [
            "Sky Voice Languages is an independent coaching provider. IELTS is jointly owned by the British Council, IDP: IELTS Australia, and Cambridge University Press & Assessment. PTE is a trademark of Pearson. Sky Voice is not part of, and does not speak for, any of these organisations, and does not book, set, or mark official tests.",
          ],
        },
        {
          title: "Practice scores are estimates",
          paragraphs: [
            "Scores and band estimates from Sky Voice assessments, practice tests, tutors, or the practice portal are for study purposes only. They are not official IELTS or PTE results and do not predict your official score.",
          ],
        },
        {
          title: "Results vary",
          paragraphs: [
            "Progress depends on your starting level, the time you can give, practice, and feedback. No course guarantees a particular band or score. Any results or student stories on this site are individual experiences, published with the student’s consent.",
          ],
        },
        {
          title: "Test and visa requirements",
          paragraphs: [
            "Information about which tests, versions, or scores universities, employers, regulators, and immigration authorities accept is general guidance. Requirements change, so always confirm them directly with the organisation concerned.",
          ],
        },
        {
          title: "External links",
          paragraphs: [
            "Links to other websites, including social media, are provided for convenience. Sky Voice is not responsible for their content.",
          ],
        },
      ],
    },
  },
};

export type Messages = typeof en;
export type ClientMessages = Messages["client"];
