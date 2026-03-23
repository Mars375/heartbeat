import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { organizations, subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const orgId = session.metadata?.orgId;
      if (orgId && session.customer) {
        await db.update(organizations).set({
          stripeCustomerId: session.customer as string,
        }).where(eq(organizations.id, orgId));
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object;
      const org = await db.query.organizations.findFirst({
        where: eq(organizations.stripeCustomerId, sub.customer as string),
      });
      if (org) {
        const item = sub.items.data[0];
        await db.insert(subscriptions).values({
          orgId: org.id,
          stripeSubscriptionId: sub.id,
          status: sub.status as "active" | "canceled" | "past_due" | "trialing",
          planId: item.price.id,
          currentPeriodStart: new Date(item.current_period_start * 1000),
          currentPeriodEnd: new Date(item.current_period_end * 1000),
        }).onConflictDoUpdate({
          target: subscriptions.stripeSubscriptionId,
          set: {
            status: sub.status as "active" | "canceled" | "past_due" | "trialing",
            planId: item.price.id,
            currentPeriodStart: new Date(item.current_period_start * 1000),
            currentPeriodEnd: new Date(item.current_period_end * 1000),
          },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
