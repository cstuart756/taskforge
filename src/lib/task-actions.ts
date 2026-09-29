"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

// ---------------------------------------------------------------------------
// Validation schemas
// ---------------------------------------------------------------------------

const CreateTaskSchema = z.object({
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

export type TaskActionResult =
  | { success: true; message: string }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

// ---------------------------------------------------------------------------
// Create a task in a team
// ---------------------------------------------------------------------------

export async function createTask(
  teamSlug: string,
  _prevState: TaskActionResult | undefined,
  formData: FormData
): Promise<TaskActionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in." };
  }

  // Verify the user is a member of this team
  const membership = await db.teamMember.findFirst({
    where: {
      userId: session.user.id,
      team: { slug: teamSlug },
    },
    include: { team: true },
  });

  if (!membership) {
    return {
      success: false,
      error: "You do not have access to this team.",
    };
  }

  const parsed = CreateTaskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    dueDate: formData.get("dueDate"),
    priority: formData.get("priority") || "NORMAL",
    assigneeId: formData.get("assigneeId"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Please correct the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { title, description, dueDate, priority, assigneeId } = parsed.data;

  // If an assignee was selected, verify they are a member of the team
  if (assigneeId) {
    const assigneeIsMember = await db.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: assigneeId,
          teamId: membership.team.id,
        },
      },
    });

    if (!assigneeIsMember) {
      return {
        success: false,
        error: "The selected assignee is not a member of this team.",
      };
    }
  }

  try {
    await db.task.create({
      data: {
        title,
        description: description ?? null,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority,
        status: "OPEN",
        teamId: membership.team.id,
        creatorId: session.user.id,
        assigneeId: assigneeId ?? null,
      },
    });
  } catch (error) {
    console.error("Task creation failed:", error);
    return {
      success: false,
      error: "Could not create the task. Please try again.",
    };
  }

  redirect(`/app/teams/${teamSlug}`);
}