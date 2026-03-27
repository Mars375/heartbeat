"use client";

import { motion } from "framer-motion";
import { Activity, AlertTriangle, Globe, Bell, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Uptime Monitoring",
    description: "Check your endpoints every 30 seconds. Get instant alerts when something goes wrong.",
  },
  {
    icon: Globe,
    title: "Beautiful Status Pages",
    description: "Branded, public status pages that keep your users informed automatically.",
  },
  {
    icon: AlertTriangle,
    title: "Incident Management",
    description: "Track and communicate incidents with a timeline your team and users can follow.",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Email alerts for your team, subscriber notifications for your users.",
  },
  {
    icon: Shield,
    title: "API-First",
    description: "Full REST API with rate limiting. Integrate monitoring into your CI/CD pipeline.",
  },
  {
    icon: Zap,
    title: "Fast & Reliable",
    description: "Sub-second response time checks from multiple regions worldwide.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-32 md:py-48 px-6 md:px-12 bg-[#0e0e0e]">
      <div className="max-w-6xl mx-auto">
        {/* Asymmetric header — 12-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-16 md:mb-24">
          <motion.div
            className="md:col-span-7"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-headline text-4xl md:text-6xl text-[#ededef] leading-tight">
              The Architecture<br />of Reliability.
            </h2>
          </motion.div>
          <motion.div
            className="md:col-span-5 pb-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="border-l border-[#e9c176]/30 pl-6 text-[#9a9895] text-base font-body leading-relaxed">
              Everything you need to monitor, alert, and communicate — built for teams who can&apos;t afford downtime.
            </p>
          </motion.div>
        </div>

        {/* Tight 3-card asymmetric grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#353534]/20">
          {features.map((feature, i) => {
            const isMiddleRow = i === 1 || i === 4;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`bg-[#131313] p-10 md:p-12 flex flex-col gap-5 ${
                  isMiddleRow ? "md:-mt-8 border-x border-[#353534]/20" : ""
                }`}
              >
                <feature.icon className="h-6 w-6 text-[#e9c176]" strokeWidth={1.5} />
                <div className="space-y-2">
                  <h3 className="font-headline text-lg text-[#ededef]">{feature.title}</h3>
                  <p className="text-sm text-[#9a9895] font-body leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
