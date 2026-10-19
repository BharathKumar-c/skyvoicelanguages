import { describe, expect, it } from "vitest";

import { contactEnquirySchema } from "./schema";

const validEnquiry = {
  email: "asha@example.com",
  enquiryType: "fees" as const,
  message: "Do you have weekend batches for General Training?",
  name: "Asha Nair",
  phone: "+91 98765 43210",
  website: "",
};

describe("contactEnquirySchema", () => {
  it("accepts a complete enquiry", () => {
    expect(contactEnquirySchema.safeParse(validEnquiry).success).toBe(true);
  });

  it("accepts an optional preferred branch", () => {
    expect(contactEnquirySchema.safeParse({ ...validEnquiry, branch: "Main office" }).success).toBe(
      true,
    );
  });

  it("rejects an invalid email address", () => {
    expect(contactEnquirySchema.safeParse({ ...validEnquiry, email: "not-an-email" }).success).toBe(
      false,
    );
  });

  it("rejects an invalid mobile number", () => {
    expect(contactEnquirySchema.safeParse({ ...validEnquiry, phone: "call me" }).success).toBe(false);
  });

  it("rejects a message that is too short or too long", () => {
    expect(contactEnquirySchema.safeParse({ ...validEnquiry, message: "Hi" }).success).toBe(false);
    expect(
      contactEnquirySchema.safeParse({ ...validEnquiry, message: "x".repeat(1001) }).success,
    ).toBe(false);
  });

  it("rejects an unknown enquiry type", () => {
    expect(contactEnquirySchema.safeParse({ ...validEnquiry, enquiryType: "refund" }).success).toBe(
      false,
    );
  });

  it("passes a populated honeypot through for the route to drop silently", () => {
    const parsed = contactEnquirySchema.safeParse({ ...validEnquiry, website: "spam.example" });
    expect(parsed.success && parsed.data.website).toBe("spam.example");
  });
});
