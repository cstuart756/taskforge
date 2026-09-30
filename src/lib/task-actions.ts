"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { CreateTaskSchema, UpdateTaskSchema } from "@/lib/schemas";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TaskActionResult =
  | { success: true; message: string }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

export type TaskDetail = {
  id: string;
  title: string;
  description: string | null;
  status: "OPEN" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "NORMAL" | "HIGH";
  dueDate: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  team: {
    id: string;
    name: string;
    slug: string;
  };
  creator: {
    id: string;
    name: string | null;
    email: string;
  };
  assignee: {
    id: string;
    name: string | null;
    email: string;
  } | null;
};

export type TaskListItem = {
  id: string;
  title: string;
  status: "OPEN" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "NORMAL" | "HIGH";
  dueDate: Date | null;
  team: {
    id: string;
    name: string;
    slug: string;
  };
  assignee: {
    id: string;
    name: string | null;
    email: string;
  } | null;
};

export type TaskMetrics = {
  open: number;
  inProgress: number;
  done: number;
  overdue: number;
  total: number;
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

// ---------------------------------------------------------------------------
// Get a single task by ID (only if the user is a member of its team)
// ---------------------------------------------------------------------------

export async function getTaskById(
  taskId: string
): Promise<TaskDetail | null> {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

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
    include: {
      team: {
        select: { id: true, name: true, slug: true },
      },
      creator: {
        select: { id: true, name: true, email: true },
      },
      assignee: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!task) {
    return null;
  }

  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    completedAt: task.completedAt,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    team: task.team,
    creator: task.creator,
    assignee: task.assignee,
  };
}

// ---------------------------------------------------------------------------
// Toggle a task's status between OPEN and DONE
// ---------------------------------------------------------------------------

export async function toggleTaskStatus(taskId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in.");
  }

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
    select: { id: true, status: true, teamId: true },
  });

  if (!task) {
    throw new Error("Task not found or you do not have access.");
  }

  const isDone = task.status === "DONE";

  await db.task.update({
    where: { id: taskId },
    data: {
      status: isDone ? "OPEN" : "DONE",
      completedAt: isDone ? null : new Date(),
    },
  });

  revalidatePath("/app");
  revalidatePath(`/app/tasks/${taskId}`);
}

// ---------------------------------------------------------------------------
// Update a task
// ---------------------------------------------------------------------------

export async function updateTask(
  taskId: string,
  _prevState: TaskActionResult | undefined,
  formData: FormData
): Promise<TaskActionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in." };
  }

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
    include: { team: true },
  });

  if (!task) {
    return {
      success: false,
      error: "Task not found or you do not have access.",
    };
  }

  const parsed = UpdateTaskSchema.safeParse({
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

  if (assigneeId) {
    const assigneeIsMember = await db.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: assigneeId,
          teamId: task.teamId,
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
    await db.task.update({
      where: { id: taskId },
      data: {
        title,
        description: description ?? null,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority,
        assigneeId: assigneeId ?? null,
      },
    });
  } catch (error) {
    console.error("Task update failed:", error);
    return {
      success: false,
      error: "Could not update the task. Please try again.",
    };
  }

  revalidatePath("/app");
  revalidatePath(`/app/tasks/${taskId}`);
  revalidatePath(`/app/teams/${task.team.slug}`);

  redirect(`/app/tasks/${taskId}`);
}

// ---------------------------------------------------------------------------
// Soft-delete a task
// ---------------------------------------------------------------------------

export async function softDeleteTask(taskId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in.");
  }

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
    include: { team: true },
  });

  if (!task) {
    throw new Error("Task not found or you do not have access.");
  }

  await db.task.update({
    where: { id: taskId },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/app");
  revalidatePath(`/app/teams/${task.team.slug}`);

  redirect(`/app/teams/${task.team.slug}`);
}

// ---------------------------------------------------------------------------
// Get all tasks across every team the user belongs to
// ---------------------------------------------------------------------------

export async function getAllTasksForUser(
  statusFilter?: "OPEN" | "IN_PROGRESS" | "DONE"
): Promise<TaskListItem[]> {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  const tasks = await db.task.findMany({
    where: {
      deletedAt: null,
      status: statusFilter,
      team: {
        members: {
          some: { userId: session.user.id },
        },
      },
    },
    orderBy: [
      { dueDate: { sort: "asc", nulls: "last" } },
      { createdAt: "desc" },
    ],
    include: {
      team: {
        select: { id: true, name: true, slug: true },
      },
      assignee: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return tasks.map((t) => ({
    id: t.id,
    title: t.title,
    status: t.status,
    priority: t.priority,
    dueDate: t.dueDate,
    team: t.team,
    assignee: t.assignee,
  }));
}

// ---------------------------------------------------------------------------
// Task metrics for the dashboard
// ---------------------------------------------------------------------------

export async function getTaskMetrics(): Promise<TaskMetrics> {
  const session = await auth();

  if (!session?.user?.id) {
    return { open: 0, inProgress: 0, done: 0, overdue: 0, total: 0 };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [open, inProgress, done, overdue, total] = await Promise.all([
    db.task.count({
      where: {
        deletedAt: null,
        status: "OPEN",
        team: {
          members: { some: { userId: session.user.id } },
        },
      },
    }),
    db.task.count({
      where: {
        deletedAt: null,
        status: "IN_PROGRESS",
        team: {
          members: { some: { userId: session.user.id } },
        },
      },
    }),
    db.task.count({
      where: {
        deletedAt: null,
        status: "DONE",
        team: {
          members: { some: { userId: session.user.id } },
        },
      },
    }),
    db.task.count({
      where: {
        deletedAt: null,
        status: { not: "DONE" },
        dueDate: { lt: today },
        team: {
          members: { some: { userId: session.user.id } },
        },
      },
    }),
    db.task.count({
      where: {
        deletedAt: null,
        team: {
          members: { some: { userId: session.user.id } },
        },
      },
    }),
  ]);

  return { open, inProgress, done, overdue, total };
}