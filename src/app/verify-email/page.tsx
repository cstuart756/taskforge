import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import VerifyEmailClient from "./verify-email-client";

export const metadata = {
  title: "Verify your email",
  description: "Confirm your email address to activate your TaskForge account.",
};

export default async function VerifyEmailPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Already verified? Send them straight to the app.
  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { emailVerified: true },
  });

  if (user?.emailVerified) {
    redirect("/app");
  }

  return <VerifyEmailClient email={session.user.email} />;
}