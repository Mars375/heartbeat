import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subscribers, statusPages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { sendVerificationEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  const limit = await rateLimit(`subscribe:${ip}`, 5, 3600);
  if (!limit.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { email } = await req.json();
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const page = await db.select().from(statusPages)
    .where(eq(statusPages.slug, slug))
    .then((rows) => rows[0]);

  if (!page) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const verifyToken = randomBytes(32).toString("hex");
  await db.insert(subscribers).values({
    statusPageId: page.id,
    email,
    verifyToken,
  });

  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/s/${slug}/verify?token=${verifyToken}`;
  await sendVerificationEmail(email, verifyUrl);

  return NextResponse.json({ ok: true });
}
