"use client";

import { useState, type Ref } from "react";
import Link from "next/link";
import type { Project, Room } from "@/lib/types";
import type { RoomResult } from "@/lib/mock/results";
import { EliminatedIcon, EliminatedLabel, useInViewOnce } from "./EliminationFall";

/**
 * Seed numbers are decorative bracket-position labels, not derived from
 * any real ranking data our types track — matches the design handoff's
 * own bracket, which hardcodes them the same way.
 */
const LEFT_SEEDS: [number, number][] = [
  [1, 8],
  [4, 5],
];
const RIGHT_SEEDS: [number, number][] = [
  [2, 7],
  [3, 6],
];

export function Bracket({
  rooms,
  projects,
  results,
}: {
  rooms: Room[];
  projects: Record<string, Project>;
  // Passed down from the server (app/page.tsx via lib/api/results.ts)
  // rather than read here — this is a client component, and importing
  // lib/mock/results.ts's getResult() directly would bundle a
  // build-time-frozen copy into the browser, never seeing an admin's
  // later round-close (see lib/tournament/store.ts).
  results: Record<string, RoomResult>;
}) {
  const left = rooms.slice(0, 2);
  const right = rooms.slice(2, 4);

  return (
    <div>
      <div className="mb-5 font-mono text-[clamp(19px,2.8vw,26px)] font-extrabold leading-[1.05] tracking-[0.02em] text-board-heading">
        THE ROAD TO LAUNCH
      </div>

      {/* Desktop: full 5-column bracket with connectors */}
      <div className="hidden lg:block">
        <div className="mb-3.5 grid grid-cols-5 font-mono text-[10px] tracking-[0.2em]">
          <div className="text-board-lime">QUARTERFINAL · LIVE</div>
          <div className="text-board-tertiary">SEMIFINAL · TBD</div>
          <div className="text-center text-board-heading">FINAL · TBD</div>
          <div className="text-right text-board-tertiary">SEMIFINAL · TBD</div>
          <div className="text-right text-board-lime">QUARTERFINAL · LIVE</div>
        </div>

        <div
          className="grid items-stretch"
          style={{ gridTemplateColumns: "1fr 0.78fr 1.05fr 0.78fr 1fr" }}
        >
          <div className="flex flex-col justify-around gap-5">
            {left.map((room, i) => (
              <QFColumn key={room.id} room={room} projects={projects} results={results} seeds={LEFT_SEEDS[i]} />
            ))}
          </div>

          <div className="flex flex-col justify-around gap-9 px-2.5">
            {left.map((room) => (
              <SFPlaceholder
                key={room.id}
                roomId={room.id}
                winner={winnerFor(room, projects, results)}
              />
            ))}
          </div>

          <FinalPanel />

          <div className="flex flex-col justify-around gap-9 px-2.5">
            {right.map((room) => (
              <SFPlaceholder
                key={room.id}
                roomId={room.id}
                winner={winnerFor(room, projects, results)}
                reverse
              />
            ))}
          </div>

          <div className="flex flex-col justify-around gap-5">
            {right.map((room, i) => (
              <QFColumn key={room.id} room={room} projects={projects} results={results} seeds={RIGHT_SEEDS[i]} reverse />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile / tablet: bracket lines and multi-column layout don't
          collapse into a sane single-column order, so this is a
          simplified stacked view rather than a squeezed 5-column grid. */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3 lg:hidden">
        {rooms.map((room) => {
          const a = projects[room.projectA];
          const b = projects[room.projectB];
          const result = results[room.id];
          const loserKey = result ? (result.winnerKey === a.key ? b.key : a.key) : null;
          return (
            <div key={room.id} className="border border-board-border-alt bg-board-card-alt">
              <div className="border-b border-board-border-alt px-3 py-2 font-mono text-[9px] font-bold tracking-[0.16em] text-board-tertiary">
                QF{room.id}
              </div>
              <div className="flex flex-col gap-1 p-2">
                {[a, b].map((p) => (
                  <MobileQFEntry key={p.key} project={p} eliminated={p.key === loserKey} />
                ))}
              </div>
            </div>
          );
        })}
        <div className="border border-dashed border-[#6E8050] bg-board-card-alt px-3.5 py-3.5 font-mono text-[11px] font-bold tracking-[0.08em] text-board-body">
          SEMIFINAL · SET AFTER QUARTERFINAL RESULTS
        </div>
        <div className="border-2 border-dashed border-board-lime bg-[#111607] px-4 py-4 text-center">
          <div className="mx-auto mb-1.5 w-fit animate-[board-floaty_2.6s_ease-in-out_infinite] text-[26px] leading-none">
            🏆
          </div>
          <div className="font-mono text-[13px] font-extrabold tracking-[0.14em] text-board-lime">
            THE FEATURED LAUNCH
          </div>
          <div className="mt-3 font-mono text-[10px] leading-[1.8] text-board-secondary-alt">
            Automatic V3 liquidity · fee split · staking vault · featured token launch
          </div>
        </div>
      </div>
    </div>
  );
}

function QFColumn({
  room,
  projects,
  results,
  seeds,
  reverse,
}: {
  room: Room;
  projects: Record<string, Project>;
  results: Record<string, RoomResult>;
  seeds: [number, number];
  reverse?: boolean;
}) {
  const a = projects[room.projectA];
  const b = projects[room.projectB];
  const result = results[room.id];
  const loserKey = result ? (result.winnerKey === a.key ? b.key : a.key) : null;
  return (
    <div className={`flex items-center ${reverse ? "flex-row-reverse" : ""}`}>
      <div className="flex flex-1 flex-col gap-1.5">
        <QFEntry project={a} seed={seeds[0]} reverse={reverse} eliminated={a.key === loserKey} />
        <QFEntry project={b} seed={seeds[1]} reverse={reverse} eliminated={b.key === loserKey} />
      </div>
      <div
        className="my-5 w-[22px] self-stretch border border-board-border"
        style={reverse ? { borderRight: "none" } : { borderLeft: "none" }}
      />
      <div className="h-px w-4 bg-board-border" />
    </div>
  );
}

function QFEntry({
  project,
  seed,
  reverse,
  eliminated,
}: {
  project: Project;
  seed: number;
  reverse?: boolean;
  eliminated?: boolean;
}) {
  const { ref, inView } = useInViewOnce<HTMLElement>();
  const [replayKey, setReplayKey] = useState(0);
  const className = `flex items-center gap-2.5 border px-3 py-2.5 transition ${
    eliminated ? "border-[#2A241E] bg-[#0E0C09] hover:bg-[#161310]" : "border-board-border bg-board-card-alt hover:bg-[#151A11]"
  } ${reverse ? "flex-row-reverse text-right" : ""}`;
  const style = eliminated
    ? reverse
      ? { borderRight: "3px solid #5C3A2E" }
      : { borderLeft: "3px solid #5C3A2E" }
    : reverse
      ? { borderRight: "3px solid #CCFF00" }
      : { borderLeft: "3px solid #CCFF00" };
  const content = (
    <>
      <span className="w-3 font-mono text-[10px] font-bold text-board-disabled">{seed}</span>
      {eliminated ? (
        <EliminatedIcon key={`icon-${replayKey}`} mark={project.mark} size={22} inView={inView} />
      ) : (
        <img src={project.mark} alt="" className="h-[22px] w-[22px] flex-none" />
      )}
      {eliminated ? (
        <EliminatedLabel key={`label-${replayKey}`} project={project} inView={inView} />
      ) : (
        <span className="font-mono text-[11px] font-bold text-board-body">{project.name}</span>
      )}
    </>
  );

  // Once eliminated, the profile link gives way to a replay button —
  // the animation plays once on scroll-into-view and is easy to miss
  // (it's well under 2s), so there needs to be a reliable, repeatable
  // way to see it again rather than only ever getting one shot per
  // page load. The project's profile is still reachable elsewhere
  // (Floor, My Activity, still-live opponents' matchup rows).
  if (eliminated) {
    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type="button"
        title="Watch it again"
        onClick={() => setReplayKey((k) => k + 1)}
        className={className}
        style={style}
      >
        {content}
      </button>
    );
  }

  return (
    <Link ref={ref as Ref<HTMLAnchorElement>} href={`/profile/${project.key}`} className={className} style={style}>
      {content}
    </Link>
  );
}

function MobileQFEntry({ project, eliminated }: { project: Project; eliminated: boolean }) {
  const { ref, inView } = useInViewOnce<HTMLElement>();
  const [replayKey, setReplayKey] = useState(0);
  const className = `flex items-center gap-2.5 border px-3 py-2 transition ${
    eliminated
      ? "border-[#2A241E] bg-[#0E0C09] hover:bg-[#161310]"
      : "border-board-border-alt bg-board-card hover:bg-[#151A11]"
  }`;
  const style = { borderLeft: eliminated ? "3px solid #5C3A2E" : "3px solid #CCFF00" };
  const content = (
    <>
      {eliminated ? (
        <EliminatedIcon key={`icon-${replayKey}`} mark={project.mark} size={22} inView={inView} />
      ) : (
        <img src={project.mark} alt="" className="h-[22px] w-[22px]" />
      )}
      {eliminated ? (
        <EliminatedLabel key={`label-${replayKey}`} project={project} inView={inView} />
      ) : (
        <span className="font-mono text-[11px] font-bold text-board-body">{project.name}</span>
      )}
    </>
  );

  if (eliminated) {
    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type="button"
        title="Watch it again"
        onClick={() => setReplayKey((k) => k + 1)}
        className={className}
        style={style}
      >
        {content}
      </button>
    );
  }

  return (
    <Link ref={ref as Ref<HTMLAnchorElement>} href={`/profile/${project.key}`} className={className} style={style}>
      {content}
    </Link>
  );
}

function winnerFor(
  room: Room,
  projects: Record<string, Project>,
  results: Record<string, RoomResult>
): Project | undefined {
  const result = results[room.id];
  return result ? projects[result.winnerKey] : undefined;
}

function SFPlaceholder({
  roomId,
  winner,
  reverse,
}: {
  roomId: string;
  winner?: Project;
  reverse?: boolean;
}) {
  if (winner) {
    return (
      <div
        className={`flex items-center gap-2.5 border border-board-lime bg-[#12160E] px-3.5 py-3 ${
          reverse ? "flex-row-reverse text-right" : ""
        }`}
        style={{ animation: "board-stampin-flat 500ms cubic-bezier(0.3,1.4,0.5,1) both" }}
      >
        <img src={winner.mark} alt="" className="h-6 w-6 flex-none" />
        <div className="min-w-0">
          <div className="truncate font-mono text-[11px] font-extrabold text-board-lime">
            {winner.name}
          </div>
          <div className="font-mono text-[8px] tracking-[0.12em] text-board-tertiary">
            WINNER · ROOM {roomId}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden border border-dashed border-[#6E8050] bg-[#12160E] px-3.5 py-3.5 font-mono text-[11px] font-bold tracking-[0.08em] text-board-body ${
        reverse ? "text-right" : ""
      }`}
    >
      <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 animate-[board-shimmer_5.5s_linear_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      WINNER · ROOM {roomId}
    </div>
  );
}

function FinalPanel() {
  return (
    <div className="flex flex-col justify-center gap-2.5 px-3">
      <div className="border-2 border-dashed border-board-lime bg-[#111607] px-4.5 py-5 text-center">
        <div className="mx-auto mb-2 w-fit animate-[board-floaty_2.6s_ease-in-out_infinite] text-[34px] leading-none">
          🏆
        </div>
        <div className="font-mono text-[13px] font-extrabold tracking-[0.14em] text-board-lime">
          THE FEATURED LAUNCH
        </div>
        <div className="my-4 flex items-center gap-2">
          <div className="flex-1 border border-dashed border-[#45521F] bg-[#0C0F07] px-2 py-3.5 font-mono text-[10px] text-[#5C6A38]">
            FINALIST A
          </div>
          <div className="w-6 font-mono text-[11px] font-extrabold text-board-lime">VS</div>
          <div className="flex-1 border border-dashed border-[#45521F] bg-[#0C0F07] px-2 py-3.5 font-mono text-[10px] text-[#5C6A38]">
            FINALIST B
          </div>
        </div>
        <div className="font-mono text-[10px] leading-[1.8] text-board-secondary-alt">
          Automatic V3 liquidity · fee split · staking vault · featured token launch
        </div>
      </div>
      <div className="text-center font-mono text-[9px] tracking-[0.16em] text-[#4A5540]">
        ONE WINNER · ONE LAUNCH
      </div>
    </div>
  );
}
