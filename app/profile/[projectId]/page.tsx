import { notFound } from "next/navigation";
import { getProject } from "@/lib/api/projects";
import { getQaForProject } from "@/lib/api/qa";
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
  const qa = await getQaForProject(project.key);

  return (
    <div data-screen="profile">
      <Header left={<BackLink href="/" label="LOBBY" />} />
      <ProjectProfileView project={project} qa={qa} />
    </div>
  );
}
