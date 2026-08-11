import { listRooms } from "@/lib/api/rooms";
import { listProjects } from "@/lib/api/projects";
import { Header, BackLink } from "@/components/ui/Header";
import { MyActivityView } from "@/components/activity/MyActivityView";

// room.status decides whether each entry links to /sealed or /result —
// an admin close-round action can flip that at any time, so this can't
// be frozen at build time (same reasoning as app/page.tsx).
export const dynamic = "force-dynamic";

export default async function MyActivityPage() {
  const [rooms, projectList] = await Promise.all([listRooms(), listProjects()]);
  const projects = Object.fromEntries(projectList.map((p) => [p.key, p]));

  return (
    <div data-screen="my-activity">
      <Header left={<BackLink href="/" label="LOBBY" />} />
      <MyActivityView rooms={rooms} projects={projects} />
    </div>
  );
}
