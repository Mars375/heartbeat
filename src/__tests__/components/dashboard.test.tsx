import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { UptimeBar } from "@/components/dashboard/uptime-bar";
import { MonitorCard } from "@/components/dashboard/monitor-card";
import { IncidentCard } from "@/components/dashboard/incident-card";
import { IncidentTimeline } from "@/components/dashboard/incident-timeline";

// ---------------------------------------------------------------------------
// StatusBadge
// ---------------------------------------------------------------------------
describe("StatusBadge", () => {
  it("renders operational status", () => {
    render(<StatusBadge status="operational" />);
    expect(screen.getByText("Operational")).toBeInTheDocument();
  });

  it("renders down status", () => {
    render(<StatusBadge status="down" />);
    expect(screen.getByText("Down")).toBeInTheDocument();
  });

  it("renders degraded status", () => {
    render(<StatusBadge status="degraded" />);
    expect(screen.getByText("Degraded")).toBeInTheDocument();
  });

  it("renders maintenance status", () => {
    render(<StatusBadge status="maintenance" />);
    expect(screen.getByText("Maintenance")).toBeInTheDocument();
  });

  it("renders unknown status", () => {
    render(<StatusBadge status="unknown" />);
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// UptimeBar
// ---------------------------------------------------------------------------
describe("UptimeBar", () => {
  const makeChecks = (count: number, status: "up" | "down" | "degraded" | "no_data") =>
    Array.from({ length: count }, (_, i) => ({
      date: `2024-01-${String(i + 1).padStart(2, "0")}`,
      status,
    }));

  it("renders uptime percentage", () => {
    const checks = makeChecks(90, "up");
    render(<UptimeBar checks={checks} />);
    expect(screen.getByText("100.00% uptime")).toBeInTheDocument();
  });

  it("renders 0% when all checks are down", () => {
    const checks = makeChecks(90, "down");
    render(<UptimeBar checks={checks} />);
    expect(screen.getByText("0.00% uptime")).toBeInTheDocument();
  });

  it("renders label for 90 days ago", () => {
    const checks = makeChecks(5, "up");
    render(<UptimeBar checks={checks} />);
    expect(screen.getByText("90 days ago")).toBeInTheDocument();
    expect(screen.getByText("Today")).toBeInTheDocument();
  });

  it("renders correct number of segments", () => {
    const checks = makeChecks(10, "up");
    const { container } = render(<UptimeBar checks={checks} />);
    const segments = container.querySelectorAll("[data-segment]");
    expect(segments).toHaveLength(10);
  });
});

// ---------------------------------------------------------------------------
// MonitorCard
// ---------------------------------------------------------------------------
describe("MonitorCard", () => {
  const baseMonitor = {
    id: "mon-1",
    name: "API Gateway",
    url: "https://api.example.com/health",
    lastStatus: "operational" as const,
    lastCheckedAt: new Date(Date.now() - 60000),
  };

  const uptimeData = Array.from({ length: 90 }, (_, i) => ({
    date: `2024-01-${String((i % 28) + 1).padStart(2, "0")}`,
    status: "up" as const,
  }));

  it("renders monitor name", () => {
    render(<MonitorCard monitor={baseMonitor} uptimeData={uptimeData} />);
    expect(screen.getByText("API Gateway")).toBeInTheDocument();
  });

  it("renders monitor URL", () => {
    render(<MonitorCard monitor={baseMonitor} uptimeData={uptimeData} />);
    expect(screen.getByText("https://api.example.com/health")).toBeInTheDocument();
  });

  it("renders status badge", () => {
    render(<MonitorCard monitor={baseMonitor} uptimeData={uptimeData} />);
    expect(screen.getByText("Operational")).toBeInTheDocument();
  });

  it("renders last checked time when provided", () => {
    render(<MonitorCard monitor={baseMonitor} uptimeData={uptimeData} />);
    expect(screen.getByText(/Last checked/)).toBeInTheDocument();
  });

  it("does not render last checked when null", () => {
    const monitor = { ...baseMonitor, lastCheckedAt: null };
    render(<MonitorCard monitor={monitor} uptimeData={uptimeData} />);
    expect(screen.queryByText(/Last checked/)).not.toBeInTheDocument();
  });

  it("wraps in a link to the monitor detail page", () => {
    render(<MonitorCard monitor={baseMonitor} uptimeData={uptimeData} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/monitors/mon-1");
  });
});

// ---------------------------------------------------------------------------
// IncidentCard
// ---------------------------------------------------------------------------
describe("IncidentCard", () => {
  const baseIncident = {
    id: "inc-1",
    title: "API Gateway Latency Spike",
    status: "investigating",
    severity: "major",
    startedAt: new Date(Date.now() - 3600000),
    resolvedAt: null,
  };

  it("renders incident title", () => {
    render(<IncidentCard incident={baseIncident} />);
    expect(screen.getByText("API Gateway Latency Spike")).toBeInTheDocument();
  });

  it("renders severity badge", () => {
    render(<IncidentCard incident={baseIncident} />);
    expect(screen.getByText("major")).toBeInTheDocument();
  });

  it("renders status label", () => {
    render(<IncidentCard incident={baseIncident} />);
    expect(screen.getByText("Investigating")).toBeInTheDocument();
  });

  it("shows Resolved badge when resolvedAt is set", () => {
    const resolved = { ...baseIncident, resolvedAt: new Date() };
    render(<IncidentCard incident={resolved} />);
    expect(screen.getByText("Resolved")).toBeInTheDocument();
  });

  it("does not show Resolved badge for active incidents", () => {
    render(<IncidentCard incident={baseIncident} />);
    expect(screen.queryByText("Resolved")).not.toBeInTheDocument();
  });

  it("wraps in a link to incident detail page", () => {
    render(<IncidentCard incident={baseIncident} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/incidents/inc-1");
  });
});

// ---------------------------------------------------------------------------
// IncidentTimeline
// ---------------------------------------------------------------------------
describe("IncidentTimeline", () => {
  const updates = [
    {
      id: "upd-1",
      status: "investigating",
      message: "We are investigating this issue.",
      createdAt: new Date("2024-01-01T10:00:00Z"),
    },
    {
      id: "upd-2",
      status: "identified",
      message: "Root cause identified.",
      createdAt: new Date("2024-01-01T10:30:00Z"),
    },
    {
      id: "upd-3",
      status: "resolved",
      message: "Issue has been resolved.",
      createdAt: new Date("2024-01-01T11:00:00Z"),
    },
  ];

  it("renders all update messages", () => {
    render(<IncidentTimeline updates={updates} />);
    expect(screen.getByText("We are investigating this issue.")).toBeInTheDocument();
    expect(screen.getByText("Root cause identified.")).toBeInTheDocument();
    expect(screen.getByText("Issue has been resolved.")).toBeInTheDocument();
  });

  it("renders status labels", () => {
    render(<IncidentTimeline updates={updates} />);
    expect(screen.getByText("investigating")).toBeInTheDocument();
    expect(screen.getByText("identified")).toBeInTheDocument();
    expect(screen.getByText("resolved")).toBeInTheDocument();
  });

  it("renders empty state without error", () => {
    const { container } = render(<IncidentTimeline updates={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
