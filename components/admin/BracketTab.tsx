"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Project, ProjectKey, Room } from "@/lib/types";
import type { RoomResult } from "@/lib/mock/results";

const ROUND_ORDER = ["Quarterfinal", "Semifinal", "Final"] as const;
type RoundLabel = (typeof ROUND_ORDER)[number];

export function BracketTab({
  rooms,
  projects,
  results,
  currentRoundLabel,
}: {
  rooms: Room[];
  projects: Record<string, Project>;
  results: Record<string, RoomResult>;
  // Null once every round through Final has closed — the round that's
  // still open for voting otherwise, computed server-side from
  // lib/tournament/store.ts (the only source of truth for which round
  // is live, since rooms alone don't say which one is "current").
  currentRoundLabel: RoundLabel | null;
}) {
  const router = useRouter();
  const [picks, setPicks] = useState<Record<string, ProjectKey>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roomsByRound = ROUND_ORDER.map((label) => ({
    label,
    rooms: rooms.filter((r) => r.roundLabel === label),
  }));
  const liveRooms = currentRoundLabel ? rooms.filter((r) => r.roundLabel === currentRoundLabel) : [];
  const allPicked = liveRooms.length > 0 && liveRooms.every((r) => picks[r.id]);
  const anyRoundClosed = roomsByRound.some(({ rooms: r }) => r.length > 0 && r.every((room) => room.status === "closed"));
  const tournamentComplete = currentRoundLabel === null;

  const closeRound = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/close-round", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ winners: picks }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to close round");
      }
      setPicks({});
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to close round");
    } finally {
      setBusy(false);
    }
  };

  const undoLastClose = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/reopen-round", { method: "POST" });
      if (!res.ok) throw new Error("Failed to undo");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to undo");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-[1100px] px-[clamp(14px,4vw,48px)] py-7.5 pb-[70px]">
      <div className="font-mono text-[20px] font-extrabold text-board-heading">BRACKET</div>
      <div className="mt-2 font-mono text-[11px] leading-[1.7] text-board-secondary">
        {tournamentComplete
          ? "The season is complete — every round has a published result. Undo the last close to reopen the Final."
          : "Assign who plays whom. Matchups lock once a round opens for voting. There's no real backend tallying ballots across wallets yet, so closing a round means declaring each room's winner yourself. Semifinal and Final matchups are generated automatically from the round before them."}
      </div>

      {roomsByRound.map(({ label, rooms: roundRooms }) => {
        if (roundRooms.length === 0) {
          const prevLabel = ROUND_ORDER[ROUND_ORDER.indexOf(label) - 1];
          return (
            <div key={label}>
              <div className="mb-3 mt-7.5 font-mono text-[9px] font-bold tracking-[0.14em] text-board-tertiary">
                {label.toUpperCase()} · SET AFTER {prevLabel.toUpperCase()} RESULTS
              </div>
              <div className="border border-dashed border-board-border-alt p-5.5 text-center font-mono text-[11px] leading-[1.7] text-board-disabled">
                Matchups unlock here once every {prevLabel.toLowerCase()} room has a winner — each round&apos;s
                two winners are paired automatically (room 1+2&apos;s winners meet, then room 3+4&apos;s).
              </div>
            </div>
          );
        }

        const closed = roundRooms.every((r) => r.status === "closed");
        const isLive = label === currentRoundLabel;
        return (
          <div key={label}>
            <div className="mb-3 mt-6.5 font-mono text-[9px] font-bold tracking-[0.14em] text-board-tertiary">
              {label.toUpperCase()} · {closed ? "DECIDED" : "LIVE, LOCKED"}
            </div>
            <div className="flex flex-col gap-2.5">
              {roundRooms.map((room) => {
                const a = projects[room.projectA];
                const b = projects[room.projectB];
                const result = results[room.id];
                const pick = picks[room.id];
                return (
                  <div
                    key={room.id}
                    className="grid items-center gap-3.5 border border-board-border-alt bg-board-card-alt p-4"
                    style={{ gridTemplateColumns: "60px 1fr 40px 1fr 130px" }}
                  >
                    <div className="font-mono text-[12px] font-extrabold text-board-tertiary">R{room.id}</div>
                    <RoomSideButton
                      project={a}
                      disabled={!isLive}
                      picked={pick === a.key}
                      won={result?.winnerKey === a.key}
                      pct={result?.tallies[a.key]?.pct}
                      onClick={() => setPicks((p) => ({ ...p, [room.id]: a.key }))}
                    />
                    <div className="text-center font-mono text-[10px] font-extrabold text-board-disabled">VS</div>
                    <RoomSideButton
                      project={b}
                      disabled={!isLive}
                      picked={pick === b.key}
                      won={result?.winnerKey === b.key}
                      pct={result?.tallies[b.key]?.pct}
                      onClick={() => setPicks((p) => ({ ...p, [room.id]: b.key }))}
                      reverse
                    />
                    <div className="text-right font-mono text-[10px] font-bold tracking-[0.06em] text-board-success">
                      {closed ? "DECIDED" : "LOCKED"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {error && (
        <div className="mt-5 border border-board-border-error bg-board-card-error px-4 py-3 font-mono text-[11px] font-bold text-board-error">
          {error}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {currentRoundLabel && (
          <button
            type="button"
            onClick={closeRound}
            disabled={busy || !allPicked}
            title={allPicked ? undefined : "Pick a winner for every room first"}
            className="bg-board-lime px-4.5 py-3 font-mono text-[10px] font-extrabold tracking-[0.1em] text-board-bg transition hover:bg-board-lime-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? "CLOSING ROUND…" : `CLOSE ${currentRoundLabel.toUpperCase()} & PUBLISH RESULTS`}
          </button>
        )}
        {anyRoundClosed && (
          <button
            type="button"
            onClick={undoLastClose}
            disabled={busy}
            className="border border-board-border-alt px-4.5 py-3 font-mono text-[10px] font-bold tracking-[0.1em] text-board-secondary transition hover:border-board-lime hover:text-board-lime disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "UNDOING…" : "↺ UNDO LAST ROUND CLOSE"}
          </button>
        )}
        <button
          type="button"
          className="border border-board-border-alt px-4.5 py-3 font-mono text-[10px] font-bold tracking-[0.1em] text-board-secondary"
        >
          EXPORT BRACKET
        </button>
      </div>
    </div>
  );
}

function RoomSideButton({
  project,
  disabled,
  picked,
  won,
  pct,
  onClick,
  reverse,
}: {
  project: Project;
  disabled: boolean;
  picked: boolean;
  won: boolean;
  pct?: number;
  onClick: () => void;
  reverse?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2.5 border px-2.5 py-1.5 transition disabled:cursor-default ${
        reverse ? "flex-row-reverse text-right" : ""
      } ${
        won
          ? "border-board-lime bg-[#141A06]"
          : picked
            ? "border-board-lime bg-[#141A06]"
            : "border-transparent hover:enabled:border-board-border"
      }`}
    >
      <img src={project.mark} alt="" className="h-7 w-7 flex-none" />
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[12px] font-bold text-board-heading">{project.name}</span>
        {won && pct !== undefined && (
          <span className="block font-mono text-[9px] font-bold text-board-lime">WON · {pct}%</span>
        )}
        {!won && picked && !disabled && (
          <span className="block font-mono text-[9px] font-bold text-board-lime">YOUR PICK</span>
        )}
      </span>
    </button>
  );
}
