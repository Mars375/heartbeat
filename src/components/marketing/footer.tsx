import { Heart } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border-default bg-bg-primary py-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2 text-text-secondary">
          <Heart className="h-4 w-4 text-accent-primary" fill="currentColor" />
          <span className="text-sm">Heartbeat</span>
        </div>
        <div className="flex gap-6 text-sm text-text-tertiary">
          <Link href="/pricing" className="hover:text-text-primary transition-colors">Pricing</Link>
          <Link href="/sign-in" className="hover:text-text-primary transition-colors">Sign in</Link>
        </div>
      </div>
    </footer>
  );
}
