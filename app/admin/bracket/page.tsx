import { listRooms } from "@/lib/api/rooms";
import { listProjects } from "@/lib/api/projects";
import { BracketTab } from "@/components/admin/BracketTab";

export default async function AdminBracketPage() {
  const [rooms, projectList] = await Promise.all([listRooms(), listProjects()]);
  const projects = Object.fromEntries(projectList.map((p) => [p.key, p]));
  return <BracketTab rooms={rooms} projects={projects} />;
}
