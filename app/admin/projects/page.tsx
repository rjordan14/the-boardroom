import { listProjects } from "@/lib/api/projects";
import { listAdminProjectMeta } from "@/lib/api/adminRoster";
import { ProjectsTab } from "@/components/admin/ProjectsTab";

export default async function AdminProjectsPage() {
  const [projectList, metaList] = await Promise.all([listProjects(), listAdminProjectMeta()]);
  const projects = Object.fromEntries(projectList.map((p) => [p.key, p]));
  const meta = Object.fromEntries(metaList.map((m) => [m.key, m]));
  return <ProjectsTab projects={projects} meta={meta} />;
}
