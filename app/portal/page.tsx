import { getProject } from "@/lib/api/projects";
import { getQaForProject } from "@/lib/api/qa";
import { OverviewTab } from "@/components/portal/OverviewTab";

export default async function PortalOverviewPage() {
  const project = await getProject("A");
  const qa = await getQaForProject("A");
  if (!project) return null;
  return <OverviewTab project={project} unansweredCount={qa.filter((q) => !q.answer).length} />;
}
