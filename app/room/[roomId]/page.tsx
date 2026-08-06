import { notFound, redirect } from "next/navigation";
import { getRoom } from "@/lib/api/rooms";
import { getProject } from "@/lib/api/projects";
import { Header, BackLink } from "@/components/ui/Header";
import { RoomView, RoomHeaderRight } from "@/components/room/RoomView";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const room = await getRoom(roomId);
  if (!room) notFound();
  // Commit-reveal ballots: a closed room has nothing left to watch or
  // vote on — pitch playback and the ballot only make sense while
  // status is "open". Send a direct hit on this URL to the result.
  // ("upcoming" has no result either yet — falls through to notFound()
  // below rather than a redirect that would 404 anyway; no mock room
  // is "upcoming" today, but the distinction matters once one is.)
  if (room.status === "closed") redirect(`/room/${room.id}/result`);
  if (room.status !== "open") notFound();

  const [projectA, projectB] = await Promise.all([
    getProject(room.projectA),
    getProject(room.projectB),
  ]);
  if (!projectA || !projectB) notFound();

  return (
    <div data-screen="room">
      <Header
        left={
          <>
            <BackLink href="/" label="ALL ROOMS" />
            <div className="ml-6 font-mono text-[11px] font-bold tracking-[0.1em] text-board-lime">
              ROOM {room.id} · {room.roundLabel.toUpperCase()}
            </div>
          </>
        }
        right={<RoomHeaderRight room={room} />}
      />
      <RoomView room={room} projectA={projectA} projectB={projectB} />
    </div>
  );
}
