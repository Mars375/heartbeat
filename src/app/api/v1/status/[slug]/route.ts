import { NextRequest, NextResponse } from "next/server";
import { getStatusPageBySlug } from "@/lib/db/queries";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  const limit = await rateLimit(`api:${ip}`, 60, 60);
  if (!limit.success) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  const data = await getStatusPageBySlug(slug);
  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { page, monitors, activeIncidents } = data;

  return NextResponse.json({
    name: page.name,
    status: monitors.some((m) => m.lastStatus === "down") ? "down"
      : monitors.some((m) => m.lastStatus === "degraded") ? "degraded"
      : "operational",
    monitors: monitors.map((m) => ({
      name: m.name,
      status: m.lastStatus,
      lastCheckedAt: m.lastCheckedAt,
    })),
    activeIncidents: activeIncidents.map((i) => ({
      title: i.title,
      severity: i.severity,
      status: i.status,
      startedAt: i.startedAt,
    })),
    updatedAt: new Date().toISOString(),
  });
}
