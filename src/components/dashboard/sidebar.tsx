"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, AlertTriangle, Globe, Settings, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Monitors", href: "/monitors", icon: Activity },
  { label: "Incidents", href: "/incidents", icon: AlertTriangle },
  { label: "Status Pages", href: "/status-pages", icon: Globe },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 flex-col bg-bg-surface-1/80 backdrop-blur-xl border-r border-white/[0.06]">
      <div className="flex h-14 items-center gap-2.5 px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-primary/15 ring-1 ring-accent-primary/30">
          <Heart className="h-3.5 w-3.5 text-accent-primary" fill="currentColor" />
        </div>
        <span className="text-sm font-semibold text-text-primary tracking-tight">Heartbeat</span>
      </div>
      <div className="h-px bg-white/[0.06] mx-3" />
      <nav className="flex flex-1 flex-col gap-0.5 p-3 pt-3">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150",
                isActive
                  ? "bg-accent-primary/10 text-accent-primary font-medium shadow-[inset_2px_0_0_0_#10B981]"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-surface-2"
              )}
            >
              <Icon className={cn("h-4 w-4 transition-colors", isActive ? "text-accent-primary" : "text-text-tertiary group-hover:text-text-secondary")} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
