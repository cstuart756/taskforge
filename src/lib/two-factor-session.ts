import crypto from "crypto";
import { Redis } from "@upstash/redis";

const PENDING_2FA_PREFIX = "pending2fa:";
const PENDING_2FA_TTL_SECONDS = 300; // 5 minutes

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

/**
 * Create a pending 2FA session token for a user.
 * Returns the raw token (put in the URL) — the token itself is
 * not a secret that protects anything on its own, but it is
 * single-use and time-limited.
 */
export async function createPending2FA(userId: string): Promise<string> {
  const redis = getRedis();
  if (!redis) {
    throw new Error(
      "Upstash Redis is not configured — cannot create pending 2FA session"
    );
  }

  const token = crypto.randomBytes(32).toString("hex");

  await redis.set(`${PENDING_2FA_PREFIX}${token}`, userId, {
    ex: PENDING_2FA_TTL_SECONDS,
  });

  return token;
}

/**
 * Look up the user ID for a pending 2FA token.
 * Returns null if the token is missing or expired.
 */
export async function getPending2FA(token: string): Promise<string | null> {
  const redis = getRedis();
  if (!redis) return null;

  const userId = await redis.get<string>(`${PENDING_2FA_PREFIX}${token}`);
  return userId ?? null;
}

/**
 * Consume a pending 2FA token (delete it from Redis).
 * Safe to call even if the token doesn't exist.
 */
export async function deletePending2FA(token: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  await redis.del(`${PENDING_2FA_PREFIX}${token}`);
}