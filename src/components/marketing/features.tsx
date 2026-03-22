"use client";

import { motion } from "framer-motion";
import { Activity, AlertTriangle, Globe, Bell, Shield, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: Activity, title: "Uptime Monitoring", description: "Check your endpoints every 30 seconds. Get instant alerts when something goes wrong." },
  { icon: Globe, title: "Beautiful Status Pages", description: "Branded, public status pages that keep your users informed automatically." },
  { icon: AlertTriangle, title: "Incident Management", description: "Track and communicate incidents with a timeline your team and users can follow." },
  { icon: Bell, title: "Smart Notifications", description: "Email alerts for your team, subscriber notifications for your users." },
  { icon: Shield, title: "API-First", description: "Full REST API with rate limiting. Integrate monitoring into your CI/CD pipeline." },
  { icon: Zap, title: "Fast & Reliable", description: "Built on Vercel's edge network. Sub-second response time checks from multiple regions." },
];

export function Features() {
  return (
    <section className="py-20 bg-bg-surface-1">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary">Everything you need to stay online</h2>
          <p className="mt-3 text-text-secondary">Monitor, alert, communicate — all in one platform.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-border-default bg-bg-surface-2 h-full">
                <CardContent className="p-6 space-y-3">
                  <feature.icon className="h-8 w-8 text-accent-primary" />
                  <h3 className="text-lg font-semibold text-text-primary">{feature.title}</h3>
                  <p className="text-sm text-text-secondary">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
