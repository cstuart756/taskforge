import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  validateEmailVerificationToken,
  consumeEmailVerificationToken,
} from "@/lib/email-verification";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/verify-email?error=missing", url));
  }

  const userId = await validateEmailVerificationToken(token);

  if (!userId) {
    return NextResponse.redirect(new URL("/verify-email?error=invalid", url));
  }

  try {
    await db.user.update({
      where: { id: userId },
      data: { emailVerified: new Date() },
    });

    await consumeEmailVerificationToken(token);

    return NextResponse.redirect(new URL("/app?verified=true", url));
  } catch (err) {
    console.error("Email verification error:", err);
    return NextResponse.redirect(new URL("/verify-email?error=server", url));
  }
}