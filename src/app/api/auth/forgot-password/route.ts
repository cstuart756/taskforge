import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createPasswordResetToken } from "@/lib/password-reset";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const normalisedEmail = email.trim().toLowerCase();

    const user = await db.user.findUnique({
      where: { email: normalisedEmail },
    });

    // Always return success — never reveal if the email exists
    if (!user) {
      return NextResponse.json({ success: true });
    }

    const rawToken = await createPasswordResetToken(user.id);
    await sendPasswordResetEmail(user.email, rawToken);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}