import { NextResponse } from "next/server";
import { listRooms } from "@/lib/api/rooms";
import { closeRound, fabricateResult, getCurrentRoundLabel } from "@/lib/tournament/store";
import type { ProjectKey } from "@/lib/types";

/** Admin declares a winner per room; there's no real backend
 *  aggregating ballots across wallets to tally instead (see
 *  lib/tournament/store.ts). Always closes a whole round at once —
 *  every room in a round shares one voting window (lib/mock/rooms.ts),
 *  so there's no such thing as closing just one. Only ever operates on
 *  whichever round is currently live (Quarterfinal, then Semifinal,
 *  then Final) — not every room ever returned by listRooms(), which
 *  would include already-decided earlier rounds once later ones exist. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const winners = body?.winners;
  if (!winners || typeof winners !== "object") {
    return NextResponse.json({ error: "winners is required" }, { status: 400 });
  }

  const roundLabel = getCurrentRoundLabel();
  if (!roundLabel) {
    return NextResponse.json({ error: "the tournament is already complete" }, { status: 400 });
  }

  const rooms = (await listRooms()).filter((r) => r.roundLabel === roundLabel);
  if (rooms.length === 0) {
    return NextResponse.json({ error: "no rooms found for the current round" }, { status: 400 });
  }

  const results = [];
  for (const room of rooms) {
    const winnerKey = winners[room.id] as ProjectKey | undefined;
    if (winnerKey !== room.projectA && winnerKey !== room.projectB) {
      return NextResponse.json(
        { error: `missing or invalid winner for room ${room.id}` },
        { status: 400 }
      );
    }
    const loserKey = winnerKey === room.projectA ? room.projectB : room.projectA;
    results.push(fabricateResult(room.id, winnerKey, loserKey));
  }

  closeRound(roundLabel, results);
  return NextResponse.json({ ok: true, roundLabel, results });
}
