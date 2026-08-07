"use client";

import { useEffect, useRef, useState } from "react";

/** Fires a brief screen flash + page shake the moment `target` crosses
 *  from "still counting down" to "closed," for whoever's already on
 *  the page when it happens — not a replacement for the real close
 *  event (there isn't one; this is client-clock-driven), just a beat
 *  that says "that's it, sealed." Renders nothing once the flash ends. */
export function RoundCloseEffect({ target }: { target: string | null }) {
  const [flashing, setFlashing] = useState(false);
  const prevRemaining = useRef<number | null>(null);

  useEffect(() => {
    if (!target) return;
    const targetMs = new Date(target).getTime();

    const tick = () => {
      const remaining = targetMs - Date.now();
      if (prevRemaining.current !== null && prevRemaining.current > 0 && remaining <= 0) {
        setFlashing(true);
        document.body.classList.add("board-round-shake");
        setTimeout(() => document.body.classList.remove("board-round-shake"), 500);
        setTimeout(() => setFlashing(false), 1200);
      }
      prevRemaining.current = remaining;
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!flashing) return null;
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] bg-board-lime"
      style={{ animation: "board-round-flash 1.2s ease-out both" }}
    />
  );
}
