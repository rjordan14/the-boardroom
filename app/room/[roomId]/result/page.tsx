import { notFound } from "next/navigation";
import Link from "next/link";
import { getRoom, listRooms } from "@/lib/api/rooms";
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

  // A room's own voting window can close before its round-mates' do —
  // MatchupRow already keeps that room's result hidden on the Lobby
  // until every room in the round has closed (see its `roundComplete`
  // comment: revealing one room's outcome early could sway votes still
  // in progress elsewhere). This route has no such gate on its own, so
  // without this check, direct navigation here would leak the result
  // through a side door the Lobby was deliberately keeping shut.
  const rooms = await listRooms();
  const roundComplete = rooms.every((r) => r.status !== "open");
  if (!roundComplete) {
    return (
      <div data-screen="result-sealed">
        <Header left={<BackLink href="/" label="ALL ROOMS" />} />
        <div className="mx-auto flex max-w-[520px] flex-col items-center gap-4 px-6 py-28 text-center">
          <div className="font-mono text-[20px] font-extrabold text-board-heading">
            RESULT SEALED
          </div>
          <div className="font-mono text-[13px] leading-[1.8] text-board-secondary">
            Room {room.id}&apos;s voting window closed, but results stay sealed
            per-room until every room in this round has closed — revealing
            one outcome early could sway votes still in progress elsewhere.
          </div>
          <Link
            href="/"
            className="mt-2 border border-board-border px-4 py-2.5 font-mono text-[11px] font-bold tracking-[0.1em] text-board-body transition hover:border-board-lime hover:text-board-lime"
          >
            ← BACK TO THE LOBBY
          </Link>
        </div>
      </div>
    );
  }

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
