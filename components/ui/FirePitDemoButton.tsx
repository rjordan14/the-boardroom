"use client";

import { useState } from "react";
import { EliminatedIcon, EliminatedLabel } from "@/components/lobby/EliminationFall";

/** A generic placeholder mark (dark square, lime "?") rather than any
 *  real project's actual pixel-art logo — this is a standalone preview
 *  of the animation, decoupled from the live tournament's real data,
 *  and shouldn't be mistakable for an actual result. */
const DEMO_MARK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%232C3327'/%3E%3Ctext x='12' y='17' font-size='13' text-anchor='middle' fill='%23CCFF00' font-family='monospace'%3E%3F%3C/text%3E%3C/svg%3E";

/** Footer-anchored, always-available way to see the elimination
 *  animation on demand — the real thing only shows up once a round
 *  actually closes, which isn't reliably demoable on request. */
export function FirePitDemoButton() {
  const [open, setOpen] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setReplayKey((k) => k + 1);
        }}
        className="pointer-events-auto font-mono text-[9px] font-bold tracking-[0.1em] text-board-tertiary underline decoration-dotted transition hover:text-board-lime"
      >
        🔥 FIRE DEMO
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-[rgba(4,6,10,0.86)] px-6 py-12"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[380px] border border-board-border bg-board-card shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center gap-3.5 border-b border-[#1A1E17] px-5.5 py-4">
              <span className="font-mono text-[10px] font-bold tracking-[0.16em] text-board-secondary-alt">
                FIRE PIT PREVIEW
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="ml-auto flex items-center gap-2 border border-[#3D4536] px-3.5 py-2 font-mono text-[10px] font-bold tracking-[0.1em] text-board-body transition hover:border-board-lime hover:text-board-lime"
              >
                CLOSE ✕
              </button>
            </div>

            <div className="p-6 text-center">
              <div className="mb-5 font-mono text-[10px] leading-[1.7] text-board-tertiary">
                What a project looks like in the bracket once it&apos;s eliminated. Not a real
                result — this is a sample, not tied to any live matchup.
              </div>

              <div className="flex items-center justify-center gap-2.5 border border-[#2A241E] bg-[#0E0C09] px-4 py-3.5">
                <EliminatedIcon key={replayKey} mark={DEMO_MARK} size={28} inView={true} />
                <EliminatedLabel key={replayKey} project={{ name: "SAMPLE PROJECT" }} inView={true} />
              </div>

              <button
                type="button"
                onClick={() => setReplayKey((k) => k + 1)}
                className="mt-5 border border-[#3D4536] px-5 py-3 font-mono text-[11px] font-bold tracking-[0.08em] text-board-body transition hover:border-board-lime hover:text-board-lime"
              >
                ▶ WATCH AGAIN
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
