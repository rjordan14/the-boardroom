import { getResult as getMockResult, type RoomResult } from "@/lib/mock/results";

export async function getResult(roomId: string): Promise<RoomResult | undefined> {
  return getMockResult(roomId);
}

/** Keyed by roomId, omitting rooms with no result yet — the shape
 *  client components like Bracket need, since they can't call
 *  getResult() themselves (see components/lobby/Bracket.tsx). */
export async function listResults(roomIds: string[]): Promise<Record<string, RoomResult>> {
  const entries = await Promise.all(
    roomIds.map(async (id) => [id, await getMockResult(id)] as const)
  );
  return Object.fromEntries(entries.filter((e): e is [string, RoomResult] => Boolean(e[1])));
}
