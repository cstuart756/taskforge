"use server";
import { RegisterSchema, LoginSchema } from "@/lib/schemas";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import { signIn, signOut } from "@/auth";
import { uniqueSlug } from "@/lib/slug";

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

  const passwordHash = await bcrypt.hash(password, 12);

  const teamName = `${name}'s Team`;
  const teamSlug = await uniqueSlug(teamName, async (candidate) => {
    const found = await db.team.findUnique({ where: { slug: candidate } });
    return found !== null;
  });

  try {
    await db.$transaction(async (tx) => {
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
    });
  } catch (error) {
    console.error("Registration failed:", error);
    return {
      success: false,
      error: "Could not create your account. Please try again.",
    };
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

  const callbackUrl = formData.get("callbackUrl");
  const target =
    typeof callbackUrl === "string" && callbackUrl.startsWith("/")
      ? callbackUrl
      : "/app";
  redirect(target);
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

  try {
    await signIn("credentials", {
      email,
      password: parsed.data.password,
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