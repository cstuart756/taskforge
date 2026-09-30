import { describe, it, expect } from "vitest";
import { RegisterSchema, LoginSchema } from "@/lib/auth-actions";

describe("RegisterSchema", () => {
  it("accepts valid registration input", () => {
    const result = RegisterSchema.safeParse({
      name: "Alice Test",
      email: "alice@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing name", () => {
    const result = RegisterSchema.safeParse({
      email: "alice@example.com",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty name", () => {
    const result = RegisterSchema.safeParse({
      name: "",
      email: "alice@example.com",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a name longer than 80 characters", () => {
    const result = RegisterSchema.safeParse({
      name: "a".repeat(81),
      email: "alice@example.com",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing email", () => {
    const result = RegisterSchema.safeParse({
      name: "Alice",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = RegisterSchema.safeParse({
      name: "Alice",
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing password", () => {
    const result = RegisterSchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = RegisterSchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a password longer than 72 characters", () => {
    const result = RegisterSchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      password: "a".repeat(73),
    });
    expect(result.success).toBe(false);
  });

  it("accepts a password of exactly 8 characters", () => {
    const result = RegisterSchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      password: "12345678",
    });
    expect(result.success).toBe(true);
  });
});

describe("LoginSchema", () => {
  it("accepts valid login input", () => {
    const result = LoginSchema.safeParse({
      email: "alice@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing email", () => {
    const result = LoginSchema.safeParse({
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = LoginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing password", () => {
    const result = LoginSchema.safeParse({
      email: "alice@example.com",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty password", () => {
    const result = LoginSchema.safeParse({
      email: "alice@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});