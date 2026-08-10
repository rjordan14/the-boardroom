"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/types";

type Phase = "shake" | "fall" | "settled";

/** Fires once the element first scrolls into view, then stops watching.
 *  The elimination animation below used to start on mount — harmless
 *  for content above the fold, but "THE ROAD TO LAUNCH" sits well below
 *  it, so the whole ~850ms shake/fall/settle sequence was long over by
 *  the time anyone actually scrolled down to see it. Gating on
 *  visibility instead means the reveal plays when someone's looking. */
export function useInViewOnce<T extends HTMLElement>(threshold = 0.4) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, threshold]);

  return { ref, inView };
}

/** A quarterfinal entry's icon shaking, the floor opening beneath it, and
 *  it dropping through. `inView` is owned by the caller (see
 *  useInViewOnce above) so a sibling EliminatedLabel can be driven by
 *  the exact same trigger and the two never fall out of sync. */
export function EliminatedIcon({ mark, size, inView }: { mark: string; size: number; inView: boolean }) {
  const [phase, setPhase] = useState<Phase>("shake");

  useEffect(() => {
    if (!inView) return;
    const t1 = setTimeout(() => setPhase("fall"), 350);
    const t2 = setTimeout(() => setPhase("settled"), 850);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [inView]);

  return (
    <span className="relative inline-flex flex-none items-center justify-center" style={{ width: size, height: size }}>
      {inView && phase === "fall" && (
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
        style={
          !inView
            ? undefined
            : {
                animation:
                  phase === "shake"
                    ? "board-crack-shake 350ms ease-in-out both"
                    : phase === "fall"
                      ? "board-fall-through 500ms cubic-bezier(0.5,0,1,0.5) both"
                      : "board-eliminated-settle 350ms ease-out both",
                filter: phase === "settled" ? "grayscale(1)" : undefined,
                opacity: phase === "settled" ? 0.45 : undefined,
              }
        }
      />
    </span>
  );
}

export function EliminatedLabel({ project, inView }: { project: Project; inView: boolean }) {
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setSettled(true), 700);
    return () => clearTimeout(t);
  }, [inView]);

  return (
    <div className="min-w-0">
      <div
        className="truncate font-mono text-[11px] font-bold leading-[1.2] transition-colors duration-300"
        style={{ color: settled ? "#6A7062" : undefined }}
      >
        <span style={{ textDecoration: settled ? "line-through" : undefined }}>{project.name}</span>
      </div>
      <div className="mt-1 font-mono text-[9px] tracking-[0.12em] text-board-tertiary">
        {settled ? (
          <>
            ELIMINATED <span className="text-board-lime">· ▶ WATCH AGAIN</span>
          </>
        ) : (
          " "
        )}
      </div>
    </div>
  );
}
