import type { ProjectKey } from "@/lib/types";

export interface RoomResult {
  roomId: string;
  winnerKey: ProjectKey;
  tallies: Partial<Record<ProjectKey, { pct: number; votes: number }>>;
  totalValid: number;
  quarantinedCount: number;
}

/** Only closed rooms (see lib/mock/rooms.ts) have a result — commit-reveal
 *  ballots mean there's nothing to show until a round closes. Empty for
 *  now: every room in the current (Quarterfinal) round is open, sharing
 *  one schedule — nothing has closed yet to have a result. */
export const RESULTS: RoomResult[] = [];

export function getResult(roomId: string): RoomResult | undefined {
  return RESULTS.find((r) => r.roomId === roomId);
}
