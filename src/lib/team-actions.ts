"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { uniqueSlug } from "@/lib/slug";
import type { TeamRole } from "@/generated/prisma/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TeamWithMembership = {
  id: string;
  name: string;
  slug: string;
  plan: "FREE" | "PRO";
  role: TeamRole;
  memberCount: number;
};

export type TeamDetail = {
  id: string;
  name: string;
  slug: string;
  plan: "FREE" | "PRO";
  createdAt: Date;
  members: {
    id: string;
    role: TeamRole;
    joinedAt: Date;
    user: {
      id: string;
      name: string | null;
      email: string;
    };
  }[];
  tasks: {
    id: string;
    title: string;
    status: "OPEN" | "IN_PROGRESS" | "DONE";
    priority: "LOW" | "NORMAL" | "HIGH";
    dueDate: Date | null;
    assignee: {
      id: string;
      name: string | null;
      email: string;
    } | null;
  }[];
};

export type TeamActionResult =
  | { success: true; message: string }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

// ---------------------------------------------------------------------------
// Validation schemas
// ---------------------------------------------------------------------------

const CreateTeamSchema = z.object({
  name: z
    .string()
    .min(2, "Team name must be at least 2 characters")
    .max(60, "Team name must be 60 characters or fewer"),
});

// ---------------------------------------------------------------------------
// Get the teams the signed-in user belongs to
// ---------------------------------------------------------------------------

export async function getUserTeams(): Promise<TeamWithMembership[]> {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  const memberships = await db.teamMember.findMany({
    where: { userId: session.user.id },
    orderBy: { joinedAt: "asc" },
    include: {
      team: {
        include: {
          _count: {
            select: { members: true },
          },
        },
      },
    },
  });

  return memberships.map((m) => ({
    id: m.team.id,
    name: m.team.name,
    slug: m.team.slug,
    plan: m.team.plan,
    role: m.role,
    memberCount: m.team._count.members,
  }));
}

// ---------------------------------------------------------------------------
// Get a single team by slug, for the signed-in user only
// ---------------------------------------------------------------------------

export async function getTeamBySlug(
  slug: string
): Promise<TeamDetail | null> {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  // Only return the team if the signed-in user is a member
  const membership = await db.teamMember.findFirst({
    where: {
      userId: session.user.id,
      team: { slug },
    },
    include: {
      team: {
        include: {
          members: {
            include: {
              user: {
                select: { id: true, name: true, email: true },
              },
            },
            orderBy: { joinedAt: "asc" },
          },
          tasks: {
            where: { deletedAt: null },
            orderBy: [{ status: "asc" }, { createdAt: "desc" }],
            include: {
              assignee: {
                select: { id: true, name: true, email: true },
              },
            },
          },
        },
      },
    },
  });

  if (!membership) {
    return null;
  }

  return {
    id: membership.team.id,
    name: membership.team.name,
    slug: membership.team.slug,
    plan: membership.team.plan,
    createdAt: membership.team.createdAt,
    members: membership.team.members.map((m) => ({
      id: m.id,
      role: m.role,
      joinedAt: m.joinedAt,
      user: m.user,
    })),
    tasks: membership.team.tasks.map((t) => ({
      id: t.id,
      title: t.title,
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate,
      assignee: t.assignee,
    })),
  };
}

// ---------------------------------------------------------------------------
// Create a new team
// ---------------------------------------------------------------------------

export async function createTeam(
  _prevState: TeamActionResult | undefined,
  formData: FormData
): Promise<TeamActionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "You must be signed in to create a team.",
    };
  }

  const parsed = CreateTeamSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Please correct the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name } = parsed.data;

  const slug = await uniqueSlug(name, async (candidate) => {
    const found = await db.team.findUnique({ where: { slug: candidate } });
    return found !== null;
  });

  let createdSlug: string;

  try {
    const team = await db.$transaction(async (tx) => {
      const newTeam = await tx.team.create({
        data: { name, slug },
      });

      await tx.teamMember.create({
        data: {
          userId: session.user!.id!,
          teamId: newTeam.id,
          role: "OWNER",
        },
      });

      return newTeam;
    });

    createdSlug = team.slug;
  } catch (error) {
    console.error("Team creation failed:", error);
    return {
      success: false,
      error: "Could not create the team. Please try again.",
    };
  }

  revalidatePath("/app");
  redirect(`/app/teams/${createdSlug}`);
}