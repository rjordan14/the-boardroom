"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Project, Room } from "@/lib/types";
import type { RoomResult } from "@/lib/mock/results";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function ResultView({
  room,
  result,
  winner,
  loser,
}: {
  room: Room;
  result: RoomResult;
  winner: Project;
  loser: Project;
}) {
  const winnerTally = result.tallies[winner.key];
  const loserTally = result.tallies[loser.key];

  return (
    <div>
      <div className="relative h-[min(420px,40vw)] min-h-[240px] overflow-hidden bg-board-bg-media">
        <img src="/marks/room.png" alt="" className="absolute inset-x-0 top-[max(-64px,-6vw)] block w-full" />
        <div className="absolute left-[23.75%] top-[13.33%] flex h-[42.96%] w-[52.5%] flex-col items-center justify-center gap-3 bg-black">
          <div className="font-mono text-[11px] tracking-[0.34em] text-board-secondary-alt">
            ROOM {room.id} · WINNER
          </div>
          <motion.img
            src={winner.mark}
            alt=""
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.2, 1.6, 0.4, 1] }}
            className="h-14 w-14"
          />
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="max-w-full text-center font-mono text-[clamp(20px,4.6vw,46px)] font-extrabold leading-none tracking-[-0.01em] text-board-lime [text-shadow:0_0_24px_rgba(204,255,0,0.35)]"
          >
            {winner.name}
          </motion.div>
          <div className="font-mono text-[13px] font-bold text-board-heading">
            ADVANCES TO THE SEMIFINALS
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 px-[clamp(14px,4vw,48px)] pt-8">
        <div className="border border-board-border-alt bg-board-card-alt p-6.5">
          <div className="mb-5 font-mono text-[14px] font-extrabold tracking-[0.06em] text-board-heading">
            FINAL VALID BALLOTS
          </div>
          {[winner, loser].map((project, i) => {
            const tally = i === 0 ? winnerTally : loserTally;
            if (!tally) return null;
            return (
              <div key={project.key} className="mb-3 flex items-center gap-3.5">
                <img src={project.mark} alt="" className="h-8 w-8" />
                <div className="flex-1">
                  <div
                    className="mb-2 flex justify-between font-mono text-[12px] font-bold"
                    style={{ color: i === 0 ? "#F2F5EF" : "#8A9184" }}
                  >
                    <span>{project.name}</span>
                    <span style={{ color: i === 0 ? "#CCFF00" : "#8A9184" }}>
                      {tally.pct}% · {tally.votes.toLocaleString()}
                    </span>
                  </div>
                  <ProgressBar
                    percent={tally.pct}
                    className="h-2"
                    trackClassName="bg-[#1E2419]"
                    fillClassName={i === 0 ? "" : "bg-[#4A5540]"}
                  />
                </div>
              </div>
            );
          })}
          <div className="mt-5 border-t border-[#1E2419] pt-3.5 font-mono text-[10px] leading-[1.8] text-[#5C6553]">
            {result.totalValid.toLocaleString()} valid · {result.quarantinedCount} quarantined for
            review ({((result.quarantinedCount / result.totalValid) * 100).toFixed(1)}%)
          </div>
        </div>

        <div className="flex flex-col gap-4 border border-board-border-alt bg-board-card-alt p-6.5">
          <div className="font-mono text-[14px] font-extrabold tracking-[0.06em] text-board-heading">
            {loser.name} LEAVES WITH
          </div>
          <div className="flex flex-col gap-2.5 font-mono text-[11px] leading-[1.6] text-board-body">
            {loserTally && (
              <Bullet>{loserTally.votes.toLocaleString()} people who watched the whole pitch</Bullet>
            )}
            <Bullet>A permanent profile, pitch and tournament history</Bullet>
            <Bullet>An open invitation to Season 02</Bullet>
          </div>
          <Link
            href={`/profile/${loser.key}`}
            className="mt-auto border border-[#3D4536] px-4 py-3 text-center font-mono text-[11px] font-bold tracking-[0.1em] text-board-body transition hover:border-board-lime hover:text-board-lime"
          >
            FOLLOW {loser.name}
          </Link>
        </div>
      </div>

      <div className="px-[clamp(14px,4vw,48px)] py-9">
        <Link
          href="/"
          className="block bg-board-lime py-4.5 text-center font-mono text-[13px] font-extrabold tracking-[0.12em] text-board-bg transition hover:bg-board-lime-hover"
        >
          BACK TO THE LOBBY →
        </Link>
      </div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5">
      <span className="text-board-success">✸</span>
      {children}
    </div>
  );
}
