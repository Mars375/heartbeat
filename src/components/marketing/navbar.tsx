"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 flex justify-between items-center px-8 md:px-12 py-5 transition-all duration-300",
      "glass-nav",
      scrolled && "border-b border-[#353534]/30"
    )}>
      <Link href="/" className="font-headline text-xl tracking-widest text-[#e9c176] uppercase select-none">
        Heartbeat
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <Link href="/#features" className="text-sm tracking-[0.35rem] uppercase text-[#9a9895] hover:text-[#ededef] transition-colors">
          Features
        </Link>
        <Link href="/pricing" className="text-sm tracking-[0.35rem] uppercase text-[#9a9895] hover:text-[#ededef] transition-colors">
          Pricing
        </Link>
        <Link href="/sign-in" className="text-sm tracking-[0.35rem] uppercase text-[#9a9895] hover:text-[#ededef] transition-colors">
          Sign In
        </Link>
      </div>

      <Link href="/sign-up">
        <button className="bg-[#e9c176] text-[#1a1400] px-6 py-2 rounded-sm font-body text-xs tracking-[0.15rem] uppercase font-bold hover:bg-[#f0d08a] transition-colors">
          Get Started
        </button>
      </Link>
    </nav>
  );
}
