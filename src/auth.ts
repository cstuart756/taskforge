import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { authConfig } from "@/auth.config";
import { verifyPassword } from "@/lib/password";
import { checkRateLimit, limiter } from "@/lib/rate-limit";
import { verifyTOTP, findMatchingBackupCode } from "@/lib/two-factor";
import { getPending2FA, deletePending2FA } from "@/lib/two-factor-session";

export const {
  handlers,
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  providers: [
    // -----------------------------------------------------------------
    // Primary credentials — email + password
    // -----------------------------------------------------------------
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).toLowerCase();
        const password = String(credentials.password);

        const rateCheck = await checkRateLimit(
          limiter.login(),
          `login:${email}`,
          "Too many login attempts. Please try again later."
        );

        if (!rateCheck.success) {
          throw new Error(
            "Too many login attempts. Please try again later."
          );
        }

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = await verifyPassword(password, user.passwordHash);

        if (!isValid) {
          return null;
        }

        // If 2FA is enabled, DO NOT issue a session from this provider.
        // The caller must complete the two-step flow via /login/2fa.
        // This prevents anyone from bypassing 2FA by POSTing directly
        // to /api/auth/callback/credentials.
        if (user.twoFactorEnabled) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),

    // -----------------------------------------------------------------
    // Two-factor challenge — pending token + TOTP code or backup code
    // -----------------------------------------------------------------
    Credentials({
      id: "credentials-2fa",
      name: "Credentials 2FA",
      credentials: {
        pendingToken: { label: "Pending Token", type: "text" },
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.pendingToken || !credentials?.code) {
          return null;
        }

        const pendingToken = String(credentials.pendingToken);
        const code = String(credentials.code).trim();

        // Look up + consume the pending token (single-use).
        // We delete it BEFORE verifying the code so that even an
        // invalid attempt burns the token — no brute force possible.
        const userId = await getPending2FA(pendingToken);
        if (!userId) {
          return null;
        }
        await deletePending2FA(pendingToken);

        const user = await db.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            twoFactorEnabled: true,
            twoFactorSecret: true,
            twoFactorBackupCodes: true,
          },
        });

        if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
          return null;
        }

        // Try TOTP first
        const totpOk = await verifyTOTP(code, user.twoFactorSecret);
        if (totpOk) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        }

        // Fall back to backup codes
        const matchedHash = findMatchingBackupCode(
          code,
          user.twoFactorBackupCodes
        );
        if (matchedHash) {
          // Remove the used code — each backup code is single-use
          await db.user.update({
            where: { id: user.id },
            data: {
              twoFactorBackupCodes: {
                set: user.twoFactorBackupCodes.filter(
                  (h) => h !== matchedHash
                ),
              },
            },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        }

        return null;
      },
    }),
  ],
});