import { listAllQa } from "@/lib/api/qa";
import { listProjects } from "@/lib/api/projects";
import { QaModerationTab } from "@/components/admin/QaModerationTab";

export default async function AdminQaPage() {
  const [qa, projectList] = await Promise.all([listAllQa(), listProjects()]);
  const projects = Object.fromEntries(projectList.map((p) => [p.key, p]));
  return <QaModerationTab qa={qa} projects={projects} />;
}
