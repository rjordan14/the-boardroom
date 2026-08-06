import { getResult as getMockResult, type RoomResult } from "@/lib/mock/results";

export async function getResult(roomId: string): Promise<RoomResult | undefined> {
  return getMockResult(roomId);
}
