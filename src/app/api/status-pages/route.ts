import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createStatusPage, addMonitorToStatusPage } from "@/lib/db/queries";
import { z } from "zod";

const schema = z.object({
  orgId: z.string().uuid(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(60).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  brandingColor: z.string().optional(),
  monitorIds: z.array(z.string().uuid()).optional(),
});

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { monitorIds = [], ...pageData } = parsed.data;
  const page = await createStatusPage(pageData);

  if (monitorIds.length > 0) {
    await Promise.all(
      monitorIds.map((monitorId, i) => addMonitorToStatusPage(page.id, monitorId, i))
    );
  }

  return NextResponse.json(page, { status: 201 });
}
