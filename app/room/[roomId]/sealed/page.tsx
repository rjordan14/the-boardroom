import { notFound } from "next/navigation";
import { getRoom } from "@/lib/api/rooms";
import { getProject } from "@/lib/api/projects";
import { Header, BackLink } from "@/components/ui/Header";
import { SealedGate } from "@/components/sealed/SealedGate";

export default async function SealedPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const room = await getRoom(roomId);
  if (!room) notFound();

  const [projectA, projectB] = await Promise.all([
    getProject(room.projectA),
    getProject(room.projectB),
  ]);
  if (!projectA || !projectB) notFound();

  return (
    <div data-screen="sealed">
      <Header
        left={
          <>
            <BackLink href="/" label="ALL ROOMS" />
            <div className="ml-6 font-mono text-[11px] font-bold tracking-[0.1em] text-board-success">
              ROOM {room.id} · BALLOT SEALED
            </div>
          </>
        }
      />
      <SealedGate room={room} projectA={projectA} projectB={projectB} />
    </div>
  );
}
