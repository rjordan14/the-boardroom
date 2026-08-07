"use client";

import Link from "next/link";
import type { Project, Room } from "@/lib/types";
import { useEligibility } from "@/lib/chain/hooks";
import { useBoardroomStore } from "@/store/useBoardroomStore";
import { SealedView } from "@/components/sealed/SealedView";

/** Ballot choice lives in the client-only Zustand store (see plan:
 *  lifted out of the URL so a shared sealed link doesn't leak which
 *  way someone voted before the round even closes). Landing here
 *  without having cast a ballot in this session — direct link, or a
 *  fresh tab — has nothing to show, so send them back to vote. */
export function SealedGate({
  room,
  projectA,
  projectB,
  rooms,
}: {
  room: Room;
  projectA: Project;
  projectB: Project;
  rooms: Room[];
}) {
  const choice = useBoardroomStore((s) => s.ballotChoice[room.id]);
  const { data: eligibility } = useEligibility();
  const chosenProject: Project | undefined =
    choice === projectA.key ? projectA : choice === projectB.key ? projectB : undefined;

  if (!chosenProject) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="font-mono text-[16px] font-extrabold text-board-heading">
          No sealed ballot found for this room
        </div>
        <div className="max-w-[420px] font-mono text-[12px] leading-[1.7] text-board-secondary">
          This screen only shows a receipt for a ballot sealed this session.
        </div>
        <Link
          href={`/room/${room.id}/compare`}
          className="mt-2 border border-board-border px-4 py-2.5 font-mono text-[11px] font-bold tracking-[0.1em] text-board-body transition hover:border-board-lime hover:text-board-lime"
        >
          ← BACK TO THE MATCHUP
        </Link>
      </div>
    );
  }

  return <SealedView room={room} chosenProject={chosenProject} eligibility={eligibility} rooms={rooms} />;
}
