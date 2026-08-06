import { listSubmissions } from "@/lib/api/submissions";
import { listProjects } from "@/lib/api/projects";
import { SubmissionsTab } from "@/components/admin/SubmissionsTab";

export default async function AdminSubmissionsPage() {
  const [submissions, projectList] = await Promise.all([listSubmissions(), listProjects()]);
  const projects = Object.fromEntries(projectList.map((p) => [p.key, p]));
  return <SubmissionsTab submissions={submissions} projects={projects} />;
}
