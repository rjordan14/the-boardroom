import Link from "next/link";
import { listRooms } from "@/lib/api/rooms";
import { listProjects } from "@/lib/api/projects";
import { listFloorPreview } from "@/lib/api/floor";
import { Header, WalletChip } from "@/components/ui/Header";
import { Hero } from "@/components/lobby/Hero";
import { ExplainerSteps } from "@/components/lobby/ExplainerSteps";
import { CountdownPanel } from "@/components/lobby/CountdownPanel";
import { VotingBackingExplainer } from "@/components/lobby/VotingBackingExplainer";
import { ActivityTicker } from "@/components/lobby/ActivityTicker";
import { EliminatedStrip } from "@/components/lobby/EliminatedStrip";
import { YourRoundStrip } from "@/components/lobby/YourRoundStrip";
import { MatchupRow } from "@/components/lobby/MatchupRow";
import { Bracket } from "@/components/lobby/Bracket";
import { FloorPreview } from "@/components/lobby/FloorPreview";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { RoundCloseEffect } from "@/components/ui/RoundCloseEffect";

export default async function LobbyPage() {
  const [rooms, projectList, floorQuestions] = await Promise.all([
    listRooms(),
    listProjects(),
    listFloorPreview(),
  ]);
  const projects = Object.fromEntries(projectList.map((p) => [p.key, p]));
  const firstOpen = rooms.find((r) => r.status === "open") ?? rooms[0];
  const openRooms = rooms.filter((r) => r.status === "open");
  const roundComplete = openRooms.length === 0;
  const roundClosesAt = openRooms.length
    ? openRooms.reduce((latest, r) => (r.closesAt > latest ? r.closesAt : latest), openRooms[0].closesAt)
    : null;

  return (
    <div>
      <RoundCloseEffect target={roundClosesAt} />
      <Header right={<WalletChip address="0x25…1A50" eligible />} />

      <div data-screen="lobby">
        <Hero />

        <div className="border-y border-[#1A1E17] bg-[#0B0D0A] px-[clamp(14px,4vw,48px)] py-10">
          <div className="grid items-start gap-[clamp(24px,3vw,52px)] lg:grid-cols-[minmax(0,1fr)_minmax(300px,420px)]">
            <div>
              <div className="max-w-[720px] text-pretty font-mono text-[clamp(16px,1.7vw,20px)] font-bold leading-[1.6] text-board-heading">
                The community picks the next crypto project to get a real
                token launch — no gatekeepers, no leaderboard to game, no
                ticker to front-run.
              </div>
              <ExplainerSteps />
            </div>
            <CountdownPanel closesAt={firstOpen.closesAt} firstOpenRoomId={firstOpen.id} />
          </div>
          <VotingBackingExplainer />
        </div>

        <ActivityTicker />

        <div className="px-[clamp(14px,4vw,48px)] pt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-1 font-mono text-[clamp(19px,2.8vw,26px)] font-extrabold leading-[1.05] tracking-[0.02em] text-board-heading">
                TODAY&apos;S MATCHUPS
              </div>
              <div className="font-mono text-[12px] text-[#7C8474]">
                Clock in, watch, vote. No gatekeepers.
              </div>
            </div>
            {!roundComplete && roundClosesAt && (
              <div className="flex items-center gap-2.5 border-2 border-board-lime bg-[#111607] px-4 py-2.5">
                <span className="block h-2 w-2 animate-[board-pulse_1.5s_ease-in-out_infinite] rounded-full bg-board-lime" />
                <div>
                  <div className="font-mono text-[9px] font-bold tracking-[0.2em] text-board-secondary-alt">
                    ROUND VOTING ENDS IN
                  </div>
                  <div className="font-mono text-[18px] font-extrabold leading-tight text-board-lime [text-shadow:0_0_16px_rgba(204,255,0,0.4)]">
                    <CountdownTimer target={roundClosesAt} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4">
            <YourRoundStrip rooms={rooms} />
          </div>

          <div className="mt-4 border border-board-border bg-board-card-alt">
            {rooms.map((room) => (
              <MatchupRow
                key={room.id}
                room={room}
                projectA={projects[room.projectA]}
                projectB={projects[room.projectB]}
                roundComplete={roundComplete}
              />
            ))}
          </div>
        </div>

        <div className="px-[clamp(14px,4vw,48px)] pt-12">
          <EliminatedStrip />
          <Bracket rooms={rooms} projects={projects} />
        </div>

        <div className="px-[clamp(14px,4vw,48px)] pt-8">
          <div className="flex gap-3.5 border border-board-border-amber bg-board-card-amber p-4">
            <div className="flex-none font-mono text-[11px] font-extrabold leading-[1.6] tracking-[0.1em] text-board-amber">
              NOTICE
            </div>
            <div className="font-mono text-[11px] leading-[1.7] text-[#9A8E6E]">
              No project in The Boardroom has a token, and no contract addresses exist for
              them during the tournament. Any address claiming otherwise is fake. Voting is
              free and equal — $STONKBROKER holdings never add voting power. Backing is a
              separate, optional escrow: it moves no votes, and it is fully reclaimable
              unless the project wins and completes its launch.
            </div>
          </div>
        </div>

        <div className="px-[clamp(14px,4vw,48px)] pt-8">
          <FloorPreview questions={floorQuestions} projects={projects} />
        </div>

        <div className="mt-8 flex flex-wrap justify-between gap-2 border-t border-[#161914] px-[clamp(14px,4vw,48px)] py-5 font-mono text-[11px] tracking-[0.08em] text-[#4A5540]">
          <div>STONKBROKERS.CASH · ROBINHOOD CHAIN MAINNET</div>
          <Link href="/apply" className="transition hover:text-board-lime">
            APPLY FOR SEASON 02 →
          </Link>
          <div className="text-board-success">● ONLINE</div>
        </div>
      </div>
    </div>
  );
}
