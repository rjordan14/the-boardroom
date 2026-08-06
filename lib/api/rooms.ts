import { getRoom as getMockRoom, listRooms as listMockRooms } from "@/lib/mock/rooms";
import type { Room } from "@/lib/types";

export async function getRoom(id: string): Promise<Room | undefined> {
  return getMockRoom(id);
}

export async function listRooms(): Promise<Room[]> {
  return listMockRooms();
}
