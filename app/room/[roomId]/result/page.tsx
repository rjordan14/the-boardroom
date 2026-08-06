import { notFound } from "next/navigation";
import { getRoom } from "@/lib/api/rooms";
import { getProject } from "@/lib/api/projects";
import { getResult } from "@/lib/api/results";
import { Header, BackLink } from "@/components/ui/Header";
import { ResultView } from "@/components/result/ResultView";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const room = await getRoom(roomId);
  const result = room ? await getResult(roomId) : undefined;
  if (!room || !result) notFound();

  const winnerKey = result.winnerKey;
  const loserKey = room.projectA === winnerKey ? room.projectB : room.projectA;
  const [winner, loser] = await Promise.all([getProject(winnerKey), getProject(loserKey)]);
  if (!winner || !loser) notFound();

  return (
    <div data-screen="result">
      <Header
        left={
          <>
            <BackLink href="/" label="ALL ROOMS" />
            <div className="ml-6 font-mono text-[11px] font-bold tracking-[0.1em] text-board-lime">
              ROOM {room.id} · FINAL
            </div>
          </>
        }
        right={
          <span className="font-mono text-[11px] text-board-success">
            ✓ INTEGRITY REVIEW COMPLETE
          </span>
        }
      />
      <ResultView room={room} result={result} winner={winner} loser={loser} />
    </div>
  );
}
