"use client";

import { useTransition } from "react";
import { softDeleteTask } from "@/lib/task-actions";

type Props = {
  taskId: string;
  taskTitle: string;
};

export default function DeleteTaskButton({ taskId, taskTitle }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    const confirmed = window.confirm(
      `Delete "${taskTitle}"? This cannot be undone.`
    );

    if (!confirmed) return;

    startTransition(async () => {
      await softDeleteTask(taskId);
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="bg-white text-red-600 border border-red-300 px-4 py-2 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}