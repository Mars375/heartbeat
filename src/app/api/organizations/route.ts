import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { organizations, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const createOrgSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
});

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createOrgSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const [org] = await db.insert(organizations).values({
    name: parsed.data.name,
    slug: parsed.data.slug,
  }).returning();

  await db.update(users).set({ orgId: org.id, role: "owner" }).where(eq(users.clerkId, userId));

  return NextResponse.json(org, { status: 201 });
}
