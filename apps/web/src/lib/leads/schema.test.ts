import { describe, expect, it } from "vitest";

import { assessmentLeadSchema } from "./schema";

const validLead = {
  city: "Kochi",
  ieltsType: "academic" as const,
  name: "Asha Nair",
  phone: "+91 98765 43210",
  targetBand: "7.0" as const,
  website: "",
};

describe("assessmentLeadSchema", () => {
  it("accepts a complete assessment request", () => {
    expect(assessmentLeadSchema.safeParse(validLead).success).toBe(true);
  });

  it("rejects an invalid phone number", () => {
    expect(
      assessmentLeadSchema.safeParse({ ...validLead, phone: "please call me" }).success,
    ).toBe(false);
  });

  it("passes a populated honeypot through for the route to drop silently", () => {
    const parsed = assessmentLeadSchema.safeParse({ ...validLead, website: "spam.example" });
    expect(parsed.success && parsed.data.website).toBe("spam.example");
  });
});
