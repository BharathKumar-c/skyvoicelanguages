import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendMail = vi.fn();
vi.mock("nodemailer", () => ({
  default: { createTransport: vi.fn(() => ({ sendMail })) },
}));

const { deliverSubmission } = await import("./deliver");

const smtpEnv = {
  NOTIFY_EMAIL_TO: "team@example.com",
  SMTP_HOST: "smtp.example.com",
  SMTP_PASS: "app-password",
  SMTP_USER: "sender@example.com",
};

const request = {
  fields: [
    ["Name", "Asha <b>Nair</b>"],
    ["Branch", undefined],
  ] as const,
  kind: "Website enquiry",
  replyTo: "asha@example.com",
  subjectDetail: "Fees from Asha\r\nBcc: victim@example.com",
};

describe("deliverSubmission", () => {
  beforeEach(() => {
    sendMail.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("reports unconfigured when no channel is set up", async () => {
    expect(await deliverSubmission({ ...request, webhook: { payload: {} } })).toBe("unconfigured");
  });

  it("emails escaped content with a single-line subject", async () => {
    for (const [key, value] of Object.entries(smtpEnv)) vi.stubEnv(key, value);
    sendMail.mockResolvedValue({});

    expect(await deliverSubmission(request)).toBe("delivered");
    const mail = sendMail.mock.calls[0][0];
    expect(mail.to).toBe("team@example.com");
    expect(mail.replyTo).toBe("asha@example.com");
    expect(mail.subject).toBe("Website enquiry: Fees from Asha Bcc: victim@example.com");
    expect(mail.html).toContain("Asha &#60;b&#62;Nair&#60;/b&#62;");
    expect(mail.text).toBe("Name: Asha <b>Nair</b>");
  });

  it("succeeds when one of two channels fails, and fails when both do", async () => {
    for (const [key, value] of Object.entries(smtpEnv)) vi.stubEnv(key, value);
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    sendMail.mockRejectedValue(new Error("auth failed"));
    const webhook = { payload: { name: "Asha" }, token: "secret", url: "https://hook.example" };

    expect(await deliverSubmission({ ...request, webhook })).toBe("delivered");
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe("Bearer secret");

    fetchMock.mockResolvedValue(new Response(null, { status: 500 }));
    expect(await deliverSubmission({ ...request, webhook })).toBe("failed");
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining("webhook delivery failed"));
  });
});
