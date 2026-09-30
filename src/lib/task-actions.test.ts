import { describe, it, expect } from "vitest";
import { CreateTaskSchema } from "@/lib/schemas";

describe("CreateTaskSchema", () => {
  const validInput = {
    title: "Write launch announcement",
    description: "Draft a blog post.",
    dueDate: "2026-10-15",
    priority: "HIGH",
    assigneeId: "user-id-123",
  };

  it("accepts a complete valid task", () => {
    const result = CreateTaskSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rejects a missing title", () => {
    const result = CreateTaskSchema.safeParse({
      ...validInput,
      title: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a title longer than 200 characters", () => {
    const result = CreateTaskSchema.safeParse({
      ...validInput,
      title: "a".repeat(201),
    });
    expect(result.success).toBe(false);
  });

  it("rejects a description longer than 2000 characters", () => {
    const result = CreateTaskSchema.safeParse({
      ...validInput,
      description: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });

  it("transforms an empty description to undefined", () => {
    const result = CreateTaskSchema.safeParse({
      ...validInput,
      description: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toBeUndefined();
    }
  });

  it("transforms an empty dueDate to undefined", () => {
    const result = CreateTaskSchema.safeParse({
      ...validInput,
      dueDate: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.dueDate).toBeUndefined();
    }
  });

  it("rejects an invalid due date", () => {
    const result = CreateTaskSchema.safeParse({
      ...validInput,
      dueDate: "not-a-date",
    });
    expect(result.success).toBe(false);
  });

  it("accepts each valid priority", () => {
    for (const priority of ["LOW", "NORMAL", "HIGH"]) {
      const result = CreateTaskSchema.safeParse({
        ...validInput,
        priority,
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects an invalid priority", () => {
    const result = CreateTaskSchema.safeParse({
      ...validInput,
      priority: "URGENT",
    });
    expect(result.success).toBe(false);
  });

  it("transforms an empty assigneeId to undefined", () => {
    const result = CreateTaskSchema.safeParse({
      ...validInput,
      assigneeId: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.assigneeId).toBeUndefined();
    }
  });

  it("transforms the literal 'unassigned' to undefined", () => {
    const result = CreateTaskSchema.safeParse({
      ...validInput,
      assigneeId: "unassigned",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.assigneeId).toBeUndefined();
    }
  });
});