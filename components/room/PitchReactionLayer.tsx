"use client";

import { useEffect, useRef, useState } from "react";
import { useBoardroomStore } from "@/store/useBoardroomStore";

const REACTIONS = ["🔥", "🚀", "💀", "📈", "😂", "💩"];
const FLOAT_MS = 1800;

interface FloatingReaction {
  key: string;
  emoji: string;
  left: number;
}

/** Tap a reaction while a pitch plays and it's timestamped to that exact
 *  moment — every later viewer (including you, replaying) sees it float
 *  up again as their own playback crosses the same mark, confined to
 *  the video's lower third. Reactions persist in the shared store
 *  (store/useBoardroomStore.ts pitchReactions), so this isn't just a
 *  local effect — it's the same replay everyone gets. */
export function PitchReactionLayer({
  projectKey,
  elapsedSeconds,
}: {
  projectKey: string;
  elapsedSeconds: number;
}) {
  const reactions = useBoardroomStore((s) => s.pitchReactions[projectKey]);
  const addPitchReaction = useBoardroomStore((s) => s.addPitchReaction);
  const [floating, setFloating] = useState<FloatingReaction[]>([]);
  const firedRef = useRef<Set<string>>(new Set());
  const prevElapsedRef = useRef(0);

  const spawn = (emoji: string) => {
    const key = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const left = 12 + Math.random() * 66;
    setFloating((f) => [...f, { key, emoji, left }]);
    setTimeout(() => setFloating((f) => f.filter((fl) => fl.key !== key)), FLOAT_MS);
  };

  // A pitch that's replaying from 0 should replay its reaction history
  // too, not just skip straight to "already seen everything".
  useEffect(() => {
    if (elapsedSeconds < prevElapsedRef.current - 0.5) {
      firedRef.current = new Set();
    }
    prevElapsedRef.current = elapsedSeconds;
  }, [elapsedSeconds]);

  useEffect(() => {
    for (const r of reactions ?? []) {
      if (r.atSeconds <= elapsedSeconds && !firedRef.current.has(r.id)) {
        firedRef.current.add(r.id);
        spawn(r.emoji);
      }
    }
  }, [elapsedSeconds, reactions]);

  // Firing just records it — the replay effect above picks it up on the
  // next render (reactions changed) and spawns it, same as it would for
  // anyone else's. A second direct spawn() here would double it up,
  // since the effect has no way to know this particular one was "mine".
  const fire = (emoji: string) => {
    addPitchReaction(projectKey, emoji, elapsedSeconds);
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-1/3 overflow-hidden">
      {floating.map((f) => (
        <span
          key={f.key}
          className="absolute bottom-8 text-[18px] sm:text-[22px]"
          style={{ left: `${f.left}%`, animation: `board-reaction-float ${FLOAT_MS}ms ease-out both` }}
        >
          {f.emoji}
        </span>
      ))}
      <div className="pointer-events-auto absolute bottom-1 right-1 flex gap-0.5 sm:bottom-1.5 sm:right-1.5 sm:gap-1">
        {REACTIONS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => fire(emoji)}
            className="flex h-6 w-6 items-center justify-center border border-[#2C3327] bg-[rgba(8,10,6,0.75)] text-[12px] transition hover:scale-110 hover:border-board-lime active:scale-90 sm:h-7 sm:w-7 sm:text-[14px]"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
