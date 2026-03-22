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
    <nav className={cn(
      "fixed top-0 z-50 w-full transition-all duration-300",
      scrolled ? "bg-bg-primary/80 backdrop-blur-lg border-b border-border-default" : "bg-transparent"
    )}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
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
