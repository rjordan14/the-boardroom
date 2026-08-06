import { notFound, redirect } from "next/navigation";
import { getRoom } from "@/lib/api/rooms";
import { getProject } from "@/lib/api/projects";
import { getQaForProject } from "@/lib/api/qa";
import { Header, BackLink } from "@/components/ui/Header";
import { CompareView } from "@/components/compare/CompareView";

export default async function ComparePage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const room = await getRoom(roomId);
  if (!room) notFound();
  if (room.status === "closed") redirect(`/room/${room.id}/result`);
  if (room.status !== "open") notFound();

  const [projectA, projectB] = await Promise.all([
    getProject(room.projectA),
    getProject(room.projectB),
  ]);
  if (!projectA || !projectB) notFound();

  const [qaA, qaB] = await Promise.all([
    getQaForProject(projectA.key),
    getQaForProject(projectB.key),
  ]);

  return (
    <div data-screen="compare">
      <Header
        left={
          <>
            <BackLink href="/" label="ALL ROOMS" />
            <div className="ml-6 font-mono text-[11px] font-bold tracking-[0.1em] text-board-lime">
              ROOM {room.id} · {room.roundLabel.toUpperCase()}
            </div>
          </>
        }
      />
      <CompareView
        room={room}
        projectA={projectA}
        projectB={projectB}
        qaByProject={{ [projectA.key]: qaA, [projectB.key]: qaB }}
      />
    </div>
  );
}
