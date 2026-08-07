"use client";

import Link from "next/link";
import type { Project, Room } from "@/lib/types";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getRoomProgress, useBoardroomStore } from "@/store/useBoardroomStore";

/**
 * Two layouts, not one grid reflowed by media query: the desktop grid
 * (room # · project A · VS · project B · status/CTA) doesn't have a
 * sane single-column reading order without reordering DOM nodes, so
 * mobile gets its own straightforward stacked markup instead of
 * fighting CSS grid-template-columns overrides at the breakpoint.
 * Mirrors the prototype's own `@media (max-width:1024px)` collapse.
 */
export function MatchupRow({
  room,
  projectA,
  projectB,
  roundComplete,
}: {
  room: Room;
  projectA: Project;
  projectB: Project;
  /** Whether every room in this round has closed — results stay sealed
   *  per-room until then, even if this specific room's own voting
   *  window already ended (leaking one room's result while siblings
   *  are still open would defeat the point of sealing ballots at all). */
  roundComplete: boolean;
}) {
  const progress = useBoardroomStore((s) => getRoomProgress(s.watchProgress, room.id));
  const ballotChoice = useBoardroomStore((s) => s.ballotChoice[room.id]);
  const watchStartedAt = useBoardroomStore((s) => s.watchStartedAt[room.id]);
  const ballotSealedAt = useBoardroomStore((s) => s.ballotSealedAt[room.id]);

  const isOpen = room.status === "open";
  const voted = Boolean(ballotChoice);
  const started = progress.pA > 0 || progress.pB > 0;
  const bothWatched = progress.pA >= 100 && progress.pB >= 100;
  // A sealed ballot outranks room status — voting closed doesn't erase
  // that this wallet already voted, and a wallet that finished both
  // pitches but hasn't voted yet is a distinct state from "just started".
  const state: "voted" | "closed" | "awaiting_round" | "watching" | "not_started" = voted
    ? "voted"
    : !isOpen
      ? roundComplete
        ? "closed"
        : "awaiting_round"
      : started
        ? "watching"
        : "not_started";
  const chosenProject = voted ? (projectA.key === ballotChoice ? projectA : projectB) : null;
  const accent = state === "closed" || state === "awaiting_round" ? "#4ADE80" : voted ? "#4ADE80" : "#CCFF00";

  const statusBadge =
    state === "voted" ? (
      <span className="font-mono text-[9px] font-bold tracking-[0.1em] text-board-success">
        ✓ BALLOT SEALED
      </span>
    ) : state === "closed" || state === "awaiting_round" ? (
      <span className="font-mono text-[10px] font-bold tracking-[0.1em] text-board-tertiary">
        CLOSED
      </span>
    ) : (
      <span className="font-mono text-[9px] font-bold tracking-[0.1em] text-board-lime">
        OPEN NOW · CLOSES IN <CountdownTimer target={room.closesAt} />
      </span>
    );

  const cta =
    state === "closed" ? (
      <ResultCta roomId={room.id} />
    ) : state === "awaiting_round" ? (
      <AwaitingRoundNotice />
    ) : state === "voted" ? (
      <ReviewCta />
    ) : bothWatched ? (
      <CompareCta roomId={room.id} />
    ) : (
      <VoteCta roomId={room.id} />
    );

  const subPanel =
    state === "voted" && chosenProject ? (
      <VotedPanel
        chosenProject={chosenProject}
        watchStartedAt={watchStartedAt}
        ballotSealedAt={ballotSealedAt}
      />
    ) : state !== "closed" && state !== "awaiting_round" ? (
      <ProgressSubPanel
        progress={progress}
        bothWatched={bothWatched}
        started={started}
        watchStartedAt={watchStartedAt}
      />
    ) : null;

  return (
    <div
      className="border-b border-[#1A1E17] p-5 transition last:border-b-0 hover:bg-[#0D110A]"
      style={{ borderLeft: `3px solid ${accent}` }}
    >
      {/* Mobile / tablet: stacked */}
      <div className="flex flex-col gap-4 lg:hidden">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[15px] font-extrabold" style={{ color: accent }}>
            {room.id}
          </span>
          {statusBadge}
        </div>
        <ProjectLink project={projectA} />
        <img src="/marks/vs.png" alt="VS" className="h-8 w-16 animate-[board-floaty_4.2s_ease-in-out_infinite]" />
        <ProjectLink project={projectB} />
        {cta}
        {subPanel}
      </div>

      {/* Desktop: 5-column row */}
      <div className="hidden lg:block">
        <div
          className="grid items-center gap-5"
          style={{
            gridTemplateColumns:
              "clamp(40px,4vw,64px) minmax(0,1fr) clamp(90px,10vw,190px) minmax(0,1fr) clamp(200px,18vw,250px)",
          }}
        >
          <div className="font-mono text-[15px] font-extrabold" style={{ color: accent }}>
            {room.id}
          </div>

          <ProjectLink project={projectA} reverse />

          <div className="text-center">
            <img
              src="/marks/vs.png"
              alt="VS"
              className="mx-auto h-[43px] w-[86px] animate-[board-floaty_4.2s_ease-in-out_infinite]"
            />
          </div>

          <ProjectLink project={projectB} />

          <div className="flex flex-col items-end gap-2">
            {statusBadge}
            {cta}
          </div>
        </div>
        {subPanel}
      </div>
    </div>
  );
}

function ProjectLink({ project, reverse }: { project: Project; reverse?: boolean }) {
  return (
    <Link
      href={`/profile/${project.key}`}
      className={
        reverse
          ? "flex flex-row-reverse items-center justify-start gap-3.5 text-right transition hover:opacity-85"
          : "flex items-center gap-3.5 transition hover:opacity-85"
      }
    >
      <img
        src={project.mark}
        alt=""
        className="h-[46px] w-[46px] flex-none animate-[board-floaty_5.5s_ease-in-out_infinite] transition-transform hover:scale-[1.12] hover:-rotate-3"
      />
      <div>
        <div className="font-mono text-[15px] font-bold leading-[1.2] text-board-heading">
          {project.name}
        </div>
        <div className="mt-1 font-mono text-[11px] leading-[1.5] text-[#7C8474]">
          {project.line}
        </div>
      </div>
    </Link>
  );
}

function VoteCta({ roomId }: { roomId: string }) {
  return (
    <Link href={`/room/${roomId}`} className="block w-full max-w-[252px] transition hover:-translate-y-0.5">
      <div className="group flex items-center justify-between gap-2.5 bg-board-lime px-3.5 py-3.5 text-board-bg shadow-[0_3px_0_#82A200]">
        <span className="font-mono text-[13px] font-extrabold tracking-[0.03em]">CLOCK IN TO VOTE</span>
        <span className="inline-block font-mono text-[14px] font-extrabold transition-transform group-hover:animate-[board-nudge_0.6s_ease-in-out_infinite]">
          ↸
        </span>
      </div>
    </Link>
  );
}

function CompareCta({ roomId }: { roomId: string }) {
  return (
    <Link
      href={`/room/${roomId}/compare`}
      className="block w-full max-w-[252px] transition hover:-translate-y-0.5"
    >
      <div className="group flex items-center justify-between gap-2.5 bg-board-lime px-3.5 py-3.5 text-board-bg shadow-[0_3px_0_#82A200]">
        <span className="font-mono text-[13px] font-extrabold tracking-[0.03em]">COMPARE & VOTE</span>
        <span className="inline-block font-mono text-[14px] font-extrabold transition-transform group-hover:animate-[board-nudge_0.6s_ease-in-out_infinite]">
          ↸
        </span>
      </div>
    </Link>
  );
}

function ReviewCta() {
  return (
    <Link
      href="/my-activity"
      className="block w-full max-w-[252px] border border-[#3D4536] px-3.5 py-3.5 text-center transition hover:border-board-lime"
    >
      <span className="font-mono text-[12px] font-extrabold tracking-[0.08em] text-board-body">
        VIEW MY BALLOT →
      </span>
    </Link>
  );
}

function AwaitingRoundNotice() {
  return (
    <div className="block w-full max-w-[252px] border border-dashed border-board-border px-3.5 py-3.5 text-center">
      <span className="font-mono text-[10px] font-bold tracking-[0.08em] text-board-tertiary">
        RESULT AFTER ROUND CLOSES
      </span>
    </div>
  );
}

function ResultCta({ roomId }: { roomId: string }) {
  return (
    <Link
      href={`/room/${roomId}/result`}
      className="block w-full max-w-[252px] border border-[#3D4536] px-3.5 py-3.5 text-center transition hover:border-board-lime"
    >
      <span className="font-mono text-[12px] font-extrabold tracking-[0.08em] text-board-body">
        VIEW RESULT →
      </span>
    </Link>
  );
}

function ProgressSubPanel({
  progress,
  bothWatched,
  started,
  watchStartedAt,
}: {
  progress: { pA: number; pB: number };
  bothWatched: boolean;
  started: boolean;
  watchStartedAt: number | undefined;
}) {
  const currentKey = progress.pA < 100 ? "A" : "B";
  const watchedCount = (progress.pA >= 100 ? 1 : 0) + (progress.pB >= 100 ? 1 : 0);
  const clockLabel = watchStartedAt
    ? new Date(watchStartedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
    : null;

  return (
    <div className="mt-3 border border-dashed border-board-border-alt bg-board-card px-3.5 py-3">
      <div className="flex items-center gap-2 font-mono text-[9px] font-bold tracking-[0.14em]">
        {bothWatched ? (
          <span className="text-board-success">✓ BOTH PITCHES WATCHED · READY TO VOTE</span>
        ) : started ? (
          <>
            <span className="block h-1.5 w-1.5 animate-[board-led-pulse_1.6s_ease-in-out_infinite] rounded-full bg-board-lime" />
            <span className="text-board-lime">
              WATCHING NOW{clockLabel ? ` · IN ${clockLabel}` : ""}
            </span>
          </>
        ) : (
          <span className="text-board-tertiary">BALLOT UNLOCKS AFTER BOTH PITCHES</span>
        )}
      </div>
      <div className="mt-1.5 font-mono text-[9px] tracking-[0.06em] text-board-tertiary">
        {watchedCount} OF 2 WATCHED
        {!bothWatched && started ? ` · PITCH ${currentKey} PLAYING` : ""}
      </div>
      <div className="mt-2.5 grid grid-cols-2 gap-3">
        <PitchProgress label="PITCH A" percent={progress.pA} />
        <PitchProgress label="PITCH B" percent={progress.pB} />
      </div>
    </div>
  );
}

function PitchProgress({ label, percent }: { label: string; percent: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between font-mono text-[8px] tracking-[0.1em] text-board-tertiary">
        <span>{label}</span>
        <span>{Math.round(percent)}%</span>
      </div>
      <ProgressBar percent={percent} />
    </div>
  );
}

function formatWallClock(ms: number): string {
  return new Date(ms).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

function VotedPanel({
  chosenProject,
  watchStartedAt,
  ballotSealedAt,
}: {
  chosenProject: Project;
  watchStartedAt: number | undefined;
  ballotSealedAt: number | undefined;
}) {
  return (
    <div className="mt-3 flex items-center gap-3 border border-board-border-alt bg-board-card px-3.5 py-3">
      <img src={chosenProject.mark} alt="" className="h-7 w-7 flex-none" />
      <div className="font-mono text-[10px] leading-[1.5]">
        <div className="font-bold text-board-heading">{chosenProject.name}</div>
        {watchStartedAt && ballotSealedAt ? (
          <div className="text-board-tertiary">
            IN {formatWallClock(watchStartedAt)} · OUT {formatWallClock(ballotSealedAt)}
          </div>
        ) : (
          <div className="text-board-tertiary">VOTE RECORDED</div>
        )}
      </div>
      <div className="ml-auto font-mono text-[9px] font-bold tracking-[0.1em] text-board-success">
        ✓ YOU VOTED · BALLOT SEALED
      </div>
    </div>
  );
}
