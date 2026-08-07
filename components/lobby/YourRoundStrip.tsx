"use client";

import type { Room } from "@/lib/types";
import { getRoomProgress, useBoardroomStore } from "@/store/useBoardroomStore";

/** "YOUR ROUND" summary strip — seen in the design prototype/demo but
 *  dropped during the build. Unlike the prototype's static mock text
 *  ("2 of 4 rooms voted · 1 in progress"), this reads real per-wallet
 *  state, the same source MatchupRow uses. */
export function YourRoundStrip({ rooms }: { rooms: Room[] }) {
  const ballotChoice = useBoardroomStore((s) => s.ballotChoice);
  const watchProgress = useBoardroomStore((s) => s.watchProgress);

  const segments = rooms.map((room) => {
    if (ballotChoice[room.id]) return "voted" as const;
    const progress = getRoomProgress(watchProgress, room.id);
    if (progress.pA > 0 || progress.pB > 0) return "in_progress" as const;
    return "not_started" as const;
  });

  const votedCount = segments.filter((s) => s === "voted").length;
  const inProgressCount = segments.filter((s) => s === "in_progress").length;

  return (
    <div className="flex flex-wrap items-center gap-5 border border-board-border bg-board-card-alt px-5 py-3.5">
      <span className="font-mono text-[10px] font-extrabold tracking-[0.16em] text-board-lime">
        YOUR ROUND
      </span>
      <div className="flex gap-1.5">
        {segments.map((state, i) => (
          <div key={i} className="h-1.5 w-[34px] overflow-hidden bg-[#2E3726]">
            {state === "voted" && <div className="h-full w-full bg-board-lime" />}
            {state === "in_progress" && (
              <div
                className="h-full bg-board-lime"
                style={{ animation: "board-seg-fill 3.2s ease-in-out infinite" }}
              />
            )}
          </div>
        ))}
      </div>
      <span className="font-mono text-[11px] text-board-secondary">
        {votedCount} of {rooms.length} rooms voted
        {inProgressCount > 0 ? ` · ${inProgressCount} in progress` : ""}
      </span>
      <span className="ml-auto font-mono text-[10px] tracking-[0.1em] text-board-tertiary">
        VOTE IN EVERY ROOM TO COMPLETE THE ROUND
      </span>
    </div>
  );
}
