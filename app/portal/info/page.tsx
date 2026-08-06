import { getProject } from "@/lib/api/projects";
import { InfoTab } from "@/components/portal/InfoTab";

export default async function PortalInfoPage() {
  const project = await getProject("A");
  if (!project) return null;
  return <InfoTab project={project} />;
}
