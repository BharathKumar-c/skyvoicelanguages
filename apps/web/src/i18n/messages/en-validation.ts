/**
 * English form validation messages. Kept in their own module so the form
 * schemas can import them without pulling every page's text into the browser.
 */
export const enValidation = {
  nameRequired: "Enter your full name.",
  nameTooLong: "Keep your name under 80 characters.",
  whatsappRequired: "Enter a WhatsApp number with country code.",
  whatsappInvalid: "Enter a valid WhatsApp number.",
  mobileRequired: "Enter a mobile number with country code.",
  mobileInvalid: "Enter a valid mobile number.",
  phoneDigits: "Use digits and an optional country code.",
  cityRequired: "Enter your city.",
  cityTooLong: "Keep the city under 80 characters.",
  ieltsType: "Choose an IELTS type.",
  targetBand: "Choose your target band.",
  emailInvalid: "Enter a valid email address.",
  emailTooLong: "Keep the email under 120 characters.",
  enquiryType: "Choose what your enquiry is about.",
  messageTooShort: "Add a little more detail (at least 10 characters).",
  messageTooLong: "Keep your message under 1,000 characters.",
  exam: "Choose the exam you are preparing for.",
  targetTooLong: "Keep the target score short, e.g. 7.0 or 65.",
};

export type ValidationMessages = typeof enValidation;
