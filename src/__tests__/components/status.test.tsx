import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusHeader } from "@/components/status/status-header";
import { MonitorRow } from "@/components/status/monitor-row";
import { SubscribeForm } from "@/components/status/subscribe-form";

// ---------------------------------------------------------------------------
// StatusHeader
// ---------------------------------------------------------------------------
describe("StatusHeader", () => {
  it("renders the status page name", () => {
    render(
      <StatusHeader
        name="Acme Status"
        brandingColor="#10B981"
        overallStatus="operational"
      />
    );
    expect(screen.getByText("Acme Status")).toBeInTheDocument();
  });

  it("renders 'All Systems Operational' when operational", () => {
    render(
      <StatusHeader
        name="Acme Status"
        brandingColor="#10B981"
        overallStatus="operational"
      />
    );
    expect(screen.getByText("All Systems Operational")).toBeInTheDocument();
  });

  it("renders 'Major Outage' when down", () => {
    render(
      <StatusHeader
        name="Acme Status"
        brandingColor="#10B981"
        overallStatus="down"
      />
    );
    expect(screen.getByText("Major Outage")).toBeInTheDocument();
  });

  it("renders 'Degraded Performance' when degraded", () => {
    render(
      <StatusHeader
        name="Acme Status"
        brandingColor="#10B981"
        overallStatus="degraded"
      />
    );
    expect(screen.getByText("Degraded Performance")).toBeInTheDocument();
  });

  it("renders an img when logoUrl is provided", () => {
    render(
      <StatusHeader
        name="Acme Status"
        brandingColor="#10B981"
        overallStatus="operational"
        logoUrl="https://example.com/logo.png"
      />
    );
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/logo.png");
    expect(img).toHaveAttribute("alt", "Acme Status");
  });
});

// ---------------------------------------------------------------------------
// MonitorRow
// ---------------------------------------------------------------------------
describe("MonitorRow", () => {
  const uptimeData = Array.from({ length: 90 }, (_, i) => ({
    date: `2024-01-${String((i % 28) + 1).padStart(2, "0")}`,
    status: "up" as const,
  }));

  it("renders monitor name", () => {
    render(<MonitorRow name="API Gateway" status="operational" uptimeData={uptimeData} />);
    expect(screen.getByText("API Gateway")).toBeInTheDocument();
  });

  it("renders status badge", () => {
    render(<MonitorRow name="API Gateway" status="operational" uptimeData={uptimeData} />);
    expect(screen.getByText("Operational")).toBeInTheDocument();
  });

  it("renders degraded status badge", () => {
    render(<MonitorRow name="Web App" status="degraded" uptimeData={uptimeData} />);
    expect(screen.getByText("Degraded")).toBeInTheDocument();
  });

  it("renders down status badge", () => {
    render(<MonitorRow name="Auth Service" status="down" uptimeData={uptimeData} />);
    expect(screen.getByText("Down")).toBeInTheDocument();
  });

  it("renders uptime bar", () => {
    render(<MonitorRow name="CDN" status="operational" uptimeData={uptimeData} />);
    expect(screen.getByText("100.00% uptime")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// SubscribeForm
// ---------------------------------------------------------------------------
describe("SubscribeForm", () => {
  it("renders email input", () => {
    render(<SubscribeForm slug="demo" />);
    expect(screen.getByPlaceholderText("your@email.com")).toBeInTheDocument();
  });

  it("renders Subscribe button", () => {
    render(<SubscribeForm slug="demo" />);
    expect(screen.getByRole("button", { name: /subscribe/i })).toBeInTheDocument();
  });

  it("email input requires a value", () => {
    render(<SubscribeForm slug="demo" />);
    const input = screen.getByPlaceholderText("your@email.com");
    expect(input).toHaveAttribute("required");
  });

  it("email input is of type email", () => {
    render(<SubscribeForm slug="demo" />);
    const input = screen.getByPlaceholderText("your@email.com");
    expect(input).toHaveAttribute("type", "email");
  });
});
