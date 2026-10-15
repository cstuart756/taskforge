"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";

// ---------------------------------------------------------------------------
// Result type
// ---------------------------------------------------------------------------

export type Verify2FAResult =
  | { success: true; message: string }
  | { success: false; error: string };

// ---------------------------------------------------------------------------
// Verify 2FA code — submit to the credentials-2fa provider
// ---------------------------------------------------------------------------

export async function verify2FA(
  _prevState: Verify2FAResult | undefined,
  formData: FormData
): Promise<Verify2FAResult> {
  const pendingToken = formData.get("pendingToken");
  const code = formData.get("code");

  if (typeof pendingToken !== "string" || !pendingToken) {
    return {
      success: false,
      error: "Missing session token. Please sign in again.",
    };
  }

  if (typeof code !== "string" || code.trim().length === 0) {
    return {
      success: false,
      error: "Please enter your authentication code.",
    };
  }

  try {
    await signIn("credentials-2fa", {
      pendingToken,
      code: code.trim(),
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        error:
          "That code is incorrect or has expired. Please try again or sign in again.",
      };
    }
    throw error;
  }

  // Success — session is issued
  redirect("/app");
}