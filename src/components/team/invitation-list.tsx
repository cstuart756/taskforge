"use client";

import { useState, useTransition } from "react";
import { revokeInvitation } from "@/lib/team-actions";

type Invitation = {
  id: string;
  email: string;
  role: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
};

type Props = {
  invitations: Invitation[];
};

function formatExpiry(date: Date): string {
  const now = new Date();
  const then = new Date(date);
  const days = Math.ceil(
    (then.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days <= 0) return "Expired";
  if (days === 1) return "Expires in 1 day";
  return `Expires in ${days} days`;
}

export default function InvitationList({ invitations }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const copyLink = async (invitation: Invitation) => {
    const url = `${window.location.origin}/invite/${invitation.token}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(invitation.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("Could not copy link:", error);
    }
  };

  const handleRevoke = (invitationId: string) => {
    const confirmed = window.confirm(
      "Revoke this invitation? The link will stop working."
    );
    if (!confirmed) return;

    startTransition(async () => {
      await revokeInvitation(invitationId);
    });
  };

  if (invitations.length === 0) {
    return (
      <p className="text-sm text-gray-500">No pending invitations.</p>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {invitations.map((invitation) => (
        <li key={invitation.id} className="py-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {invitation.email}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatExpiry(invitation.expiresAt)}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => copyLink(invitation)}
                className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200"
              >
                {copiedId === invitation.id ? "Copied!" : "Copy link"}
              </button>
              <button
                type="button"
                onClick={() => handleRevoke(invitation.id)}
                disabled={isPending}
                className="text-xs text-red-600 hover:text-red-800 px-2 py-1.5 disabled:opacity-50"
              >
                Revoke
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}