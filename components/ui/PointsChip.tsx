"use client";

import { useEffect, useRef, useState } from "react";
import { useBoardroomStore } from "@/store/useBoardroomStore";

/** Cosmetic-only running total (see the points-system decision — never
 *  touches vote weight). Pops with the same stamp-in beat used
 *  elsewhere whenever it goes up, so earning points reads as an event
 *  rather than a number silently changing in the header. */
export function PointsChip() {
  const points = useBoardroomStore((s) => s.points);
  const prevRef = useRef(points);
  const [pulsing, setPulsing] = useState(false);

  useEffect(() => {
    if (points > prevRef.current) {
      setPulsing(true);
      const t = setTimeout(() => setPulsing(false), 550);
      prevRef.current = points;
      return () => clearTimeout(t);
    }
    prevRef.current = points;
  }, [points]);

  return (
    <div
      className="flex items-center gap-1.5 border border-board-border-amber-alt bg-[#141109] px-3 py-2.5 font-mono text-[10px] font-bold tracking-[0.08em] text-board-amber"
      style={pulsing ? { animation: "board-stampin-flat 500ms cubic-bezier(0.3,1.4,0.5,1) both" } : undefined}
    >
      <span>⭐</span>
      {points} PTS
    </div>
  );
}
