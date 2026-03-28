import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { addIncidentUpdate, getIncidentById, getStatusPagesForMonitor, getSubscribers } from "@/lib/db/queries";
import { sendIncidentNotification } from "@/lib/email";
import { db } from "@/lib/db";
import { incidentMonitors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["investigating", "identified", "monitoring", "resolved"]),
  message: z.string().min(1),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.clerkId, userId),
  });
  if (!user?.orgId) return NextResponse.json({ error: "No organization" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const update = await addIncidentUpdate({
    incidentId: id,
    status: parsed.data.status,
    message: parsed.data.message,
  });

  // Send notifications when incident is resolved
  if (parsed.data.status === "resolved") {
    try {
      const incident = await getIncidentById(id, user.orgId);
      if (incident) {
        // Get monitor IDs associated with this incident
        const monitors = await db.query.incidentMonitors.findMany({
          where: eq(incidentMonitors.incidentId, id),
        });

        if (monitors.length > 0) {
          const statusPages = await Promise.all(
            monitors.map((im) => getStatusPagesForMonitor(im.monitorId))
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
                title: `${incident.title} - Resolved`,
                severity: incident.severity,
                status: "resolved",
                statusPageUrl,
              });
            })
          );
        }
      }
    } catch (error) {
      console.error("Failed to send incident resolution notifications:", error);
      // Don't fail the request if notification sending fails
    }
  }

  return NextResponse.json(update, { status: 201 });
}
