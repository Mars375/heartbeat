"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center pt-24 pb-20 px-6 md:px-12 overflow-hidden">
      {/* Royal scrim layered on base surface */}
      <div className="absolute inset-0 z-0 bg-[#131313]" />
      <div className="absolute inset-0 z-0 royal-scrim opacity-60" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-8"
        >
          {/* Eyebrow */}
          <p className="font-body text-[#e9c176] tracking-[0.5rem] uppercase text-xs">
            Uptime Intelligence
          </p>

          {/* Headline */}
          <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight text-[#ededef]">
            Know When Your<br />
            Services{" "}
            <em className="text-[#cbbeff]">Break.</em>
          </h1>

          {/* Subheading */}
          <p className="mx-auto max-w-xl text-base md:text-lg text-[#9a9895] leading-relaxed font-body">
            Monitor uptime, manage incidents, and share status pages that inspire trust.
            Get alerted before your customers do.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <Link
              href="/sign-up"
              className="bg-[#e9c176] text-[#1a1400] px-8 py-3 rounded-sm font-body text-xs tracking-[0.15rem] uppercase font-bold hover:bg-[#f0d08a] transition-colors"
            >
              Start Monitoring
            </Link>
            <Link
              href="/s/demo"
              className="border border-[#353534] text-[#9a9895] px-8 py-3 rounded-sm font-body text-xs tracking-[0.15rem] uppercase font-bold hover:text-[#ededef] hover:border-[#9a9895]/40 transition-colors"
            >
              Live Demo
            </Link>
          </div>
        </motion.div>

        {/* Dashboard preview glow wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="relative mt-20 mx-auto max-w-4xl"
        >
          <div className="absolute -inset-4 rounded-sm bg-gradient-to-b from-[#cbbeff]/10 via-[#e9c176]/10 to-transparent blur-2xl" />
          <div className="relative rounded-sm border border-[#353534]/60 bg-[#131313] overflow-hidden">
            {/* Minimal mock dashboard */}
            <div className="border-b border-[#353534]/60 px-6 py-3 flex items-center gap-3">
              <span className="font-headline text-sm tracking-widest text-[#e9c176] uppercase">Heartbeat</span>
              <span className="ml-auto text-xs text-[#6b6967] font-body tracking-widest uppercase">Dashboard</span>
            </div>
            <div className="p-6 space-y-3">
              {[
                { name: "api.heartbeat.app", status: "operational", uptime: "99.98%" },
                { name: "app.heartbeat.app", status: "operational", uptime: "100%" },
                { name: "webhooks.heartbeat.app", status: "degraded", uptime: "99.1%" },
              ].map((monitor) => (
                <div key={monitor.name} className="flex items-center justify-between py-3 border-b border-[#353534]/30 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className={`h-1.5 w-1.5 rounded-full ${monitor.status === "operational" ? "bg-positive" : "bg-warning"}`} />
                    <span className="text-sm text-[#ededef] font-body">{monitor.name}</span>
                  </div>
                  <span className="text-xs text-[#9a9895] font-body tabular-nums">{monitor.uptime}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
