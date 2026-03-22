import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createIncident } from "@/lib/db/queries";
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

  return NextResponse.json(incident, { status: 201 });
}
