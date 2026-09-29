"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
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