import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => { cleanup(); });

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => "/monitors",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next/font/local", () => ({
  default: () => ({ variable: "--font-mock", className: "mock-font" }),
}));

vi.mock("geist/font/sans", () => ({
  GeistSans: { variable: "--font-geist-sans" },
}));

vi.mock("geist/font/mono", () => ({
  GeistMono: { variable: "--font-geist-mono" },
}));

vi.mock("@clerk/nextjs", () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
  UserProfile: () => null,
  useUser: () => ({ user: { id: "test-user" }, isLoaded: true }),
  useAuth: () => ({ userId: "test-user", isLoaded: true }),
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn().mockResolvedValue({ userId: "test-user-id" }),
}));

vi.mock("framer-motion", () => ({
  motion: new Proxy({} as Record<string, React.FC<Record<string, unknown>>>, {
    get: (_target, prop: string) => {
      return ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => {
        const tag = prop as keyof JSX.IntrinsicElements;
        const { createElement } = require("react");
        const filteredProps: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(props)) {
          if (!["initial", "animate", "exit", "transition", "whileHover", "whileTap", "whileInView", "variants", "layout", "layoutId"].includes(key)) {
            filteredProps[key] = value;
          }
        }
        return createElement(tag, filteredProps, children);
      };
    },
  }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useInView: () => true,
}));

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => children,
  AreaChart: ({ children }: { children: React.ReactNode }) => children,
  Area: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  CartesianGrid: () => null,
}));
