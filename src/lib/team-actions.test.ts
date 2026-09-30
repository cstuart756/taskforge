import { describe, it, expect } from "vitest";
import {
  CreateTeamSchema,
  CreateInvitationSchema,
} from "@/lib/team-actions";

describe("CreateTeamSchema", () => {
  it("accepts a valid team name", () => {
    const result = CreateTeamSchema.safeParse({ name: "Marketing Team" });
    expect(result.success).toBe(true);
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = CreateTeamSchema.safeParse({ name: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects a name longer than 60 characters", () => {
    const result = CreateTeamSchema.safeParse({ name: "a".repeat(61) });
    expect(result.success).toBe(false);
  });

  it("accepts a name of exactly 2 characters", () => {
    const result = CreateTeamSchema.safeParse({ name: "AB" });
    expect(result.success).toBe(true);
  });

  it("accepts a name of exactly 60 characters", () => {
    const result = CreateTeamSchema.safeParse({ name: "a".repeat(60) });
    expect(result.success).toBe(true);
  });
});

describe("CreateInvitationSchema", () => {
  it("accepts a valid email", () => {
    const result = CreateInvitationSchema.safeParse({
      email: "invitee@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = CreateInvitationSchema.safeParse({
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing email", () => {
    const result = CreateInvitationSchema.safeParse({ email: "" });
    expect(result.success).toBe(false);
  });
});