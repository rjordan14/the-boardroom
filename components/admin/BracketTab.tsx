"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Project, ProjectKey, Room } from "@/lib/types";
import type { RoomResult } from "@/lib/mock/results";

export function BracketTab({
  rooms,
  projects,
  results,
}: {
  rooms: Room[];
  projects: Record<string, Project>;
  results: Record<string, RoomResult>;
}) {
  const router = useRouter();
  const [picks, setPicks] = useState<Record<string, ProjectKey>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Every room in this round shares one voting window (see
  // lib/mock/rooms.ts) — closing is a whole-round action, so "is the
  // round closed" only needs to check one room's status.
  const roundClosed = rooms.length > 0 && rooms.every((r) => r.status === "closed");
  const allPicked = rooms.length > 0 && rooms.every((r) => picks[r.id]);

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

  const reopenRound = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/reopen-round", { method: "POST" });
      if (!res.ok) throw new Error("Failed to reopen round");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to reopen round");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-[1100px] px-[clamp(14px,4vw,48px)] py-7.5 pb-[70px]">
      <div className="font-mono text-[20px] font-extrabold text-board-heading">BRACKET</div>
      <div className="mt-2 font-mono text-[11px] leading-[1.7] text-board-secondary">
        {roundClosed
          ? "This round is closed and results are published. Reopen to undo."
          : "Assign who plays whom. Matchups lock once a round opens for voting. There's no real backend tallying ballots across wallets yet, so closing a round means declaring each room's winner yourself."}
      </div>

      <div className="mb-3 mt-6.5 flex items-center justify-between font-mono text-[9px] font-bold tracking-[0.14em] text-board-tertiary">
        <span>QUARTERFINAL · {roundClosed ? "DECIDED" : "LIVE, LOCKED"}</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {rooms.map((room) => {
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
                disabled={roundClosed}
                picked={pick === a.key}
                won={result?.winnerKey === a.key}
                pct={result?.tallies[a.key]?.pct}
                onClick={() => setPicks((p) => ({ ...p, [room.id]: a.key }))}
              />
              <div className="text-center font-mono text-[10px] font-extrabold text-board-disabled">VS</div>
              <RoomSideButton
                project={b}
                disabled={roundClosed}
                picked={pick === b.key}
                won={result?.winnerKey === b.key}
                pct={result?.tallies[b.key]?.pct}
                onClick={() => setPicks((p) => ({ ...p, [room.id]: b.key }))}
                reverse
              />
              <div className="text-right font-mono text-[10px] font-bold tracking-[0.06em] text-board-success">
                {roundClosed ? "DECIDED" : "LOCKED"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-3 mt-7.5 font-mono text-[9px] font-bold tracking-[0.14em] text-board-tertiary">
        SEMIFINAL · SET AFTER QUARTERFINAL RESULTS
      </div>
      <div className="border border-dashed border-board-border-alt p-5.5 text-center font-mono text-[11px] leading-[1.7] text-board-disabled">
        Semifinal matchups unlock for editing once all 4 quarterfinal rooms have a winner. Winners
        are auto-seeded 1v4 / 2v3 by ballot count; you can override before the round opens.
      </div>

      {error && (
        <div className="mt-5 border border-board-border-error bg-board-card-error px-4 py-3 font-mono text-[11px] font-bold text-board-error">
          {error}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {roundClosed ? (
          <button
            type="button"
            onClick={reopenRound}
            disabled={busy}
            className="border border-board-border-alt px-4.5 py-3 font-mono text-[10px] font-bold tracking-[0.1em] text-board-secondary transition hover:border-board-lime hover:text-board-lime disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "REOPENING…" : "↺ REOPEN ROUND"}
          </button>
        ) : (
          <button
            type="button"
            onClick={closeRound}
            disabled={busy || !allPicked}
            title={allPicked ? undefined : "Pick a winner for every room first"}
            className="bg-board-lime px-4.5 py-3 font-mono text-[10px] font-extrabold tracking-[0.1em] text-board-bg transition hover:bg-board-lime-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? "CLOSING ROUND…" : "CLOSE ROUND & PUBLISH RESULTS"}
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
