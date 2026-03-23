import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StatusPageMonitorManager } from "@/app/(dashboard)/status-pages/[id]/monitor-manager";

const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: mockRefresh }),
  usePathname: () => "/status-pages/page-1",
  useSearchParams: () => new URLSearchParams(),
}));

const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
global.fetch = mockFetch;

const monitors = [
  { id: "mon-1", name: "API Gateway", linked: true },
  { id: "mon-2", name: "Auth Service", linked: true },
  { id: "mon-3", name: "CDN", linked: false },
  { id: "mon-4", name: "Database", linked: false },
];

describe("StatusPageMonitorManager", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockRefresh.mockClear();
  });

  it("renders empty state when no monitors exist", () => {
    render(<StatusPageMonitorManager pageId="page-1" monitors={[]} />);
    expect(screen.getByText(/no monitors/i)).toBeInTheDocument();
  });

  it("renders linked monitors in 'shown on this page' section", () => {
    render(<StatusPageMonitorManager pageId="page-1" monitors={monitors} />);
    expect(screen.getByText("API Gateway")).toBeInTheDocument();
    expect(screen.getByText("Auth Service")).toBeInTheDocument();
  });

  it("renders unlinked monitors in 'add monitor' section", () => {
    render(<StatusPageMonitorManager pageId="page-1" monitors={monitors} />);
    expect(screen.getByText("CDN")).toBeInTheDocument();
    expect(screen.getByText("Database")).toBeInTheDocument();
  });

  it("shows section heading for linked monitors", () => {
    render(<StatusPageMonitorManager pageId="page-1" monitors={monitors} />);
    expect(screen.getByText(/shown on this page/i)).toBeInTheDocument();
  });

  it("shows section heading for available monitors", () => {
    render(<StatusPageMonitorManager pageId="page-1" monitors={monitors} />);
    expect(screen.getByText(/add monitor/i)).toBeInTheDocument();
  });

  it("does not render linked section when none are linked", () => {
    const unlinked = monitors.map((m) => ({ ...m, linked: false }));
    render(<StatusPageMonitorManager pageId="page-1" monitors={unlinked} />);
    expect(screen.queryByText(/shown on this page/i)).not.toBeInTheDocument();
  });

  it("does not render available section when all are linked", () => {
    const allLinked = monitors.map((m) => ({ ...m, linked: true }));
    render(<StatusPageMonitorManager pageId="page-1" monitors={allLinked} />);
    expect(screen.queryByText(/add monitor/i)).not.toBeInTheDocument();
  });

  it("calls PATCH with 'remove' action when removing a linked monitor", async () => {
    render(<StatusPageMonitorManager pageId="page-1" monitors={monitors} />);
    // Remove buttons are the X icons on linked monitors (first in DOM)
    const removeButtons = screen.getAllByRole("button");
    await userEvent.click(removeButtons[0]);
    await waitFor(() => expect(mockFetch).toHaveBeenCalledOnce());
    const call = mockFetch.mock.calls[0];
    expect(call[0]).toBe("/api/status-pages/page-1");
    const body = JSON.parse(call[1].body);
    expect(body.action).toBe("remove");
    expect(body.monitorId).toBe("mon-1");
  });

  it("calls PATCH with 'add' action when adding an available monitor", async () => {
    render(<StatusPageMonitorManager pageId="page-1" monitors={monitors} />);
    // Add buttons appear after remove buttons
    const buttons = screen.getAllByRole("button");
    // linked (2) + available (2) = 4 buttons; add buttons are at index 2 and 3
    await userEvent.click(buttons[2]); // first available = CDN
    await waitFor(() => expect(mockFetch).toHaveBeenCalledOnce());
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.action).toBe("add");
    expect(body.monitorId).toBe("mon-3");
  });

  it("uses PATCH method", async () => {
    render(<StatusPageMonitorManager pageId="page-1" monitors={monitors} />);
    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[0]);
    await waitFor(() => expect(mockFetch).toHaveBeenCalledOnce());
    expect(mockFetch.mock.calls[0][1].method).toBe("PATCH");
  });

  it("calls router.refresh after successful toggle", async () => {
    render(<StatusPageMonitorManager pageId="page-1" monitors={monitors} />);
    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[0]);
    await waitFor(() => expect(mockRefresh).toHaveBeenCalled());
  });
});
