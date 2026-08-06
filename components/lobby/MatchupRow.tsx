import Link from "next/link";
import type { Project, Room } from "@/lib/types";
import { CountdownTimer } from "@/components/ui/CountdownTimer";

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
}: {
  room: Room;
  projectA: Project;
  projectB: Project;
}) {
  const isOpen = room.status === "open";
  const accent = isOpen ? "#CCFF00" : "#4ADE80";

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
          {isOpen ? (
            <span className="font-mono text-[9px] font-bold tracking-[0.1em] text-board-lime">
              OPEN NOW · CLOSES IN <CountdownTimer target={room.closesAt} />
            </span>
          ) : (
            <span className="font-mono text-[10px] font-bold tracking-[0.1em] text-board-tertiary">
              CLOSED
            </span>
          )}
        </div>
        <ProjectLink project={projectA} />
        <img src="/marks/vs.png" alt="VS" className="h-8 w-16 animate-[board-floaty_4.2s_ease-in-out_infinite]" />
        <ProjectLink project={projectB} />
        {isOpen ? <VoteCta roomId={room.id} /> : <ResultCta roomId={room.id} />}
      </div>

      {/* Desktop: 5-column row */}
      <div
        className="hidden items-center gap-5 lg:grid"
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
          {isOpen ? (
            <>
              <div className="font-mono text-[9px] font-bold tracking-[0.1em] text-board-lime">
                OPEN NOW · CLOSES IN <CountdownTimer target={room.closesAt} />
              </div>
              <VoteCta roomId={room.id} />
            </>
          ) : (
            <>
              <div className="font-mono text-[10px] font-bold tracking-[0.1em] text-board-tertiary">
                CLOSED
              </div>
              <ResultCta roomId={room.id} />
            </>
          )}
        </div>
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
      <div className="flex items-center justify-between gap-2.5 bg-board-lime px-3.5 py-3.5 text-board-bg shadow-[0_3px_0_#82A200]">
        <span className="font-mono text-[13px] font-extrabold tracking-[0.03em]">CLOCK IN TO VOTE</span>
        <span className="font-mono text-[14px] font-extrabold">↸</span>
      </div>
    </Link>
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
