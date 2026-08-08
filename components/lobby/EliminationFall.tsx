"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/lib/types";

type Phase = "shake" | "fall" | "settled";

/** A quarterfinal entry's icon shaking, the floor opening beneath it, and
 *  it dropping through — plays once on mount, matching the Bracket's own
 *  stamp-in reveal for the winner sitting right next to it (see
 *  Bracket.tsx's SFPlaceholder, which fires unconditionally whenever a
 *  result exists rather than tracking "first time seen this session" —
 *  same convention here, for the same reason). */
export function EliminatedIcon({ mark, size }: { mark: string; size: number }) {
  const [phase, setPhase] = useState<Phase>("shake");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("fall"), 350);
    const t2 = setTimeout(() => setPhase("settled"), 850);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <span className="relative inline-flex flex-none items-center justify-center" style={{ width: size, height: size }}>
      {phase === "fall" && (
        <>
          <span
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[#3D1A12]"
            style={{ animation: "board-trapdoor-open 200ms ease-out both" }}
          />
          <span
            className="pointer-events-none absolute h-full w-full rounded-full bg-[radial-gradient(circle,rgba(240,100,75,0.9),rgba(240,100,75,0)_70%)]"
            style={{ animation: "board-flame-flash 500ms ease-out both" }}
          />
        </>
      )}
      <img
        src={mark}
        alt=""
        className="h-full w-full"
        style={{
          animation:
            phase === "shake"
              ? "board-crack-shake 350ms ease-in-out both"
              : phase === "fall"
                ? "board-fall-through 500ms cubic-bezier(0.5,0,1,0.5) both"
                : "board-eliminated-settle 350ms ease-out both",
          filter: phase === "settled" ? "grayscale(1)" : undefined,
          opacity: phase === "settled" ? 0.45 : undefined,
        }}
      />
    </span>
  );
}

export function EliminatedLabel({ project }: { project: Project }) {
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSettled(true), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-w-0">
      <div
        className="truncate font-mono text-[11px] font-bold leading-[1.2] transition-colors duration-300"
        style={{ color: settled ? "#6A7062" : undefined }}
      >
        <span style={{ textDecoration: settled ? "line-through" : undefined }}>{project.name}</span>
      </div>
      <div className="mt-0.5 font-mono text-[8px] tracking-[0.12em] text-[#5C6653]">
        {settled ? "ELIMINATED" : " "}
      </div>
    </div>
  );
}
