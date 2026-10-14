import crypto from "crypto";
import { db } from "@/lib/db";

/**
 * Generate a cryptographically secure random token.
 * Returns the raw token (to send in the email) — never store this.
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Hash a token with SHA-256 so we can store it safely.
 * Duplicated from password-reset.ts deliberately — it's 3 lines of
 * pure code and won't change. Extract to a shared utility if we add
 * a third token type.
 */
function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Create a verification token for a user and store its hash.
 * Returns the raw token to include in the verification email.
 * Valid for 24 hours (longer than password reset — users may not
 * check their inbox immediately after signing up).
 */
export async function createEmailVerificationToken(
  userId: string
): Promise<string> {
  const rawToken = generateVerificationToken();
  const tokenHash = hashToken(rawToken);

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Invalidate any existing unused tokens for this user
  await db.emailVerificationToken.updateMany({
    where: { userId, usedAt: null },
    data: { usedAt: new Date() },
  });

  await db.emailVerificationToken.create({
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
export async function validateEmailVerificationToken(
  rawToken: string
): Promise<string | null> {
  const tokenHash = hashToken(rawToken);

  const record = await db.emailVerificationToken.findUnique({
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
export async function consumeEmailVerificationToken(
  rawToken: string
): Promise<void> {
  const tokenHash = hashToken(rawToken);
  await db.emailVerificationToken.update({
    where: { tokenHash },
    data: { usedAt: new Date() },
  });
}