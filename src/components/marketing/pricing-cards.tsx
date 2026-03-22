"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "For side projects",
    features: ["3 monitors", "5-minute checks", "1 status page", "Email alerts", "7-day history"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Starter",
    price: "$9",
    period: "/mo",
    description: "For growing products",
    features: ["10 monitors", "1-minute checks", "3 status pages", "API access", "90-day history", "Custom branding"],
    cta: "Start Trial",
    popular: true,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "For teams",
    features: ["50 monitors", "30-second checks", "10 status pages", "Priority support", "1-year history", "Custom domains", "Webhooks", "Team members"],
    cta: "Start Trial",
    popular: false,
  },
];

export function PricingCards() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-5xl mx-auto">
      {plans.map((plan, i) => (
        <motion.div
          key={plan.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className={cn(
            "border-border-default bg-bg-surface-1 h-full flex flex-col",
            plan.popular && "border-accent-primary/50 ring-1 ring-accent-primary/20"
          )}>
            {plan.popular && (
              <div className="bg-accent-primary text-bg-primary text-center text-xs font-bold py-1 rounded-t-lg">
                MOST POPULAR
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-text-primary">{plan.name}</CardTitle>
              <p className="text-text-secondary text-sm">{plan.description}</p>
              <div className="pt-2">
                <span className="text-4xl font-bold text-text-primary">{plan.price}</span>
                {plan.period && <span className="text-text-secondary">{plan.period}</span>}
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-text-secondary">
                    <Check className="h-4 w-4 text-accent-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up">
                <Button className={cn(
                  "w-full",
                  plan.popular
                    ? "bg-accent-primary hover:bg-accent-primary-hover text-bg-primary"
                    : "bg-bg-surface-2 text-text-primary hover:bg-border-default"
                )}>
                  {plan.cta}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
