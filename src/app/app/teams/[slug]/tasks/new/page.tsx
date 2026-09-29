import { notFound } from "next/navigation";
import Link from "next/link";
import { getTeamBySlug } from "@/lib/team-actions";
import CreateTaskForm from "@/components/task/create-task-form";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function NewTaskPage({ params }: PageProps) {
  const { slug } = await params;
  const team = await getTeamBySlug(slug);

  if (!team) {
    notFound();
  }

  const members = team.members.map((m) => ({
    id: m.user.id,
    name: m.user.name,
    email: m.user.email,
    role: m.role,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-6">
          <Link
            href={`/app/teams/${team.slug}`}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to {team.name}
          </Link>
        </div>

        <CreateTaskForm teamSlug={team.slug} members={members} />
      </div>
    </div>
  );
}
