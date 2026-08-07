"use client";

import Link from "next/link";
import type { Project, Room } from "@/lib/types";
import { useBoardroomStore } from "@/store/useBoardroomStore";

export function MyActivityView({
  rooms,
  projects,
}: {
  rooms: Room[];
  projects: Record<string, Project>;
}) {
  const ballotChoice = useBoardroomStore((s) => s.ballotChoice);
  const backing = useBoardroomStore((s) => s.backing);

  const rows = rooms
    .map((room) => {
      const choiceKey = ballotChoice[room.id];
      const backingEntry = backing[room.id];
      if (!choiceKey && !backingEntry) return null;
      return { room, choice: choiceKey ? projects[choiceKey] : null, backingEntry };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  return (
    <div className="mx-auto max-w-[820px] px-[clamp(14px,4vw,48px)] py-10">
      <div className="font-mono text-[20px] font-extrabold text-board-heading">MY ACTIVITY</div>
      <div className="mt-2 font-mono text-[12px] leading-[1.7] text-board-secondary">
        Every room you&apos;ve sealed a ballot in or backed, this session.
      </div>

      {rows.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-4 border-2 border-dashed border-[#3D4536] bg-board-card-alt px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center border border-board-border-alt bg-[#0E110C] text-[22px]">
            🗂
          </div>
          <div className="font-mono text-[16px] font-extrabold text-board-heading">
            NO ACTIVITY YET
          </div>
          <div className="max-w-[380px] font-mono text-[12px] leading-[1.7] text-board-secondary">
            Sealed ballots and backing you commit this session show up here.
          </div>
          <Link
            href="/"
            className="mt-2 border-2 border-board-lime bg-[#141A06] px-5 py-2.5 font-mono text-[11px] font-extrabold tracking-[0.1em] text-board-lime transition hover:bg-[#1B2308]"
          >
            ← BACK TO THE LOBBY
          </Link>
        </div>
      ) : (
      <div className="mt-6 border border-board-border-alt bg-board-card-alt">
        {rows.map(({ room, choice, backingEntry }) => (
          <div
            key={room.id}
            className="flex flex-wrap items-center gap-4 border-b border-[#1A1E16] p-4.5 last:border-b-0"
          >
            {choice && <img src={choice.mark} alt="" className="h-9 w-9 flex-none" />}
            <div className="min-w-[160px] flex-1">
              <div className="font-mono text-[12px] font-bold text-board-heading">
                ROOM {room.id} {choice ? `· ${choice.name}` : ""}
              </div>
              <div className="mt-1 font-mono text-[10px] text-board-tertiary">
                {room.roundLabel.toUpperCase()}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {choice && (
                <span className="border border-board-border-voting px-2.5 py-1.5 font-mono text-[9px] font-bold tracking-[0.08em] text-board-success">
                  ✓ SEALED
                </span>
              )}
              {backingEntry && (
                <span className="border border-board-border-amber px-2.5 py-1.5 font-mono text-[9px] font-bold tracking-[0.08em] text-board-amber">
                  {backingEntry.escrowed
                    ? `${backingEntry.amount.toLocaleString()} ESCROWED`
                    : "BACKING SET · NOT ESCROWED"}
                </span>
              )}
            </div>
            <Link
              href={room.status === "open" ? `/room/${room.id}/sealed` : `/room/${room.id}/result`}
              className="ml-auto flex-none font-mono text-[10px] font-bold tracking-[0.08em] text-board-lime transition hover:translate-x-0.5"
            >
              VIEW →
            </Link>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
