import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { addIncidentUpdate } from "@/lib/db/queries";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["investigating", "identified", "monitoring", "resolved"]),
  message: z.string().min(1),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

  return NextResponse.json(update, { status: 201 });
}
