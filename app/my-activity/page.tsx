import { listRooms } from "@/lib/api/rooms";
import { listProjects } from "@/lib/api/projects";
import { Header, BackLink } from "@/components/ui/Header";
import { MyActivityView } from "@/components/activity/MyActivityView";

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
