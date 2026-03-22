import { NextRequest, NextResponse } from "next/server";
import { seedDatabase } from "@/lib/db/seed";

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }
  await seedDatabase();
  return NextResponse.json({ ok: true });
}
