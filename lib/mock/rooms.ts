import type { Room, ProjectKey, RoomStatus } from "@/lib/types";

interface RoomSeed {
  id: string;
  roundLabel: string;
  n: number;
  projectA: ProjectKey;
  projectB: ProjectKey;
  status: RoomStatus;
  /** Hours from "now" this room's voting closes — negative for a room
   *  that already closed. Computed relative to request time (not a
   *  fixed date) so the demo never drifts into showing a "closed" room
   *  as still open, or an open room's countdown at 0d 00:00:00 — a
   *  fixed date only stays plausible until whenever it was written,
   *  which breaks the moment a session runs longer than that or the
   *  demo gets revisited later. */
  closesInHours: number;
}

const ROOM_SEEDS: RoomSeed[] = [
  { id: "01", roundLabel: "Quarterfinal", n: 1, projectA: "A", projectB: "B", status: "open", closesInHours: 44 },
  { id: "02", roundLabel: "Quarterfinal", n: 2, projectA: "C", projectB: "D", status: "closed", closesInHours: -68 },
  { id: "03", roundLabel: "Quarterfinal", n: 3, projectA: "E", projectB: "F", status: "open", closesInHours: 68 },
  { id: "04", roundLabel: "Quarterfinal", n: 4, projectA: "G", projectB: "H", status: "open", closesInHours: 68 },
];

function toRoom(seed: RoomSeed): Room {
  return {
    id: seed.id,
    roundLabel: seed.roundLabel,
    n: seed.n,
    projectA: seed.projectA,
    projectB: seed.projectB,
    status: seed.status,
    closesAt: new Date(Date.now() + seed.closesInHours * 3_600_000).toISOString(),
  };
}

export function getRoom(id: string): Room | undefined {
  const seed = ROOM_SEEDS.find((r) => r.id === id);
  return seed ? toRoom(seed) : undefined;
}

export function listRooms(): Room[] {
  return ROOM_SEEDS.map(toRoom);
}
