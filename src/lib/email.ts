import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM || "onboarding@resend.dev";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function sendPasswordResetEmail(
  to: string,
  rawToken: string
): Promise<void> {
  const resetUrl = `${APP_URL}/reset-password?token=${rawToken}`;

  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "Reset your TaskForge password",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1f2937;">Reset your password</h2>
        <p style="color: #4b5563; line-height: 1.6;">
          We received a request to reset the password for your TaskForge account.
        </p>
        <p style="color: #4b5563; line-height: 1.6;">
          Click the button below to choose a new password. This link expires in 1 hour
          and can only be used once.
        </p>
        <p style="margin: 32px 0;">
          <a href="${resetUrl}"
             style="background-color: #2563eb; color: white; padding: 12px 24px;
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset password
          </a>
        </p>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
          If you didn't request this, you can safely ignore this email —
          your password will not change.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">
          TaskForge — Simple task management for small teams
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Failed to send reset email:", error);
    throw new Error("Failed to send reset email");
  }
}