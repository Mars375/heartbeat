import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createIncident, getStatusPagesForMonitor, getSubscribers } from "@/lib/db/queries";
import { sendIncidentNotification } from "@/lib/email";
import { z } from "zod";

const createIncidentSchema = z.object({
  title: z.string().min(1).max(200),
  message: z.string().min(1),
  severity: z.enum(["minor", "major", "critical"]),
  monitorIds: z.array(z.string().uuid()).default([]),
});

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.query.users.findFirst({ where: eq(users.clerkId, userId) });
  if (!user?.orgId) return NextResponse.json({ error: "No organization" }, { status: 403 });

  const body = await req.json();
  const parsed = createIncidentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const incident = await createIncident({
    orgId: user.orgId,
    title: parsed.data.title,
    severity: parsed.data.severity,
    monitorIds: parsed.data.monitorIds,
  });

  // Send notifications to subscribers of affected status pages
  if (parsed.data.monitorIds.length > 0) {
    try {
      const statusPages = await Promise.all(
        parsed.data.monitorIds.map((monitorId) =>
          getStatusPagesForMonitor(monitorId)
        )
      );

      const uniquePages = Array.from(
        new Map(statusPages.flat().map((p) => [p.id, p])).values()
      );

      await Promise.allSettled(
        uniquePages.map(async (page) => {
          const subs = await getSubscribers(page.id);
          const emails = subs.map((s) => s.email);
          const statusPageUrl = `${process.env.NEXT_PUBLIC_APP_URL}/s/${page.slug}`;

          await sendIncidentNotification(emails, {
            title: parsed.data.title,
            severity: parsed.data.severity,
            status: "investigating",
            statusPageUrl,
          });
        })
      );
    } catch (error) {
      console.error("Failed to send incident notifications:", error);
      // Don't fail the request if notification sending fails
    }
  }

  return NextResponse.json(incident, { status: 201 });
}
