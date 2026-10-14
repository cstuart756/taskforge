import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { createEmailVerificationToken } from "@/lib/email-verification";
import { sendVerificationEmail } from "@/lib/email";
import { getClientIp, checkRateLimit, limiter } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    const rateCheck = await checkRateLimit(
      limiter.resendVerification(),
      `resend-verification:${ip}`,
      "Too many verification emails requested. Please try again later."
    );

    if (!rateCheck.success) {
      return rateCheck.response;
    }

    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, emailVerified: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Already verified — no need to send another email
    if (user.emailVerified) {
      return NextResponse.json({ success: true, alreadyVerified: true });
    }

    const rawToken = await createEmailVerificationToken(user.id);
    await sendVerificationEmail(user.email, rawToken);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resend verification error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}