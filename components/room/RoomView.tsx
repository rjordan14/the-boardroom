"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { Project, Room } from "@/lib/types";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatClock } from "@/lib/utils/format";
import { getRoomProgress, useBoardroomStore } from "@/store/useBoardroomStore";
import { AudienceRow } from "@/components/lobby/AudienceRow";

/**
 * Progress advances over a fixed, fast simulated duration regardless of
 * a project's real pitchSeconds — mirrors the prototype's own
 * play()/pitchSeconds split (the display uses the real length, the
 * timer that drives the fill runs much faster) so the golden path is
 * testable in seconds, not minutes, without lying about pitch length.
 */
const SIMULATED_PLAYBACK_MS = 6000;

type PlaybackPhase = "door" | "playing" | "done";

export function RoomView({
  room,
  projectA,
  projectB,
}: {
  room: Room;
  projectA: Project;
  projectB: Project;
}) {
  const router = useRouter();
  const progress = useBoardroomStore((s) => getRoomProgress(s.watchProgress, room.id));
  const setWatchProgress = useBoardroomStore((s) => s.setWatchProgress);

  const [current, setCurrent] = useState<"A" | "B">("A");
  // Re-entering a room after A is already watched (e.g. back-navigating
  // from Compare) shouldn't replay the door animation.
  const [phase, setPhase] = useState<PlaybackPhase>(() => {
    const initial = getRoomProgress(useBoardroomStore.getState().watchProgress, room.id);
    return initial.pA >= 100 ? "done" : "door";
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const project = current === "A" ? projectA : projectB;
  const pctKey = current === "A" ? "pA" : "pB";
  const pct = current === "A" ? progress.pA : progress.pB;
  const bothWatched = progress.pA >= 100 && progress.pB >= 100;

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const play = () => {
    stopTimer();
    const stepMs = 80;
    const step = 100 / (SIMULATED_PLAYBACK_MS / stepMs);
    intervalRef.current = setInterval(() => {
      // Read the live store value instead of the closured `progress` —
      // this callback is created once per play() call and would
      // otherwise keep re-adding `step` to the same stale snapshot.
      const live = getRoomProgress(useBoardroomStore.getState().watchProgress, room.id);
      const value = current === "A" ? live.pA : live.pB;
      const next = Math.min(100, value + step);
      setWatchProgress(room.id, pctKey, next);
      // Transition on completion here, in the interval tick that
      // produces the new value — not in a separate effect reacting to
      // `pct`, which is a derived-state anti-pattern (setState inside
      // an effect body just to mirror another piece of state).
      if (next >= 100) {
        stopTimer();
        setPhase("done");
      }
    }, stepMs);
  };

  useEffect(() => {
    if (phase === "playing") play();
    return stopTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, current]);

  useEffect(() => {
    if (phase !== "door") return;
    // 3820ms — matches the door+walker sequence's own timing (1320ms
    // delay + 2500ms walk), not a re-timed guess. See MOTION.md "Walker
    // sequence": all seven animations share the 1320ms delay.
    const t = setTimeout(() => setPhase("playing"), 3820);
    return () => clearTimeout(t);
  }, [phase]);

  const enter = (which: "A" | "B") => {
    if (which === "B" && progress.pA < 100) return;
    stopTimer();
    setCurrent(which);
    const targetPct = which === "A" ? progress.pA : progress.pB;
    setPhase(targetPct >= 100 ? "done" : "door");
  };

  const advance = () => {
    if (bothWatched) {
      router.push(`/room/${room.id}/compare`);
      return;
    }
    enter(current === "A" ? "B" : "A");
  };

  const replay = () => {
    stopTimer();
    setWatchProgress(room.id, pctKey, 0);
    setPhase("playing");
  };

  const elapsedSeconds = (pct / 100) * project.pitchSeconds;

  const advanceLabel = useMemo(() => {
    if (bothWatched) return "COMPARE & VOTE →";
    return current === "A" ? `NEXT PITCH: ${projectB.name} →` : `NEXT PITCH: ${projectA.name} →`;
  }, [bothWatched, current, projectA.name, projectB.name]);

  return (
    <div>
      <div className="relative h-[min(560px,50vw)] min-h-[320px] overflow-hidden bg-board-bg-media">
        {/* This wrapper is sized to the image's true aspect ratio (the
            outer frame is shorter and clips it via top offset below) —
            AudienceRow's percentages need the real image dimensions to
            land in the right place, not the clipped frame's. */}
        <div className="absolute inset-x-0 top-[max(-64px,-6vw)] aspect-[1920/1080] w-full">
          <img src="/marks/room.png" alt="" className="absolute inset-0 h-full w-full" />
          <AudienceRow />
        </div>

        <div className="absolute left-[23.75%] top-[13.33%] flex h-[42.96%] w-[52.5%] flex-col items-center justify-center gap-1.5 overflow-hidden bg-black pb-9 sm:gap-3 sm:pb-0">
          {/* pb-9 (sm:pb-0) reserves room for the absolutely-positioned
              progress overlay below — without it, centered content and
              the overlay collide at short frame heights (narrow
              viewports, where min-h-[320px] dominates 50vw). The line
              subtitle drops out entirely below sm: there isn't room for
              three lines of text plus the mark in that case. */}
          {phase !== "door" && (
            <div
              key={`live-${current}`}
              className="flex flex-col items-center gap-1.5 text-center sm:gap-3"
              style={{ animation: "board-poweron 1000ms cubic-bezier(0.2,0,0.2,1) both" }}
            >
              <img src={project.mark} alt="" className="h-8 w-8 sm:h-14 sm:w-14" />
              <div className="max-w-full font-mono text-[clamp(15px,3.4vw,30px)] font-extrabold leading-[1.05] text-board-heading">
                {project.name}
              </div>
              <div className="hidden max-w-full font-mono text-[clamp(9px,1.3vw,12px)] text-[#7C8474] sm:block">
                {project.line}
              </div>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-4 py-3.5">
            <ProgressBar percent={pct} trackClassName="bg-[#1E2419]" />
            <div className="mt-2 flex justify-between font-mono text-[10px] text-board-secondary">
              <span>
                {pct >= 100 ? "WATCHED IN FULL" : phase === "playing" ? "PLAYING" : "ENTERING"}
              </span>
              <span>
                {formatClock(elapsedSeconds)} / {formatClock(project.pitchSeconds)}
              </span>
            </div>
          </div>

          <AnimatePresence>
            {phase === "done" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#05070B]"
              >
                <div className="font-mono text-[11px] font-bold tracking-[0.2em] text-board-success">
                  PITCH COMPLETE · {project.name}
                </div>
                <button
                  type="button"
                  onClick={advance}
                  className="bg-board-lime px-8 py-4 font-mono text-[13px] font-extrabold tracking-[0.12em] text-board-bg transition hover:bg-board-lime-hover"
                >
                  {advanceLabel}
                </button>
                <button
                  type="button"
                  onClick={replay}
                  className="font-mono text-[11px] text-board-secondary transition hover:text-board-lime"
                >
                  ↺ watch again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {phase === "door" && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 overflow-hidden"
            >
              <div className="absolute inset-0 bg-[rgba(3,5,8,0.78)]" />

              {/* Door: swings open in 3D perspective, revealing a
                  gold-lit spill and a nameplate for the pitch behind it. */}
              <div
                className="absolute overflow-hidden"
                style={{ left: "10.42%", top: "27.4%", width: "8.33%", height: "37.4%" }}
              >
                <div className="absolute inset-0 overflow-hidden bg-[#04060A]">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-[rgba(204,255,0,0.20)] to-[rgba(204,255,0,0.02)]"
                    style={{ animation: "board-spill 700ms 320ms both" }}
                  />
                </div>
                <div className="absolute inset-0" style={{ perspective: "1100px" }}>
                  <div
                    className="absolute inset-0 origin-left border-[3px] border-[#4C5C31] bg-gradient-to-r from-[#2B3618] to-[#171E10] shadow-[22px_0_46px_rgba(0,0,0,0.7)]"
                    style={{
                      animation: "board-door-open 1100ms 220ms cubic-bezier(0.45,0,0.25,1) both",
                    }}
                  >
                    <div className="absolute left-[14%] right-[14%] top-[5%] h-[26%] border-[3px] border-[#4C5C31] bg-[#1B2412]" />
                    <div className="absolute left-[14%] right-[14%] top-[36%] h-[26%] border-[3px] border-[#4C5C31] bg-[#1B2412]" />
                    <div className="absolute bottom-[5%] left-[14%] right-[14%] h-[24%] border-[3px] border-[#4C5C31] bg-[#1B2412]" />
                    <div className="absolute right-[8%] top-[44%] h-3.5 w-3.5 rounded-full bg-[#D9C24A] shadow-[0_2px_0_#8A7A22]" />
                    <div className="absolute right-[6%] top-[49%] h-1.5 w-5 bg-[#8A7A22]" />
                    <div className="absolute left-[20%] right-[20%] top-[31%] bg-[#E8E4D4] px-[3px] py-[5px] text-center shadow-[0_2px_0_#9A9784]">
                      <div className="font-mono text-[8px] font-extrabold leading-[1.3] text-[#15170F]">
                        {project.name}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="absolute text-center font-mono text-[8px] font-bold tracking-[0.14em] text-board-lime"
                style={{ left: "9.6%", top: "24.2%", width: "9.6%" }}
              >
                IN SESSION
              </div>

              <div className="flex items-center gap-2.5 border border-[#2C3819] bg-[rgba(8,10,6,0.9)] px-3.5 py-2 absolute left-[2%] top-[8%]">
                <span className="block h-1.5 w-1.5 animate-[board-pulse_1.2s_infinite] bg-board-lime" />
                <span className="font-mono text-[9px] font-bold tracking-[0.18em] text-board-lime">
                  NOW ENTERING · {project.name}
                </span>
              </div>

              {/* Walker: the pitch card walks out of the door and grows
                  as it "becomes" the video screen — see MOTION.md
                  "Walker sequence". All seven animations below share the
                  same 1320ms delay; don't retime one independently. */}
              <div
                className="absolute"
                style={{
                  left: "12%",
                  top: "41%",
                  opacity: 0,
                  animation:
                    "board-walk-path 2500ms 1320ms cubic-bezier(0.35,0,0.65,1) both, board-walker-appear 1ms 1320ms both",
                }}
              >
                <div
                  className="origin-bottom"
                  style={{ animation: "board-walk-scale 2500ms 1320ms cubic-bezier(0.35,0,0.65,1) both" }}
                >
                  <div
                    className="absolute bottom-[-14px] left-1/2 h-4 w-24 -translate-x-1/2 rounded-full bg-black/55 blur-[3px]"
                    style={{ animation: "board-shadow-walk 2500ms 1320ms cubic-bezier(0.35,0,0.65,1) both" }}
                  />
                  <div style={{ animation: "board-bob 300ms 1320ms ease-in-out 6 both" }}>
                    <div className="w-[min(150px,11vw)] border-[3px] border-board-lime bg-[#E8E4D4] px-2.5 pb-2.5 pt-3 text-center shadow-[0_5px_0_#9A9784,0_0_34px_rgba(204,255,0,0.35)]">
                      <img
                        src={project.mark}
                        alt=""
                        className="mx-auto h-[min(52px,3.8vw)] w-[min(52px,3.8vw)]"
                      />
                      <div className="mt-1.5 font-mono text-[min(11px,0.8vw)] font-extrabold leading-[1.3] tracking-[0.04em] text-[#15170F]">
                        {project.name}
                      </div>
                      <div className="mt-1 font-mono text-[min(7px,0.52vw)] leading-none tracking-[0.16em] text-[#6A6752]">
                        CORE PITCH · {formatClock(project.pitchSeconds)}
                      </div>
                    </div>
                  </div>
                  <div
                    className="mt-[-2px] flex justify-center gap-5.5"
                    style={{ animation: "board-legs-off 2500ms 1320ms linear both" }}
                  >
                    <div
                      className="relative h-[min(42px,3.1vw)] w-[min(12px,0.9vw)] origin-top bg-[#8CA02C]"
                      style={{ animation: "board-leg-l 300ms 1320ms ease-in-out infinite" }}
                    >
                      <div className="absolute bottom-[-5px] left-[-4px] h-1.5 w-5 bg-[#12160D]" />
                    </div>
                    <div
                      className="relative h-[min(42px,3.1vw)] w-[min(12px,0.9vw)] origin-top bg-[#8CA02C]"
                      style={{ animation: "board-leg-r 300ms 1320ms ease-in-out infinite" }}
                    >
                      <div className="absolute bottom-[-5px] left-[-4px] h-1.5 w-5 bg-[#12160D]" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute right-6 top-6 z-[6] border-2 border-[#46592C] bg-[#080A05] px-4 py-3 text-center shadow-[0_6px_22px_rgba(0,0,0,0.7)]">
          <div className="mb-2 flex items-center justify-center gap-1.5 font-mono text-[8px] font-bold tracking-[0.26em] text-board-secondary-alt">
            <span className="block h-1.5 w-1.5 animate-[board-pulse_1.1s_ease-in-out_infinite] rounded-full bg-board-lime" />
            PITCH CLOCK
          </div>
          <div className="font-mono text-[32px] font-extrabold tracking-[0.08em] text-board-lime [text-shadow:0_0_16px_rgba(204,255,0,0.55)]">
            {formatClock(Math.max(0, project.pitchSeconds - elapsedSeconds))}
          </div>
          <div className="mt-2 font-mono text-[7px] font-bold tracking-[0.2em] text-board-tertiary">
            REMAINING
          </div>
        </div>

        {phase === "door" && (
          <div className="absolute bottom-6 left-[clamp(14px,4vw,48px)] z-[5]">
            <button
              type="button"
              onClick={() => setPhase("playing")}
              className="border border-[#3D4536] bg-[rgba(8,10,6,0.8)] px-4 py-2.5 font-mono text-[10px] font-bold tracking-[0.1em] text-board-body transition hover:border-board-lime hover:text-board-lime"
            >
              SKIP ENTRANCE
            </button>
          </div>
        )}
      </div>

      <div className="border-y border-[#161914] bg-[#0B0D0A] px-[clamp(14px,4vw,48px)]">
        <div className="flex h-24 items-stretch">
          <button
            type="button"
            onClick={() => enter("A")}
            className="flex min-w-0 flex-1 items-center justify-end gap-2 border-b-[3px] text-right transition sm:gap-4"
            style={{ borderBottomColor: current === "A" ? "#CCFF00" : progress.pA >= 100 ? "#2C4A32" : "#1A1E17" }}
          >
            <div className="min-w-0">
              <div className="truncate font-mono text-[clamp(12px,4vw,18px)] font-extrabold text-board-heading">
                {projectA.name}
              </div>
              <div className="mt-2 truncate font-mono text-[11px] text-board-secondary">
                {current === "A" ? "NOW SHOWING" : progress.pA >= 100 ? "✓ WATCHED" : "NOT WATCHED"}
              </div>
            </div>
            <img src={projectA.mark} alt="" className="h-9 w-9 flex-none sm:h-[52px] sm:w-[52px]" />
          </button>
          <div className="flex w-[64px] flex-none items-center justify-center border-b-[3px] border-[#1A1E17] sm:w-[120px]">
            <img
              src="/marks/vs.png"
              alt="VS"
              className="h-7 w-14 animate-[board-floaty_4.2s_ease-in-out_infinite] sm:h-12 sm:w-24"
            />
          </div>
          <button
            type="button"
            onClick={() => enter("B")}
            disabled={progress.pA < 100}
            className="flex min-w-0 flex-1 items-center justify-start gap-2 border-b-[3px] transition disabled:cursor-not-allowed sm:gap-4"
            style={{ borderBottomColor: current === "B" ? "#CCFF00" : progress.pB >= 100 ? "#2C4A32" : "#1A1E17" }}
          >
            <img src={projectB.mark} alt="" className="h-9 w-9 flex-none sm:h-[52px] sm:w-[52px]" />
            <div className="min-w-0">
              <div className="truncate font-mono text-[clamp(12px,4vw,18px)] font-extrabold text-board-heading">
                {projectB.name}
              </div>
              <div className="mt-2 truncate font-mono text-[11px] text-board-secondary">
                {current === "B"
                  ? "NOW SHOWING"
                  : progress.pB >= 100
                    ? "✓ WATCHED"
                    : progress.pA < 100
                      ? "LOCKED UNTIL A IS WATCHED"
                      : "UP NEXT"}
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-5 px-[clamp(14px,4vw,48px)] py-8">
        <div className="border border-board-border-alt bg-board-card-alt p-6">
          <div className="mb-4 font-mono text-[14px] font-extrabold tracking-[0.06em] text-board-heading">
            {project.name} · KEY FACTS
          </div>
          <div className="grid grid-cols-[minmax(104px,150px)_1fr] gap-x-4.5 gap-y-2.5 font-mono text-[11px] leading-[1.6]">
            <span className="text-board-tertiary">TEAM</span>
            <span className="text-board-body">{project.team}</span>
            <span className="text-board-tertiary">SHIPPED</span>
            <span className="text-board-body">{project.shipped}</span>
            <span className="text-board-tertiary">TOKEN CONCEPT</span>
            <span className="text-board-body">{project.tokenPlan}</span>
            <span className="text-board-tertiary">RISKS DISCLOSED</span>
            <span className="text-board-body">{project.risksDisclosed}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-2 border-dashed border-[#3D4536] bg-board-card-alt p-6">
          <div className="font-mono text-[13px] font-extrabold tracking-[0.06em] text-board-body">
            BALLOT SEALED
          </div>
          <div className="font-mono text-[11px] leading-[1.8] text-board-secondary">
            Your time card opens the ballot once both pitches are watched in
            full.
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="flex font-mono text-[11px] text-board-body">
              {projectA.name}
              <span className="ml-auto text-[#5C6553]">
                {progress.pA >= 100 ? "watched" : `${Math.round(progress.pA)}%`}
              </span>
            </div>
            <ProgressBar percent={progress.pA} className="h-[3px]" trackClassName="bg-[#1E2419]" />
            <div className="mt-1.5 flex font-mono text-[11px] text-board-body">
              {projectB.name}
              <span className="ml-auto text-[#5C6553]">
                {progress.pB >= 100 ? "watched" : `${Math.round(progress.pB)}%`}
              </span>
            </div>
            <ProgressBar percent={progress.pB} className="h-[3px]" trackClassName="bg-[#1E2419]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function RoomHeaderRight({ room }: { room: Room }) {
  return (
    <div className="flex items-center gap-2.5 border border-[#4E5C34] bg-[#12160A] px-3.5 py-2">
      <span className="block h-1.5 w-1.5 animate-[board-pulse_1.6s_ease-in-out_infinite] rounded-full bg-board-lime" />
      <div className="text-right">
        <div className="font-mono text-[8px] font-bold tracking-[0.16em] text-board-secondary-alt">
          VOTING CLOSES
        </div>
        <div className="mt-1 font-mono text-[13px] font-extrabold text-board-lime">
          <CountdownTimer target={room.closesAt} />
        </div>
      </div>
    </div>
  );
}
