"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/sign-in", label: "Sign In" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      aria-label="Main navigation"
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 glass-nav",
        scrolled && "border-b border-[#353534]/30"
      )}
    >
      <div className="flex justify-between items-center px-8 md:px-12 py-5">
        <Link href="/" className="font-headline text-xl tracking-widest text-[#e9c176] uppercase select-none">
          Heartbeat
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className="text-sm tracking-[0.35rem] uppercase text-[#9a9895] hover:text-[#ededef] transition-colors">
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/sign-up"
            className="bg-[#e9c176] text-[#1a1400] px-6 py-2 rounded-sm font-body text-xs tracking-[0.15rem] uppercase font-bold hover:bg-[#f0d08a] transition-colors"
          >
            Get Started
          </Link>
          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-[#9a9895] hover:text-[#ededef] transition-colors"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#353534]/30 px-8 py-4 flex flex-col gap-4">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="text-sm tracking-[0.35rem] uppercase text-[#9a9895] hover:text-[#ededef] transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
