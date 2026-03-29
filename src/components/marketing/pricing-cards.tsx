"use client";

import { motion } from "framer-motion";
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
    <section className="py-32 md:py-48 px-6 md:px-12 bg-[#0e0e0e]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-headline text-4xl md:text-5xl text-[#ededef] mb-4">Select Your Tier</h2>
          <div className="h-px w-24 bg-[#e9c176] mx-auto opacity-30" />
        </div>

        <div className="grid grid-cols-1 gap-px md:grid-cols-3 bg-[#353534]/20">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "flex flex-col bg-[#131313] p-8 md:p-10",
                plan.popular && "md:scale-105 md:shadow-2xl md:z-10 md:border-x border-[#e9c176]/20 bg-[#201f1f]"
              )}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="inline-flex self-start mb-5">
                  <span className="bg-[#e9c176] text-[#1a1400] text-[10px] font-bold tracking-[0.2rem] uppercase px-3 py-1 rounded-sm">
                    Most Coveted
                  </span>
                </div>
              )}

              {/* Plan name & description */}
              <div className="mb-6">
                <h3 className="font-headline text-xl text-[#ededef] mb-1">{plan.name}</h3>
                <p className="text-xs text-[#9a9895] font-body tracking-wide">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <span className="font-headline text-4xl text-[#ededef]">{plan.price}</span>
                {plan.period && <span className="text-[#9a9895] font-body text-sm">{plan.period}</span>}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-[#9a9895] font-body">
                    <Check className="h-3.5 w-3.5 text-[#e9c176] shrink-0" strokeWidth={2.5} />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/sign-up"
                className={cn(
                  "block w-full py-3 rounded-sm text-xs font-bold tracking-[0.15rem] uppercase font-body transition-colors text-center",
                  plan.popular
                    ? "bg-[#e9c176] text-[#1a1400] hover:bg-[#f0d08a]"
                    : "border border-[#353534] text-[#9a9895] hover:text-[#ededef] hover:border-[#9a9895]/40"
                )}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
