import { listRooms } from "@/lib/api/rooms";
import { listProjects } from "@/lib/api/projects";
import { listResults } from "@/lib/api/results";
import { getCurrentRoundLabel } from "@/lib/api/tournament";
import { BracketTab } from "@/components/admin/BracketTab";

// Reads live round-close state (lib/tournament/store.ts) that an admin
// action can change at any time — must not be frozen at build time.
export const dynamic = "force-dynamic";

export default async function AdminBracketPage() {
  const [rooms, projectList, currentRoundLabel] = await Promise.all([
    listRooms(),
    listProjects(),
    getCurrentRoundLabel(),
  ]);
  const results = await listResults(rooms.map((r) => r.id));
  const projects = Object.fromEntries(projectList.map((p) => [p.key, p]));
  return (
    <BracketTab rooms={rooms} projects={projects} results={results} currentRoundLabel={currentRoundLabel} />
  );
}
