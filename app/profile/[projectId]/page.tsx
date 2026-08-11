import { notFound } from "next/navigation";
import { getProject } from "@/lib/api/projects";
import { getQaForProject } from "@/lib/api/qa";
import { getCommentsForProject } from "@/lib/api/comments";
import { listRooms } from "@/lib/api/rooms";
import { Header, BackLink } from "@/components/ui/Header";
import { ProjectProfileView } from "@/components/profile/ProjectProfileView";

export default async function ProjectProfilePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProject(projectId);
  if (!project) notFound();
  const [qa, comments, rooms] = await Promise.all([
    getQaForProject(project.key),
    getCommentsForProject(project.key),
    listRooms(),
  ]);
  // A project that keeps winning appears in more than one room over the
  // season (Quarterfinal, then Semifinal, then Final) — prefer whichever
  // one is still open, falling back to the most recent (listRooms()
  // returns them in round order, so the last match is the furthest
  // they've gotten), rather than always the very first (earliest,
  // possibly long-closed) room they were ever in.
  const projectRooms = rooms.filter((r) => r.projectA === project.key || r.projectB === project.key);
  const room = projectRooms.find((r) => r.status === "open") ?? projectRooms[projectRooms.length - 1];

  return (
    <div data-screen="profile">
      <Header left={<BackLink href="/" label="LOBBY" />} />
      <ProjectProfileView project={project} qa={qa} comments={comments} roomId={room?.id} />
    </div>
  );
}
