import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type Limiter = {
  limit: (identifier: string) => Promise<{
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
  }>;
};

function createRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  return new Redis({ url, token });
}

function createLimiter(
  tokens: number,
  window: `${number} ${"s" | "m" | "h" | "d"}`,
  prefix: string
): Limiter | null {
  const redis = createRedis();
  if (!redis) return null;

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(tokens, window),
    analytics: true,
    prefix: `ratelimit:${prefix}`,
  }) as unknown as Limiter;
}

// ---------------------------------------------------------------------------
// Named limiters — created lazily on first use
// ---------------------------------------------------------------------------

let forgotPasswordLimiter: Limiter | null | undefined;
let loginLimiter: Limiter | null | undefined;
let resetPasswordLimiter: Limiter | null | undefined;
let resendVerificationLimiter: Limiter | null | undefined;

function getForgotPasswordLimiter(): Limiter | null {
  if (forgotPasswordLimiter === undefined) {
    forgotPasswordLimiter = createLimiter(5, "1 h", "forgot-password");
  }
  return forgotPasswordLimiter;
}

function getLoginLimiter(): Limiter | null {
  if (loginLimiter === undefined) {
    loginLimiter = createLimiter(10, "15 m", "login");
  }
  return loginLimiter;
}

function getResetPasswordLimiter(): Limiter | null {
  if (resetPasswordLimiter === undefined) {
    resetPasswordLimiter = createLimiter(10, "15 m", "reset-password");
  }
  return resetPasswordLimiter;
}

function getResendVerificationLimiter(): Limiter | null {
  if (resendVerificationLimiter === undefined) {
    resendVerificationLimiter = createLimiter(3, "1 h", "resend-verification");
  }
  return resendVerificationLimiter;
}

/**
 * Extract the client IP address from a request.
 * Heroku and most proxies put the real IP in the first entry of
 * x-forwarded-for. Fall back to x-real-ip, then "unknown".
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

/**
 * Check a rate limit. Returns { success, response } — response is set
 * when the request should be rejected with 429.
 */
export async function checkRateLimit(
  limiter: Limiter | null,
  identifier: string,
  message: string
): Promise<{ success: true } | { success: false; response: Response }> {
  // No Upstash configured → fail open (allow the request)
  if (!limiter) {
    return { success: true };
  }

  try {
    const result = await limiter.limit(identifier);

    if (result.success) {
      return { success: true };
    }

    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((result.reset - Date.now()) / 1000)
    );

    return {
      success: false,
      response: new Response(
        JSON.stringify({
          error: message,
          retryAfter: retryAfterSeconds,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfterSeconds),
            "X-RateLimit-Limit": String(result.limit),
            "X-RateLimit-Remaining": String(result.remaining),
            "X-RateLimit-Reset": String(result.reset),
          },
        }
      ),
    };
  } catch (err) {
    // If Upstash is down, don't block the user — log and allow
    console.error("Rate limiter error (failing open):", err);
    return { success: true };
  }
}

// ---------------------------------------------------------------------------
// Public getters
// ---------------------------------------------------------------------------

export const limiter = {
  forgotPassword: getForgotPasswordLimiter,
  login: getLoginLimiter,
  resetPassword: getResetPasswordLimiter,
  resendVerification: getResendVerificationLimiter,
};