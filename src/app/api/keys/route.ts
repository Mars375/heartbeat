import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { apiKeys, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateApiKey, hashApiKey, getKeyPrefix } from "@/lib/api-keys";
import { z } from "zod";

const createKeySchema = z.object({
  name: z.string().min(1).max(100),
});

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.query.users.findFirst({ where: eq(users.clerkId, userId) });
  if (!user?.orgId) return NextResponse.json({ error: "No organization" }, { status: 403 });

  const body = await req.json();
  const parsed = createKeySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const rawKey = generateApiKey();
  const keyHash = await hashApiKey(rawKey);
  const keyPrefix = getKeyPrefix(rawKey);

  const [key] = await db.insert(apiKeys).values({
    orgId: user.orgId,
    name: parsed.data.name,
    keyHash,
    keyPrefix,
  }).returning();

  return NextResponse.json({ key, rawKey }, { status: 201 });
}
