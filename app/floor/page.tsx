import { listAllComments } from "@/lib/api/comments";
import { listProjects } from "@/lib/api/projects";
import { Header, WalletChip, BackLink } from "@/components/ui/Header";
import { FloorView } from "@/components/floor/FloorView";

export default async function FloorPage() {
  const [comments, projectList] = await Promise.all([listAllComments(), listProjects()]);

  return (
    <div data-screen="floor">
      <Header left={<BackLink href="/" label="LOBBY" />} right={<WalletChip address="0x25…1A50" eligible />} />
      <FloorView comments={comments} projects={projectList} />
    </div>
  );
}
