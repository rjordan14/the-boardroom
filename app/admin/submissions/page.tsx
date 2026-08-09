import { listSubmissions } from "@/lib/api/submissions";
import { listProjects } from "@/lib/api/projects";
import { SubmissionsTab } from "@/components/admin/SubmissionsTab";

// listSubmissions() now reads live in-memory upload state (see
// lib/video/store.ts), not just static mock data — without this, Next
// would prerender the page once at build time (before any real upload
// could exist) and freeze it there, so a founder's real submission
// would never actually show up here after deploy.
export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage() {
  const [submissions, projectList] = await Promise.all([listSubmissions(), listProjects()]);
  const projects = Object.fromEntries(projectList.map((p) => [p.key, p]));
  return <SubmissionsTab submissions={submissions} projects={projects} />;
}
