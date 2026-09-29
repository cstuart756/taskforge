"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const AddCommentSchema = z.object({
  body: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment must be 2000 characters or fewer"),
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CommentActionResult =
  | { success: true; message: string }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

export type CommentWithAuthor = {
  id: string;
  body: string;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
    email: string;
  };
};

// ---------------------------------------------------------------------------
// Get comments for a task
// ---------------------------------------------------------------------------

export async function getCommentsForTask(
  taskId: string
): Promise<CommentWithAuthor[]> {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  // Verify access: only team members can see comments
  const task = await db.task.findFirst({
    where: {
      id: taskId,
      deletedAt: null,
      team: {
        members: {
          some: { userId: session.user.id },
        },
      },
    },
    select: { id: true },
  });

  if (!task) {
    return [];
  }

  const comments = await db.comment.findMany({
    where: { taskId },
    orderBy: { createdAt: "asc" },
    include: {
      author: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return comments.map((c) => ({
    id: c.id,
    body: c.body,
    createdAt: c.createdAt,
    author: c.author,
  }));
}

// ---------------------------------------------------------------------------
// Add a comment to a task
// ---------------------------------------------------------------------------

export async function addComment(
  taskId: string,
  _prevState: CommentActionResult | undefined,
  formData: FormData
): Promise<CommentActionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in." };
  }

  // Verify access: only team members can add comments
  const task = await db.task.findFirst({
    where: {
      id: taskId,
      deletedAt: null,
      team: {
        members: {
          some: { userId: session.user.id },
        },
      },
    },
    select: { id: true },
  });

  if (!task) {
    return {
      success: false,
      error: "Task not found or you do not have access.",
    };
  }

  const parsed = AddCommentSchema.safeParse({
    body: formData.get("body"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Please correct the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await db.comment.create({
      data: {
        taskId,
        authorId: session.user.id,
        body: parsed.data.body,
      },
    });
  } catch (error) {
    console.error("Comment creation failed:", error);
    return {
      success: false,
      error: "Could not post the comment. Please try again.",
    };
  }

  revalidatePath(`/app/tasks/${taskId}`);

  return {
    success: true,
    message: "Comment posted.",
  };
}