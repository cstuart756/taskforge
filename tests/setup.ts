import { vi } from "vitest";

// Mock Next.js server imports that next-auth pulls in transitively.
// We only need the Zod schemas for our tests, not the full auth runtime.
vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn(),
    redirect: vi.fn(),
    next: vi.fn(),
  },
  NextRequest: vi.fn(),
}));

vi.mock("next-auth", () => ({
  default: vi.fn(),
}));

vi.mock("next-auth/providers/credentials", () => ({
  default: vi.fn(),
}));

vi.mock("@auth/prisma-adapter", () => ({
  PrismaAdapter: vi.fn(),
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

vi.mock("@/auth", () => ({
  auth: vi.fn(),
  handlers: {},
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: {},
}));

vi.mock("@/generated/prisma/client", () => ({}));