import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Resend before importing email module
const mockSend = vi.fn().mockResolvedValue({ id: "mock-email-id" });
vi.mock("resend", () => {
  function Resend() {
    return { emails: { send: mockSend } };
  }
  return { Resend };
});

// Import after mocking
const { sendIncidentNotification, sendMonitorDownAlert, sendVerificationEmail } = await import("@/lib/email");

describe("sendIncidentNotification", () => {
  beforeEach(() => { mockSend.mockClear(); });

  it("sends email with severity in subject", async () => {
    await sendIncidentNotification(["user@example.com"], {
      title: "DB Outage",
      severity: "critical",
      status: "investigating",
      statusPageUrl: "https://example.com/s/demo",
    });
    expect(mockSend).toHaveBeenCalledOnce();
    const call = mockSend.mock.calls[0][0];
    expect(call.subject).toContain("CRITICAL");
    expect(call.subject).toContain("DB Outage");
  });

  it("sends to all recipients", async () => {
    await sendIncidentNotification(["a@x.com", "b@x.com", "c@x.com"], {
      title: "Outage",
      severity: "minor",
      status: "resolved",
      statusPageUrl: "https://example.com/s/demo",
    });
    const call = mockSend.mock.calls[0][0];
    expect(call.to).toEqual(["a@x.com", "b@x.com", "c@x.com"]);
  });

  it("skips send when recipient list is empty", async () => {
    await sendIncidentNotification([], {
      title: "Outage",
      severity: "minor",
      status: "investigating",
      statusPageUrl: "https://example.com/s/demo",
    });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("includes status page URL in html", async () => {
    await sendIncidentNotification(["user@example.com"], {
      title: "Outage",
      severity: "major",
      status: "identified",
      statusPageUrl: "https://example.com/s/acme",
    });
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain("https://example.com/s/acme");
  });

  it("uses Heartbeat sender address", async () => {
    await sendIncidentNotification(["user@example.com"], {
      title: "Outage",
      severity: "minor",
      status: "resolved",
      statusPageUrl: "https://example.com/s/demo",
    });
    const call = mockSend.mock.calls[0][0];
    expect(call.from).toContain("heartbeat.dev");
  });
});

describe("sendMonitorDownAlert", () => {
  beforeEach(() => { mockSend.mockClear(); });

  it("skips send when recipient list is empty", async () => {
    await sendMonitorDownAlert([], { name: "API", url: "https://api.example.com" }, "https://example.com/s/demo");
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("sends email with monitor name in subject", async () => {
    await sendMonitorDownAlert(["user@example.com"], { name: "Payment API", url: "https://pay.example.com" }, "https://example.com/s/demo");
    expect(mockSend).toHaveBeenCalledOnce();
    const call = mockSend.mock.calls[0][0];
    expect(call.subject).toContain("Payment API");
    expect(call.subject).toContain("down");
  });

  it("includes monitor URL in html body", async () => {
    await sendMonitorDownAlert(["user@example.com"], { name: "API", url: "https://api.example.com/health" }, "https://example.com/s/demo");
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain("https://api.example.com/health");
  });

  it("includes status page link in html body", async () => {
    await sendMonitorDownAlert(["user@example.com"], { name: "API", url: "https://api.example.com" }, "https://example.com/s/my-page");
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain("https://example.com/s/my-page");
  });

  it("sends to all provided emails", async () => {
    await sendMonitorDownAlert(["a@x.com", "b@x.com"], { name: "API", url: "https://x.com" }, "https://example.com/s/demo");
    const call = mockSend.mock.calls[0][0];
    expect(call.to).toEqual(["a@x.com", "b@x.com"]);
  });
});

describe("sendVerificationEmail", () => {
  beforeEach(() => { mockSend.mockClear(); });

  it("sends verification email to the specified address", async () => {
    await sendVerificationEmail("user@example.com", "https://example.com/verify?token=abc123");
    expect(mockSend).toHaveBeenCalledOnce();
    const call = mockSend.mock.calls[0][0];
    expect(call.to).toBe("user@example.com");
  });

  it("includes verification URL in html", async () => {
    await sendVerificationEmail("user@example.com", "https://example.com/verify?token=abc123");
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain("https://example.com/verify?token=abc123");
  });

  it("has verification-related subject", async () => {
    await sendVerificationEmail("user@example.com", "https://example.com/verify?token=xyz");
    const call = mockSend.mock.calls[0][0];
    expect(call.subject.toLowerCase()).toContain("verif");
  });
});
