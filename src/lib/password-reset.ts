import crypto from "crypto";
import { db } from "@/lib/db";

/**
 * Generate a cryptographically secure random token.
 * Returns the raw token (to send in the email) — never store this.
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Hash a token with SHA-256 so we can store it safely.
 * If the database ever leaks, the hash is useless to an attacker.
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Create a reset token for a user and store its hash.
 * Returns the raw token to include in the reset email.
 */
export async function createPasswordResetToken(userId: string): Promise<string> {
  const rawToken = generateResetToken();
  const tokenHash = hashToken(rawToken);

  // Token is valid for 1 hour
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  // Invalidate any existing unused tokens for this user
  await db.passwordResetToken.updateMany({
    where: { userId, usedAt: null },
    data: { usedAt: new Date() },
  });

  await db.passwordResetToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  return rawToken;
}

/**
 * Validate a raw token and return the associated user ID if valid.
 * Returns null if the token is invalid, expired, or already used.
 */
export async function validateResetToken(rawToken: string): Promise<string | null> {
  const tokenHash = hashToken(rawToken);

  const record = await db.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (!record) return null;
  if (record.usedAt) return null;
  if (record.expiresAt < new Date()) return null;

  return record.userId;
}

/**
 * Mark a token as used so it cannot be reused.
 */
export async function consumeResetToken(rawToken: string): Promise<void> {
  const tokenHash = hashToken(rawToken);
  await db.passwordResetToken.update({
    where: { tokenHash },
    data: { usedAt: new Date() },
  });
}