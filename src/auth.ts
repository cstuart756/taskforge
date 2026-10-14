import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { authConfig } from "@/auth.config";
import { verifyPassword } from "@/lib/password";
import { checkRateLimit, limiter } from "@/lib/rate-limit";

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
    Credentials({
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

        // Rate limit login attempts by email.
        // NextAuth's authorize callback doesn't expose the request,
        // so we key on email rather than IP.
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

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
});