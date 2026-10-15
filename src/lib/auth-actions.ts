"use server";
import { RegisterSchema, LoginSchema } from "@/lib/schemas";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import { signIn, signOut } from "@/auth";
import { uniqueSlug } from "@/lib/slug";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createEmailVerificationToken } from "@/lib/email-verification";
import { sendVerificationEmail } from "@/lib/email";
import { createPending2FA } from "@/lib/two-factor-session";

// ---------------------------------------------------------------------------
// Shared result type
// ---------------------------------------------------------------------------

export type AuthActionResult =
  | { success: true; message: string }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

// ---------------------------------------------------------------------------
// Register server action
// ---------------------------------------------------------------------------

export async function registerUser(
  _prevState: AuthActionResult | undefined,
  formData: FormData
): Promise<AuthActionResult> {
  const parsed = RegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Please correct the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = parsed.data;
  const lowerEmail = email.toLowerCase();

  const existing = await db.user.findUnique({
    where: { email: lowerEmail },
  });

  if (existing) {
    return {
      success: false,
      error: "An account with this email already exists.",
    };
  }

  const passwordHash = await hashPassword(password);

  const teamName = `${name}'s Team`;
  const teamSlug = await uniqueSlug(teamName, async (candidate) => {
    const found = await db.team.findUnique({ where: { slug: candidate } });
    return found !== null;
  });

  let newUserId: string;
  try {
    newUserId = await db.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email: lowerEmail,
          passwordHash,
        },
      });

      const newTeam = await tx.team.create({
        data: {
          name: teamName,
          slug: teamSlug,
        },
      });

      await tx.teamMember.create({
        data: {
          userId: newUser.id,
          teamId: newTeam.id,
          role: "OWNER",
        },
      });

      return newUser.id;
    });
  } catch (error) {
    console.error("Registration failed:", error);
    return {
      success: false,
      error: "Could not create your account. Please try again.",
    };
  }

  const isTestMode = process.env.E2E_TEST_MODE === "true";

  if (isTestMode) {
    try {
      await db.user.update({
        where: { id: newUserId },
        data: { emailVerified: new Date() },
      });
    } catch (error) {
      console.error("Failed to mark user verified in test mode:", error);
    }
  } else {
    try {
      const rawToken = await createEmailVerificationToken(newUserId);
      await sendVerificationEmail(lowerEmail, rawToken);
    } catch (error) {
      console.error("Failed to send verification email:", error);
    }
  }

  try {
    await signIn("credentials", {
      email: lowerEmail,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      console.error("Auto sign-in after registration failed:", error.type);
    }
  }

  redirect(isTestMode ? "/app" : "/verify-email");
}

// ---------------------------------------------------------------------------
// Login server action
// ---------------------------------------------------------------------------

export async function loginUser(
  _prevState: AuthActionResult | undefined,
  formData: FormData
): Promise<AuthActionResult> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Please correct the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const email = parsed.data.email.toLowerCase();
  const password = parsed.data.password;

  // -----------------------------------------------------------------------
  // Pre-check: if the user has 2FA enabled, verify the password here and
  // redirect to the challenge page. We never call signIn("credentials")
  // for a 2FA user — the credentials provider also refuses them, so
  // direct POSTs to /api/auth/callback/credentials are blocked too.
  // -----------------------------------------------------------------------
  const candidate = await db.user.findUnique({
    where: { email },
    select: { id: true, twoFactorEnabled: true, passwordHash: true },
  });

  if (candidate?.twoFactorEnabled && candidate.passwordHash) {
    const passwordOk = await verifyPassword(password, candidate.passwordHash);

    if (!passwordOk) {
      return {
        success: false,
        error: "Invalid email or password.",
      };
    }

    const pendingToken = await createPending2FA(candidate.id);
    redirect(`/login/2fa?token=${pendingToken}`);
  }

  // -----------------------------------------------------------------------
  // Normal single-step login
  // -----------------------------------------------------------------------
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        error: "Invalid email or password.",
      };
    }
    throw error;
  }

  const callbackUrl = formData.get("callbackUrl");
  const target =
    typeof callbackUrl === "string" && callbackUrl.startsWith("/")
      ? callbackUrl
      : "/app";
  redirect(target);
}

// ---------------------------------------------------------------------------
// Logout server action
// ---------------------------------------------------------------------------

export async function logoutUser() {
  await signOut({ redirectTo: "/login" });
}