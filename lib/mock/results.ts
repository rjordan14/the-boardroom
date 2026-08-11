import type { ProjectKey } from "@/lib/types";
import { getPublishedResult } from "@/lib/tournament/store";

export interface RoomResult {
  roomId: string;
  winnerKey: ProjectKey;
  tallies: Partial<Record<ProjectKey, { pct: number; votes: number }>>;
  totalValid: number;
  quarantinedCount: number;
}

/** Only closed rooms (see lib/mock/rooms.ts) have a result — commit-reveal
 *  ballots mean there's nothing to show until a round closes. Static and
 *  empty: results only exist once an admin closes the round (see
 *  lib/tournament/store.ts), which publishes into that store, not here. */
export const RESULTS: RoomResult[] = [];

export function getResult(roomId: string): RoomResult | undefined {
  return getPublishedResult(roomId) ?? RESULTS.find((r) => r.roomId === roomId);
}
