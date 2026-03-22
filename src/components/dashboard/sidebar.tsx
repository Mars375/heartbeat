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
    <aside className="flex h-full w-60 flex-col border-r border-border-default bg-bg-surface-1">
      <div className="flex h-14 items-center gap-2 border-b border-border-default px-4">
        <Heart className="h-5 w-5 text-accent-primary" fill="currentColor" />
        <span className="text-lg font-semibold text-text-primary">Heartbeat</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-accent-glow text-accent-primary font-medium"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-surface-2"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
