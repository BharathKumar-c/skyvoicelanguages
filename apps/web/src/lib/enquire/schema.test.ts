import { describe, expect, it } from "vitest";

import { enquireSchema } from "./schema";

const valid = {
  city: "Chennai",
  email: "",
  exam: "pte-academic" as const,
  name: "Asha Nair",
  phone: "+91 98765 43210",
  website: "",
};

describe("enquireSchema", () => {
  it("accepts a minimal enquiry with optional fields left empty", () => {
    expect(enquireSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts the optional email, format, target, and message", () => {
    const full = { ...valid, email: "asha@example.com", format: "group", message: "Weekend batches?", target: "65" };
    expect(enquireSchema.safeParse(full).success).toBe(true);
  });

  it.each([
    ["email", { email: "not-an-email" }],
    ["phone", { phone: "call me" }],
    ["exam", { exam: "toefl" }],
    ["city", { city: "" }],
    ["message", { message: "x".repeat(1001) }],
  ])("rejects an invalid %s", (field, change) => {
    const result = enquireSchema.safeParse({ ...valid, ...change });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path.join("."))).toContain(field);
  });
});
