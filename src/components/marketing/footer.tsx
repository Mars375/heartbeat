import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#353534]/30 bg-[#0e0e0e] py-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 md:px-12">
        <span className="font-headline text-sm tracking-widest text-[#e9c176] uppercase">
          Heartbeat
        </span>
        <div className="flex gap-8 text-[10px] text-[#6b6967] tracking-widest uppercase font-body">
          <Link href="/pricing" className="hover:text-[#9a9895] transition-colors">Pricing</Link>
          <Link href="/sign-in" className="hover:text-[#9a9895] transition-colors">Sign In</Link>
        </div>
      </div>
    </footer>
  );
}
