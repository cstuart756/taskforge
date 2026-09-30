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

export const CreateTeamSchema = z.object({
  name: z
    .string()
    .min(2, "Team name must be at least 2 characters")
    .max(60, "Team name must be 60 characters or fewer"),
});

export const CreateInvitationSchema = z.object({
  email: z.email("Please enter a valid email address"),
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

// ---------------------------------------------------------------------------
// Invitations
// ---------------------------------------------------------------------------

export type PendingInvitation = {
  id: string;
  email: string;
  role: TeamRole;
  token: string;
  expiresAt: Date;
  createdAt: Date;
};

export type InvitationResult =
  | { success: true; message: string }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

// ---------------------------------------------------------------------------
// Create an invitation for a team
// ---------------------------------------------------------------------------

export async function createInvitation(
  teamSlug: string,
  _prevState: InvitationResult | undefined,
  formData: FormData
): Promise<InvitationResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in." };
  }

  const membership = await db.teamMember.findFirst({
    where: {
      userId: session.user.id,
      team: { slug: teamSlug },
      role: { in: ["OWNER", "ADMIN", "SUPERVISOR"] },
    },
    include: { team: true },
  });

  if (!membership) {
    return {
      success: false,
      error: "You do not have permission to invite members to this team.",
    };
  }

  const parsed = CreateInvitationSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Please correct the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const email = parsed.data.email.toLowerCase();

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const alreadyMember = await db.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: existingUser.id,
          teamId: membership.team.id,
        },
      },
    });

    if (alreadyMember) {
      return {
        success: false,
        error: "That user is already a member of this team.",
      };
    }
  }

  const existingInvitation = await db.invitation.findUnique({
    where: {
      email_teamId: {
        email,
        teamId: membership.team.id,
      },
    },
  });

  if (existingInvitation && existingInvitation.status === "PENDING") {
    return {
      success: false,
      error: "There is already a pending invitation for that email.",
    };
  }

  const tokenBytes = new Uint8Array(24);
  crypto.getRandomValues(tokenBytes);
  const token = Array.from(tokenBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  try {
    if (existingInvitation) {
      await db.invitation.update({
        where: { id: existingInvitation.id },
        data: {
          token,
          role: "MEMBER",
          status: "PENDING",
          expiresAt,
          acceptedAt: null,
        },
      });
    } else {
      await db.invitation.create({
        data: {
          email,
          teamId: membership.team.id,
          inviterId: session.user.id,
          role: "MEMBER",
          token,
          status: "PENDING",
          expiresAt,
        },
      });
    }
  } catch (error) {
    console.error("Invitation creation failed:", error);
    return {
      success: false,
      error: "Could not create the invitation. Please try again.",
    };
  }

  revalidatePath(`/app/teams/${teamSlug}`);

  return {
    success: true,
    message: `Invitation created for ${email}.`,
  };
}

// ---------------------------------------------------------------------------
// Get pending invitations for a team
// ---------------------------------------------------------------------------

export async function getPendingInvitations(
  teamId: string
): Promise<PendingInvitation[]> {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  const membership = await db.teamMember.findUnique({
    where: {
      userId_teamId: {
        userId: session.user.id,
        teamId,
      },
    },
  });

  if (!membership) {
    return [];
  }

  const invitations = await db.invitation.findMany({
    where: {
      teamId,
      status: "PENDING",
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      role: true,
      token: true,
      expiresAt: true,
      createdAt: true,
    },
  });

  return invitations;
}

// ---------------------------------------------------------------------------
// Revoke an invitation
// ---------------------------------------------------------------------------

export async function revokeInvitation(invitationId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in.");
  }

  const invitation = await db.invitation.findUnique({
    where: { id: invitationId },
    include: { team: true },
  });

  if (!invitation) {
    throw new Error("Invitation not found.");
  }

  const membership = await db.teamMember.findUnique({
    where: {
      userId_teamId: {
        userId: session.user.id,
        teamId: invitation.teamId,
      },
    },
  });

  if (
    !membership ||
    !["OWNER", "ADMIN", "SUPERVISOR"].includes(membership.role)
  ) {
    throw new Error("You do not have permission to revoke this invitation.");
  }

  await db.invitation.delete({
    where: { id: invitationId },
  });

  revalidatePath(`/app/teams/${invitation.team.slug}`);
}

// ---------------------------------------------------------------------------
// Accept an invitation
// ---------------------------------------------------------------------------

export type AcceptInvitationResult =
  | { success: true; teamSlug: string }
  | { success: false; error: string };

export async function acceptInvitation(
  token: string
): Promise<AcceptInvitationResult> {
  const session = await auth();

  if (!session?.user?.id || !session.user.email) {
    return { success: false, error: "You must be signed in." };
  }

  const invitation = await db.invitation.findUnique({
    where: { token },
    include: { team: true },
  });

  if (!invitation) {
    return { success: false, error: "Invitation not found." };
  }

  if (invitation.status !== "PENDING") {
    return {
      success: false,
      error: "This invitation has already been used or expired.",
    };
  }

  if (invitation.expiresAt < new Date()) {
    await db.invitation.update({
      where: { id: invitation.id },
      data: { status: "EXPIRED" },
    });
    return { success: false, error: "This invitation has expired." };
  }

  if (invitation.email.toLowerCase() !== session.user.email.toLowerCase()) {
    return {
      success: false,
      error: `This invitation is for ${invitation.email}. Please sign in with that account.`,
    };
  }

  const existing = await db.teamMember.findUnique({
    where: {
      userId_teamId: {
        userId: session.user.id,
        teamId: invitation.teamId,
      },
    },
  });

  if (existing) {
    await db.invitation.update({
      where: { id: invitation.id },
      data: { status: "ACCEPTED", acceptedAt: new Date() },
    });
    return { success: true, teamSlug: invitation.team.slug };
  }

  try {
    await db.$transaction(async (tx) => {
      await tx.teamMember.create({
        data: {
          userId: session.user!.id!,
          teamId: invitation.teamId,
          role: invitation.role,
        },
      });

      await tx.invitation.update({
        where: { id: invitation.id },
        data: { status: "ACCEPTED", acceptedAt: new Date() },
      });
    });
  } catch (error) {
    console.error("Failed to accept invitation:", error);
    return {
      success: false,
      error: "Could not accept the invitation. Please try again.",
    };
  }

  return { success: true, teamSlug: invitation.team.slug };
}