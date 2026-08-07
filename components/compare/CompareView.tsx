"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Project, QaItem, Room } from "@/lib/types";
import { CompareCard } from "@/components/compare/CompareCard";
import { ProfileModal } from "@/components/compare/ProfileModal";
import { Ceremony } from "@/components/ballot/Ceremony";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { VsMark } from "@/components/ui/VsMark";
import { useCastVote, useEligibility } from "@/lib/chain/hooks";
import { useBoardroomStore } from "@/store/useBoardroomStore";

export function CompareView({
  room,
  projectA,
  projectB,
  qaByProject,
}: {
  room: Room;
  projectA: Project;
  projectB: Project;
  qaByProject: Record<string, QaItem[]>;
}) {
  const router = useRouter();
  const [choice, setChoice] = useState<"A" | "B" | null>(null);
  const [modalKey, setModalKey] = useState<string | null>(null);

  const { data: eligibility } = useEligibility();
  const { phase, castVote } = useCastVote(room.id);
  const setBallotChoice = useBoardroomStore((s) => s.setBallotChoice);

  const chosenProject = choice === "A" ? projectA : choice === "B" ? projectB : null;
  const busy = phase === "signing" || phase === "pending";

  const handleCast = () => {
    if (!choice || busy || !eligibility?.eligible) return;
    castVote(choice);
  };

  const handleCeremonyComplete = () => {
    if (!choice) return;
    setBallotChoice(room.id, choice === "A" ? projectA.key : projectB.key);
    router.push(`/room/${room.id}/sealed`);
  };

  return (
    <div>
      <div className="flex items-end justify-between gap-4 px-[clamp(14px,4vw,48px)] pt-10">
        <div>
          <div className="font-mono text-[clamp(22px,3.6vw,34px)] font-extrabold leading-[1.05] tracking-[0.01em] text-board-heading">
            BOTH PITCHES WATCHED
          </div>
          <div className="mt-2.5 max-w-[640px] font-mono text-[13px] leading-[1.7] text-board-secondary">
            Your ballot is open. One eligible wallet, one vote — final once
            sealed. Results stay hidden until the round closes.
          </div>
        </div>
        <div className="flex items-center gap-3.5 bg-board-lime px-4.5 py-2.5 text-[#10140B] shadow-[0_3px_0_#82A200]">
          <span className="block h-2 w-2 animate-[board-pulse_1.2s_ease-in-out_infinite] rounded-full bg-[#10140B]" />
          <div>
            <div className="font-mono text-[9px] font-extrabold tracking-[0.18em] opacity-70">
              VOTE CLOSES
            </div>
            <div className="mt-1.5 font-mono text-[22px] font-extrabold tracking-[-0.01em]">
              <CountdownTimer target={room.closesAt} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-stretch gap-4 px-[clamp(14px,4vw,48px)] pt-7.5">
        <CompareCard
          project={projectA}
          picked={choice === "A"}
          onPick={() => setChoice("A")}
          onOpenProfile={() => setModalKey("A")}
        />
        <div className="flex w-full basis-full justify-center py-1 lg:w-auto lg:basis-auto lg:py-0">
          <VsMark className="h-auto w-[clamp(84px,9vw,132px)] self-center" />
        </div>
        <CompareCard
          project={projectB}
          picked={choice === "B"}
          onPick={() => setChoice("B")}
          onOpenProfile={() => setModalKey("B")}
        />
      </div>

      <div className="px-[clamp(14px,4vw,48px)] pt-4">
        {eligibility?.eligible ? (
          <div className="flex flex-wrap items-center gap-5 border-2 border-dashed border-board-lime bg-[#111607] p-[clamp(18px,4vw,26px)]">
            <div className="flex h-16 w-16 flex-none items-center justify-center border-2 border-board-lime font-mono text-[22px] font-extrabold text-board-lime">
              ✓
            </div>
            <div className="flex-1">
              <div className="mb-2.5 font-mono text-[17px] font-extrabold tracking-[0.03em] text-board-lime">
                BALLOT OPEN
              </div>
              <div className="font-mono text-[12px] leading-[1.7] text-board-secondary-alt">
                {chosenProject
                  ? `Voting for ${chosenProject.name}. Clock out to seal it.`
                  : "Select the project that deserves the featured launch."}
              </div>
            </div>
            <button
              type="button"
              onClick={handleCast}
              disabled={!choice || busy}
              className="flex-none px-8.5 py-4.5 font-mono text-[13px] font-extrabold tracking-[0.12em] transition active:translate-y-1"
              style={{
                background: choice ? "#CCFF00" : "transparent",
                border: `1px solid ${choice ? "#CCFF00" : "#3D4536"}`,
                color: choice ? "#08090A" : "#5C6553",
                boxShadow: choice ? "0 4px 0 #82A200" : "none",
                cursor: choice && !busy ? "pointer" : "not-allowed",
              }}
            >
              CLOCK IN · CAST BALLOT
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-5 border-2 border-dashed border-board-border-amber bg-board-card-amber-alt p-[clamp(18px,4vw,26px)]">
            <div className="flex h-16 w-16 flex-none items-center justify-center border-2 border-board-border-amber font-mono text-[22px] font-extrabold text-board-amber">
              !
            </div>
            <div className="flex-1">
              <div className="mb-2.5 font-mono text-[17px] font-extrabold tracking-[0.03em] text-board-amber">
                THIS WALLET CAN&apos;T VOTE IN THIS ROUND
              </div>
              <div className="font-mono text-[12px] leading-[1.8] text-[#9A8E6E]">
                You can still watch every pitch, ask questions and follow
                projects.
              </div>
            </div>
          </div>
        )}
      </div>

      <ProfileModal
        project={modalKey ? (modalKey === "A" ? projectA : projectB) : null}
        qa={qaByProject[modalKey ?? ""] ?? []}
        onClose={() => setModalKey(null)}
      />

      <Ceremony
        phase={phase}
        projectName={chosenProject?.name ?? ""}
        onComplete={handleCeremonyComplete}
      />
    </div>
  );
}
