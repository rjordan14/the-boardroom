import type { Room } from "@/lib/types";

/** Quarterfinal matchups — mirrors the prototype's lobby matchup rows. */
export const ROOMS: Room[] = [
  {
    id: "01",
    roundLabel: "Quarterfinal",
    n: 1,
    projectA: "A",
    projectB: "B",
    status: "open",
    closesAt: "2026-08-08T22:00:00.000Z",
  },
  {
    id: "02",
    roundLabel: "Quarterfinal",
    n: 2,
    projectA: "C",
    projectB: "D",
    status: "closed",
    closesAt: "2026-08-05T22:00:00.000Z",
  },
  {
    id: "03",
    roundLabel: "Quarterfinal",
    n: 3,
    projectA: "E",
    projectB: "F",
    status: "open",
    closesAt: "2026-08-09T22:00:00.000Z",
  },
  {
    id: "04",
    roundLabel: "Quarterfinal",
    n: 4,
    projectA: "G",
    projectB: "H",
    status: "open",
    closesAt: "2026-08-09T22:00:00.000Z",
  },
];

export function getRoom(id: string): Room | undefined {
  return ROOMS.find((r) => r.id === id);
}

export function listRooms(): Room[] {
  return ROOMS;
}
