"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, Shield, Bell } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08),transparent_70%)]" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-primary/30 bg-accent-glow px-4 py-1.5 text-sm text-accent-primary">
            <Activity className="h-3.5 w-3.5" />
            Modern uptime monitoring
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-text-primary sm:text-6xl">
            Know when your services{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #10B981, #34D399)" }}>
              go down
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-text-secondary">
            Monitor uptime, manage incidents, and share beautiful status pages with your users.
            Get notified before your customers notice.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="/sign-up">
              <Button size="lg" className="bg-accent-primary hover:bg-accent-primary-hover text-bg-primary">
                Start for Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-border-default text-text-secondary hover:text-text-primary">
                See Pricing
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 flex justify-center gap-12 text-center"
        >
          {[
            { icon: Activity, label: "99.9% Uptime Tracking" },
            { icon: Shield, label: "Secure by Default" },
            { icon: Bell, label: "Instant Alerts" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <Icon className="h-5 w-5 text-accent-primary" />
              <span className="text-sm text-text-secondary">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
