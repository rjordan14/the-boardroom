import type { ProjectKey } from "@/lib/types";

export interface RoomResult {
  roomId: string;
  winnerKey: ProjectKey;
  tallies: Partial<Record<ProjectKey, { pct: number; votes: number }>>;
  totalValid: number;
  quarantinedCount: number;
}

/** Only closed rooms (see lib/mock/rooms.ts) have a result — commit-reveal
 *  ballots mean there's nothing to show until a round closes. */
export const RESULTS: RoomResult[] = [
  {
    roomId: "02",
    winnerKey: "D",
    tallies: {
      C: { pct: 41.7, votes: 1003 },
      D: { pct: 58.3, votes: 1402 },
    },
    totalValid: 2405,
    quarantinedCount: 88,
  },
];

export function getResult(roomId: string): RoomResult | undefined {
  return RESULTS.find((r) => r.roomId === roomId);
}
