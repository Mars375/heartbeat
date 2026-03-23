import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StatusPageFormWrapper } from "@/app/(dashboard)/status-pages/status-page-form-wrapper";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
  usePathname: () => "/status-pages",
  useSearchParams: () => new URLSearchParams(),
}));

const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: "page-123" }) });
global.fetch = mockFetch;

const monitors = [
  { id: "00000000-0000-0000-0000-000000000001", name: "API Gateway" },
  { id: "00000000-0000-0000-0000-000000000002", name: "Auth Service" },
];

describe("StatusPageFormWrapper", () => {
  beforeEach(() => { mockFetch.mockClear(); });

  it("renders the 'New Status Page' button", () => {
    render(<StatusPageFormWrapper orgId="org-1" monitors={[]} />);
    expect(screen.getByRole("button", { name: /new status page/i })).toBeInTheDocument();
  });

  it("dialog is not visible before button click", () => {
    render(<StatusPageFormWrapper orgId="org-1" monitors={[]} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens dialog when button is clicked", async () => {
    render(<StatusPageFormWrapper orgId="org-1" monitors={[]} />);
    await userEvent.click(screen.getByRole("button", { name: /new status page/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("dialog has a Name field", async () => {
    render(<StatusPageFormWrapper orgId="org-1" monitors={[]} />);
    await userEvent.click(screen.getByRole("button", { name: /new status page/i }));
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it("dialog has a Slug field", async () => {
    render(<StatusPageFormWrapper orgId="org-1" monitors={[]} />);
    await userEvent.click(screen.getByRole("button", { name: /new status page/i }));
    expect(screen.getByLabelText(/slug/i)).toBeInTheDocument();
  });

  it("dialog has a color picker", async () => {
    render(<StatusPageFormWrapper orgId="org-1" monitors={[]} />);
    await userEvent.click(screen.getByRole("button", { name: /new status page/i }));
    const colorInput = document.querySelector('input[type="color"]');
    expect(colorInput).toBeInTheDocument();
  });

  it("renders monitor checkboxes when monitors are provided", async () => {
    render(<StatusPageFormWrapper orgId="org-1" monitors={monitors} />);
    await userEvent.click(screen.getByRole("button", { name: /new status page/i }));
    expect(screen.getByText("API Gateway")).toBeInTheDocument();
    expect(screen.getByText("Auth Service")).toBeInTheDocument();
  });

  it("does not render monitor section when no monitors", async () => {
    render(<StatusPageFormWrapper orgId="org-1" monitors={[]} />);
    await userEvent.click(screen.getByRole("button", { name: /new status page/i }));
    expect(screen.queryByText(/monitors/i)).not.toBeInTheDocument();
  });

  it("checkboxes start unchecked", async () => {
    render(<StatusPageFormWrapper orgId="org-1" monitors={monitors} />);
    await userEvent.click(screen.getByRole("button", { name: /new status page/i }));
    const checkboxes = screen.getAllByRole("checkbox");
    checkboxes.forEach((cb) => expect(cb).not.toBeChecked());
  });

  it("toggles a monitor checkbox on click", async () => {
    render(<StatusPageFormWrapper orgId="org-1" monitors={monitors} />);
    await userEvent.click(screen.getByRole("button", { name: /new status page/i }));
    const [firstCheckbox] = screen.getAllByRole("checkbox");
    await userEvent.click(firstCheckbox);
    expect(firstCheckbox).toBeChecked();
    await userEvent.click(firstCheckbox);
    expect(firstCheckbox).not.toBeChecked();
  });

  it("submits form with name, slug, and orgId", async () => {
    render(<StatusPageFormWrapper orgId="org-abc" monitors={[]} />);
    await userEvent.click(screen.getByRole("button", { name: /new status page/i }));
    await userEvent.type(screen.getByLabelText(/name/i), "My Service Status");
    await userEvent.type(screen.getByLabelText(/slug/i), "my-service");
    await userEvent.click(screen.getByRole("button", { name: /create status page/i }));
    await waitFor(() => expect(mockFetch).toHaveBeenCalledOnce());
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.name).toBe("My Service Status");
    expect(body.slug).toBe("my-service");
    expect(body.orgId).toBe("org-abc");
  });

  it("posts to /api/status-pages", async () => {
    render(<StatusPageFormWrapper orgId="org-1" monitors={[]} />);
    await userEvent.click(screen.getByRole("button", { name: /new status page/i }));
    await userEvent.type(screen.getByLabelText(/name/i), "Test Page");
    await userEvent.type(screen.getByLabelText(/slug/i), "test");
    await userEvent.click(screen.getByRole("button", { name: /create status page/i }));
    await waitFor(() => expect(mockFetch).toHaveBeenCalledOnce());
    expect(mockFetch.mock.calls[0][0]).toBe("/api/status-pages");
    expect(mockFetch.mock.calls[0][1].method).toBe("POST");
  });

  it("includes selected monitor IDs in submission", async () => {
    render(<StatusPageFormWrapper orgId="org-1" monitors={monitors} />);
    await userEvent.click(screen.getByRole("button", { name: /new status page/i }));
    await userEvent.type(screen.getByLabelText(/name/i), "Test");
    await userEvent.type(screen.getByLabelText(/slug/i), "test");
    const checkboxes = screen.getAllByRole("checkbox");
    await userEvent.click(checkboxes[0]); // check first monitor
    await userEvent.click(screen.getByRole("button", { name: /create status page/i }));
    await waitFor(() => expect(mockFetch).toHaveBeenCalledOnce());
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.monitorIds).toContain(monitors[0].id);
  });
});
