import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createMonitor } from "@/lib/db/queries";
import { z } from "zod";

const createMonitorSchema = z.object({
  orgId: z.string().uuid(),
  name: z.string().min(1).max(100),
  url: z.string().url(),
  method: z.enum(["GET", "HEAD", "POST"]),
  intervalSeconds: z.number().int().min(30),
  expectedStatus: z.number().int().min(100).max(599),
});

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createMonitorSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const monitor = await createMonitor(parsed.data);
  return NextResponse.json(monitor, { status: 201 });
}
