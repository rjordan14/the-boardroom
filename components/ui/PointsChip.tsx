"use client";

import { useEffect, useRef, useState } from "react";
import { useBoardroomStore } from "@/store/useBoardroomStore";

const EARN_ACTIONS = [
  { amount: 25, label: "Seal a ballot" },
  { amount: 15, label: "Back a project" },
  { amount: 10, label: "Back the winning question in a battle" },
  { amount: 5, label: "Ask a question" },
  { amount: 3, label: "Post a comment" },
  { amount: 2, label: "React to a pitch" },
];

/** Cosmetic-only running total (see the points-system decision — never
 *  touches vote weight). Pops with the same stamp-in beat used
 *  elsewhere whenever it goes up, so earning points reads as an event
 *  rather than a number silently changing in the header. A bare number
 *  in the header with no explanation anywhere in the app was the whole
 *  problem — this is that explanation, one click away. */
export function PointsChip() {
  const points = useBoardroomStore((s) => s.points);
  const pointsLog = useBoardroomStore((s) => s.pointsLog);
  const prevRef = useRef(points);
  const [pulsing, setPulsing] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (points > prevRef.current) {
      setPulsing(true);
      const t = setTimeout(() => setPulsing(false), 550);
      prevRef.current = points;
      return () => clearTimeout(t);
    }
    prevRef.current = points;
  }, [points]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 border border-board-border-amber-alt bg-[#141109] px-3 py-2.5 font-mono text-[10px] font-bold tracking-[0.08em] text-board-amber transition hover:border-board-amber"
        style={pulsing ? { animation: "board-stampin-flat 500ms cubic-bezier(0.3,1.4,0.5,1) both" } : undefined}
      >
        <span>⭐</span>
        {points} PTS
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[260px] border border-board-border-amber-alt bg-board-bg p-4 shadow-[0_14px_40px_rgba(0,0,0,0.6)]">
          <div className="font-mono text-[9px] font-extrabold tracking-[0.14em] text-board-amber">
            WHAT ARE POINTS?
          </div>
          <div className="mt-1.5 font-mono text-[10px] leading-[1.6] text-board-secondary">
            Cosmetic for now — a running tally of how involved you&apos;ve been. Never affects your
            vote weight or backing.
          </div>
          <div className="mt-3 flex flex-col gap-1.5">
            {EARN_ACTIONS.map((a) => (
              <div key={a.label} className="flex items-center justify-between gap-3 font-mono text-[10px]">
                <span className="text-board-body">{a.label}</span>
                <span className="flex-none font-bold text-board-amber">+{a.amount}</span>
              </div>
            ))}
          </div>
          {pointsLog.length > 0 && (
            <div className="mt-3 border-t border-[#2A2312] pt-3">
              <div className="font-mono text-[9px] font-bold tracking-[0.12em] text-board-tertiary">
                RECENT
              </div>
              <div className="mt-1.5 flex flex-col gap-1">
                {pointsLog.slice(0, 3).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between gap-3 font-mono text-[10px] text-board-secondary">
                    <span>{entry.reason}</span>
                    <span className="flex-none text-board-amber">+{entry.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
