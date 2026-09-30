import { z } from "zod";

// ---------------------------------------------------------------------------
// Authentication schemas
// ---------------------------------------------------------------------------

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(80, "Name must be 80 characters or fewer"),
  email: z.email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be 72 characters or fewer"),
});

export const LoginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// ---------------------------------------------------------------------------
// Task schemas
// ---------------------------------------------------------------------------

export const CreateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or fewer"),
  description: z
    .string()
    .max(2000, "Description must be 2000 characters or fewer")
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  dueDate: z
    .string()
    .optional()
    .transform((v) => (v === "" ? undefined : v))
    .refine(
      (v) => v === undefined || !isNaN(Date.parse(v)),
      "Invalid due date"
    ),
  priority: z.enum(["LOW", "NORMAL", "HIGH"]),
  assigneeId: z
    .string()
    .optional()
    .transform((v) => (v === "" || v === "unassigned" ? undefined : v)),
});

export const UpdateTaskSchema = CreateTaskSchema;

// ---------------------------------------------------------------------------
// Team and invitation schemas
// ---------------------------------------------------------------------------

export const CreateTeamSchema = z.object({
  name: z
    .string()
    .min(2, "Team name must be at least 2 characters")
    .max(60, "Team name must be 60 characters or fewer"),
});

export const CreateInvitationSchema = z.object({
  email: z.email("Please enter a valid email address"),
});