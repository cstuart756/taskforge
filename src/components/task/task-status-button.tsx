"use client";

import { useTransition } from "react";
import { toggleTaskStatus } from "@/lib/task-actions";

type Props = {
  taskId: string;
  status: "OPEN" | "IN_PROGRESS" | "DONE";
};

export default function TaskStatusButton({ taskId, status }: Props) {
  const [isPending, startTransition] = useTransition();

  const isDone = status === "DONE";

  const handleClick = () => {
    startTransition(async () => {
      await toggleTaskStatus(taskId);
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={
        isDone
          ? "bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          : "bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      }
    >
      {isPending ? "Updating..." : isDone ? "Reopen task" : "Mark complete"}
    </button>
  );
}