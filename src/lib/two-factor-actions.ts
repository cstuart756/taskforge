"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import {
  generateSecret,
  generateOtpauthUrl,
  generateQRCodeDataUrl,
  verifyTOTP,
  generateBackupCodes,
} from "@/lib/two-factor";
import { Enable2FASchema, Disable2FASchema } from "@/lib/schemas";

// ---------------------------------------------------------------------------
// Result types
// ---------------------------------------------------------------------------

export type StartSetupResult =
  | { success: true; qrDataUrl: string; secret: string }
  | { success: false; error: string };

export type ConfirmSetupResult =
  | { success: true; backupCodes: string[] }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

export type Disable2FAResult =
  | { success: true; message: string }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

// ---------------------------------------------------------------------------
// Start setup — generate pending secret and QR code
// ---------------------------------------------------------------------------

export async function startTwoFactorSetup(): Promise<StartSetupResult> {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return { success: false, error: "You must be signed in." };
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { twoFactorEnabled: true },
  });

  if (user?.twoFactorEnabled) {
    return {
      success: false,
      error: "Two-factor authentication is already enabled.",
    };
  }

  const secret = generateSecret();

  // Store as pending — not active until the user proves they can generate
  // a valid code with it. Prevents lock-out if they abandon setup halfway.
  await db.user.update({
    where: { id: session.user.id },
    data: { twoFactorPendingSecret: secret },
  });

  const otpauthUrl = generateOtpauthUrl(session.user.email, secret);
  const qrDataUrl = await generateQRCodeDataUrl(otpauthUrl);

  return { success: true, qrDataUrl, secret };
}

// ---------------------------------------------------------------------------
// Confirm setup — verify code, activate 2FA, return backup codes
// ---------------------------------------------------------------------------

export async function confirmTwoFactorSetup(
  _prevState: ConfirmSetupResult | undefined,
  formData: FormData
): Promise<ConfirmSetupResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in." };
  }

  const parsed = Enable2FASchema.safeParse({
    code: formData.get("code"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Please correct the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      twoFactorPendingSecret: true,
      twoFactorEnabled: true,
    },
  });

  if (!user?.twoFactorPendingSecret) {
    return {
      success: false,
      error: "No pending 2FA setup. Please start again.",
    };
  }

  if (user.twoFactorEnabled) {
    return {
      success: false,
      error: "Two-factor authentication is already enabled.",
    };
  }

  if (!verifyTOTP(parsed.data.code, user.twoFactorPendingSecret)) {
    return {
      success: false,
      error: "That code is incorrect or has expired. Please try again.",
      fieldErrors: {
        code: ["That code is incorrect or has expired."],
      },
    };
  }

  const { plain, hashed } = generateBackupCodes();

  await db.user.update({
    where: { id: session.user.id },
    data: {
      twoFactorEnabled: true,
      twoFactorSecret: user.twoFactorPendingSecret,
      twoFactorPendingSecret: null,
      twoFactorBackupCodes: hashed,
      twoFactorEnabledAt: new Date(),
    },
  });

  revalidatePath("/app/settings/security");

  // Plain codes are returned exactly once — never stored in this form
  return { success: true, backupCodes: plain };
}

// ---------------------------------------------------------------------------
// Disable 2FA — requires password re-authentication
// ---------------------------------------------------------------------------

export async function disableTwoFactor(
  _prevState: Disable2FAResult | undefined,
  formData: FormData
): Promise<Disable2FAResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in." };
  }

  const parsed = Disable2FASchema.safeParse({
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Please correct the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { passwordHash: true, twoFactorEnabled: true },
  });

  if (!user?.passwordHash) {
    return { success: false, error: "Could not verify your account." };
  }

  if (!user.twoFactorEnabled) {
    return {
      success: false,
      error: "Two-factor authentication is not enabled.",
    };
  }

  const isValid = await verifyPassword(
    parsed.data.password,
    user.passwordHash
  );

  if (!isValid) {
    return {
      success: false,
      error: "Password is incorrect.",
      fieldErrors: { password: ["Password is incorrect"] },
    };
  }

  await db.user.update({
    where: { id: session.user.id },
    data: {
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorPendingSecret: null,
      twoFactorBackupCodes: [],
      twoFactorEnabledAt: null,
    },
  });

  revalidatePath("/app/settings/security");

  return {
    success: true,
    message: "Two-factor authentication disabled.",
  };
}