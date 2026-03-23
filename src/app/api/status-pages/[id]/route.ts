import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getStatusPageWithMonitors, addMonitorToStatusPage, removeMonitorFromStatusPage } from "@/lib/db/queries";
import { z } from "zod";

const patchSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("add"), monitorId: z.string().uuid() }),
  z.object({ action: z.literal("remove"), monitorId: z.string().uuid() }),
]);

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  // We rely on the caller knowing their orgId for auth; status page is fetched by id
  // Full auth guard happens at the page level via requireAuth
  return NextResponse.json({ id });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { action, monitorId } = parsed.data;
  if (action === "add") {
    await addMonitorToStatusPage(id, monitorId);
  } else {
    await removeMonitorFromStatusPage(id, monitorId);
  }

  return NextResponse.json({ ok: true });
}
