"use server";

import { revalidatePath } from "next/cache";
import { auth, unstable_update } from "@/auth";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { UpdateNameSchema, ChangePasswordSchema } from "@/lib/schemas";

// ---------------------------------------------------------------------------
// Shared result type
// ---------------------------------------------------------------------------

export type SettingsActionResult =
  | { success: true; message: string }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

// ---------------------------------------------------------------------------
// Update display name
// ---------------------------------------------------------------------------

export async function updateName(
  _prevState: SettingsActionResult | undefined,
  formData: FormData
): Promise<SettingsActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in." };
  }

  const parsed = UpdateNameSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Please correct the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await db.user.update({
      where: { id: session.user.id },
      data: { name: parsed.data.name },
    });
  } catch (err) {
    console.error("Failed to update name:", err);
    return {
      success: false,
      error: "Could not update your name. Please try again.",
    };
  }

  // Refresh the JWT so the new name appears immediately on the dashboard.
  // Without this, session.user.name stays stale until the JWT expires.
  try {
    await unstable_update({
      user: { name: parsed.data.name },
    });
  } catch (err) {
    console.error("Failed to refresh session after name update:", err);
    // Non-fatal — the DB is updated. Session will catch up on next login.
  }

  // Bust Next.js route caches so /app re-renders with the new name
  revalidatePath("/app");
  revalidatePath("/app/settings");

  return { success: true, message: "Name updated." };
}

// ---------------------------------------------------------------------------
// Change password
// ---------------------------------------------------------------------------

export async function changePassword(
  _prevState: SettingsActionResult | undefined,
  formData: FormData
): Promise<SettingsActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in." };
  }

  const parsed = ChangePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
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
    select: { passwordHash: true },
  });

  if (!user?.passwordHash) {
    return {
      success: false,
      error: "Could not verify your account. Please sign in again.",
    };
  }

  // Re-authentication: verify the current password before allowing a change.
  const isValid = await verifyPassword(
    parsed.data.currentPassword,
    user.passwordHash
  );

  if (!isValid) {
    return {
      success: false,
      error: "Current password is incorrect.",
      fieldErrors: {
        currentPassword: ["Current password is incorrect"],
      },
    };
  }

  const newHash = await hashPassword(parsed.data.newPassword);

  try {
    await db.user.update({
      where: { id: session.user.id },
      data: { passwordHash: newHash },
    });
  } catch (err) {
    console.error("Failed to update password:", err);
    return {
      success: false,
      error: "Could not update your password. Please try again.",
    };
  }

  return { success: true, message: "Password updated." };
}