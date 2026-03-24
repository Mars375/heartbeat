"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <div className={cn(
        "flex h-12 w-full max-w-3xl items-center justify-between rounded-full px-4 transition-all duration-300",
        "bg-bg-surface-1/70 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
        scrolled && "shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.4)]"
      )}>
        <Link href="/" className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-accent-primary" fill="currentColor" />
          <span className="text-lg font-bold text-text-primary">Heartbeat</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            Pricing
          </Link>
          <Link href="/sign-in">
            <Button variant="ghost" className="text-text-secondary hover:text-text-primary">Sign in</Button>
          </Link>
          <Link href="/sign-up">
            <Button className="bg-accent-primary hover:bg-accent-primary-hover text-bg-primary">Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
