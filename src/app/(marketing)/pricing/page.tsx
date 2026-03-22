import { PricingCards } from "@/components/marketing/pricing-cards";

export default function PricingPage() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-text-primary">Simple, transparent pricing</h1>
        <p className="mt-3 text-text-secondary text-lg">Start free. Upgrade when you need more.</p>
      </div>
      <PricingCards />
    </section>
  );
}
