"use client";

import { useState } from "react";
import Link from "next/link";
import type { EligibilitySnapshot } from "@/lib/chain/types";
import type { Project, Room } from "@/lib/types";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { useEscrowBacking } from "@/lib/chain/hooks";
import { useBoardroomStore } from "@/store/useBoardroomStore";

/** Season-1 backing minimum per README Decisions Locked #7 (888
 *  $STONKBROKER) — the prototype's own backing panel showed a stale
 *  "MIN 25", see the plan's Flags section. Max-as-%-of-balance is
 *  still an open question there, so MAX here is a placeholder (full
 *  eligible balance), not a real policy value. */
const BACKING_MIN = 888;
const BACKING_PRESET_MID = 2500;

export function SealedView({
  room,
  chosenProject,
  eligibility,
}: {
  room: Room;
  chosenProject: Project;
  eligibility: EligibilitySnapshot | null;
}) {
  const backingState = useBoardroomStore((s) => s.backing[room.id]);
  const setBackingAmount = useBoardroomStore((s) => s.setBackingAmount);
  const setBackingEscrowed = useBoardroomStore((s) => s.setBackingEscrowed);
  const { phase, escrow, reclaim } = useEscrowBacking(room.id);
  const [detailOpen, setDetailOpen] = useState(false);

  const amount = backingState?.amount ?? BACKING_PRESET_MID;
  const escrowed = backingState?.escrowed ?? false;
  const maxAmount = eligibility?.stonkbrokerBalance ?? BACKING_PRESET_MID;

  const handleEscrow = async () => {
    await escrow(chosenProject.key, amount);
    setBackingAmount(room.id, amount);
    setBackingEscrowed(room.id, true);
  };

  const handleReclaim = () => {
    reclaim();
    setBackingEscrowed(room.id, false);
  };

  return (
    <div className="flex flex-col items-center gap-8 px-[clamp(14px,4vw,48px)] pb-16 pt-12">
      <div className="text-center">
        <div className="font-mono text-[clamp(24px,4.4vw,40px)] font-extrabold leading-[1.15] text-board-heading">
          YOUR VOTE IS CLOCKED IN
        </div>
        <div className="mt-3 max-w-[560px] font-mono text-[13px] leading-[1.8] text-board-secondary">
          Your ballot is sealed with the rest. Nobody sees a tally — not you,
          not the projects, not us — until voting closes and the integrity
          check clears.
        </div>
      </div>

      <div className="w-full max-w-[460px] bg-[#E8E4D4] p-6.5 text-[#15170F] shadow-[0_4px_0_#9A9784]">
        <div className="flex items-baseline justify-between">
          <div className="font-mono text-[13px] font-extrabold tracking-[0.16em]">TIME CARD</div>
          <div className="font-mono text-[10px] text-[#6A6752]">THE BOARDROOM</div>
        </div>
        <div className="my-3.5 border-t-2 border-[#15170F]" />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-x-3 gap-y-3.5 font-mono text-[11px] leading-[1.7] text-[#3A3A2C]">
          <div>
            <div className="text-[9px] tracking-[0.16em] text-[#6A6752]">ROOM</div>
            {room.id} · {room.roundLabel.toUpperCase()}
          </div>
          <div>
            <div className="text-[9px] tracking-[0.16em] text-[#6A6752]">WALLET</div>
            {eligibility?.address ?? "—"}
          </div>
          <div>
            <div className="text-[9px] tracking-[0.16em] text-[#6A6752]">WATCHED</div>
            2 of 2 in full
          </div>
          <div>
            <div className="text-[9px] tracking-[0.16em] text-[#6A6752]">STATUS</div>
            SEALED
          </div>
        </div>
        <div className="my-4 border-t border-dashed border-[#A8A48F]" />
        <div className="flex items-center gap-3.5">
          <img src={chosenProject.mark} alt="" className="h-11 w-11" />
          <div>
            <div className="mb-1.5 font-mono text-[9px] tracking-[0.16em] text-[#6A6752]">
              VOTE RECORDED FOR
            </div>
            <div className="font-mono text-[18px] font-extrabold">{chosenProject.name}</div>
          </div>
          <div className="ml-auto border-2 border-[#B4453A] px-3 py-2 font-mono text-[11px] font-extrabold tracking-[0.1em] text-[#B4453A]">
            SEALED
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1304px] border border-board-border-amber bg-board-card-amber">
        <div className="flex items-center gap-3 border-b border-[#2E2814] px-5.5 py-3.5">
          <span className="block h-2.5 w-2.5 animate-[board-pulse_2.6s_ease-in-out_infinite] bg-board-amber" />
          <span className="font-mono text-[12px] font-extrabold tracking-[0.12em] text-board-amber">
            OPTIONAL · BACK YOUR CONVICTION
          </span>
          <span className="ml-auto font-mono text-[10px] tracking-[0.1em] text-[#A89464]">
            DOES NOT AFFECT THE VOTE
          </span>
        </div>

        {!escrowed ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))]">
            <div className="border-r border-[#2E2814] p-6">
              <div className="max-w-[560px] font-mono text-[17px] font-bold leading-[1.5] text-board-heading">
                Your vote is sealed. Want to put something behind it?
              </div>
              <div className="mt-3 max-w-[560px] font-mono text-[12px] leading-[1.8] text-[#C4B893]">
                Escrow $STONKBROKER on {chosenProject.name}. If they win the
                tournament <span className="text-board-amber">and</span>{" "}
                complete their launch, you claim their token at the same
                fixed rate as everyone else. Any other outcome, you take it
                all back.
              </div>

              <button
                type="button"
                onClick={() => setDetailOpen((v) => !v)}
                className="mt-5 font-mono text-[11px] font-bold tracking-[0.04em] text-board-amber transition hover:text-[#F5D77A]"
              >
                {detailOpen ? "− hide the mechanics" : "+ what happens to my $STONKBROKER?"}
              </button>

              {detailOpen && (
                <div className="mt-4 grid max-w-[560px] gap-3 border-t border-dashed border-[#3E3520] pt-4">
                  <Bullet color="#E5B531" title="IF THEY WIN AND LAUNCH">
                    50% of your accepted $STONKBROKER is permanently burned,
                    50% becomes locked launch liquidity. You claim the
                    project token from a pre-declared community allocation.
                  </Bullet>
                  <Bullet color="#C4CCBB" title="IF BACKING IS OVERSUBSCRIBED">
                    Everyone is cut by the same percentage, pro rata. The
                    unaccepted remainder is yours to reclaim.
                  </Bullet>
                  <Bullet color="#4ADE80" title="NOTHING BURNS EARLY">
                    No $STONKBROKER is consumed until the token is deployed,
                    verified and the launch finalizes — all in one atomic
                    step. If any part fails, refunds open.
                  </Bullet>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="font-mono text-[9px] tracking-[0.16em] text-[#A89464]">COMMIT TO</div>
              <div className="mt-2.5 flex items-center gap-2">
                <img src={chosenProject.mark} alt="" className="h-6.5 w-6.5" />
                <span className="font-mono text-[13px] font-bold text-board-heading">
                  {chosenProject.name}
                </span>
              </div>

              <div className="mt-4 flex items-center border border-[#3E3520] bg-[#0C0A06] px-3.5 py-3.5 transition hover:border-board-amber">
                <span className="font-mono text-[20px] font-extrabold text-board-amber">
                  {amount.toLocaleString()}
                </span>
                <span className="ml-auto font-mono text-[10px] text-[#A89464]">$STONKBROKER</span>
              </div>
              <div className="mt-2 flex justify-between font-mono text-[9px] text-[#9A8E6E]">
                <span>MIN {BACKING_MIN.toLocaleString()}</span>
                <span>MAX {maxAmount.toLocaleString()}</span>
              </div>

              <div className="mt-2.5 flex gap-1.5">
                <PresetButton label={BACKING_MIN.toLocaleString()} onClick={() => setBackingAmount(room.id, BACKING_MIN)} />
                <PresetButton
                  label={BACKING_PRESET_MID.toLocaleString()}
                  onClick={() => setBackingAmount(room.id, BACKING_PRESET_MID)}
                />
                <PresetButton label="MAX" onClick={() => setBackingAmount(room.id, maxAmount)} />
              </div>

              <div className="my-4 border-t border-dashed border-[#3E3520]" />
              <Row label="RATE" value="1 : 10 fixed" />
              <Row label="IF THEY WIN" value={`${(amount * 10).toLocaleString()} tokens`} valueColor="#E5B531" />
              <Row label="YOUR BALANCE" value={maxAmount.toLocaleString()} />

              <button
                type="button"
                onClick={handleEscrow}
                disabled={amount < BACKING_MIN || phase === "escrowing"}
                className="mt-4 w-full bg-board-amber py-3.5 text-center font-mono text-[11px] font-extrabold tracking-[0.1em] text-[#15130A] shadow-[0_3px_0_#8A6A14] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {phase === "escrowing"
                  ? "ESCROWING…"
                  : `ESCROW ${amount.toLocaleString()} $STONKBROKER`}
              </button>
              <div className="mt-2.5 text-center font-mono text-[10px] leading-[1.6] text-[#9A8E6E]">
                Held in noncustodial escrow.
                <br />
                Reclaimable any time before settlement.
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-5 p-[clamp(18px,4vw,26px)]">
            <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-board-amber font-mono text-[24px] font-extrabold text-[#15130A] shadow-[0_3px_0_#8A6A14]">
              ✓
            </div>
            <div className="flex-1">
              <div className="font-mono text-[15px] font-extrabold tracking-[0.04em] text-board-amber">
                YOU&apos;RE IN FOR {amount.toLocaleString()} $STONKBROKER
              </div>
              <div className="mt-2.5 max-w-[620px] font-mono text-[11px] leading-[1.8] text-[#C4B893]">
                Escrowed on {chosenProject.name} · claim on{" "}
                {(amount * 10).toLocaleString()} tokens if they win and
                launch. Your vote is unchanged by this — and you can reclaim
                the full amount any time before settlement.
              </div>
            </div>
            <div className="flex flex-none flex-col items-end gap-2">
              <div className="border border-board-border-amber px-3.5 py-2.5 font-mono text-[9px] font-bold tracking-[0.12em] text-board-amber">
                STATUS · IN ESCROW
              </div>
              <button
                type="button"
                onClick={handleReclaim}
                className="font-mono text-[10px] text-[#9A8E6E] transition hover:text-board-amber"
              >
                ↩ reclaim my commitment
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5">
        <Link
          href="/"
          className="whitespace-nowrap bg-board-lime px-7 py-4 font-mono text-[12px] font-extrabold tracking-[0.12em] text-board-bg transition hover:bg-board-lime-hover"
        >
          NEXT ROOM →
        </Link>
        <Link
          href="/"
          className="whitespace-nowrap border border-[#3D4536] px-6 py-4 font-mono text-[12px] font-bold tracking-[0.1em] text-board-body transition hover:border-board-lime hover:text-board-lime"
        >
          BACK TO LOBBY
        </Link>
      </div>

      <div className="flex w-full max-w-[820px] gap-4 border border-board-border-alt bg-board-card-alt p-5">
        <div className="flex-none font-mono text-[10px] font-extrabold tracking-[0.14em] text-board-success">
          WHAT HAPPENS NOW
        </div>
        <div className="font-mono text-[11px] leading-[1.8] text-board-secondary">
          Voting closes in <CountdownTimer target={room.closesAt} /> —
          suspicious ballots are quarantined and reviewed — the matchup is
          finalized — the result is published and the winner advances.
          Eliminated projects keep their profile, pitch and feedback.
        </div>
      </div>
    </div>
  );
}

function Bullet({
  color,
  title,
  children,
}: {
  color: string;
  title: string;
  children: string;
}) {
  return (
    <div style={{ borderLeft: `2px solid ${color}`, paddingLeft: 12 }}>
      <div className="font-mono text-[9px] font-bold tracking-[0.14em]" style={{ color }}>
        {title}
      </div>
      <div className="mt-1.5 font-mono text-[11px] leading-[1.7] text-[#C4B893]">{children}</div>
    </div>
  );
}

function PresetButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 border border-[#3E3520] py-2 text-center font-mono text-[9px] font-bold text-[#C4B893] transition hover:border-board-amber hover:text-board-amber"
    >
      {label}
    </button>
  );
}

function Row({
  label,
  value,
  valueColor = "#C4B893",
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="flex justify-between font-mono text-[10px] leading-[1.9] text-[#9A8E6E]">
      <span>{label}</span>
      <span style={{ color: valueColor }}>{value}</span>
    </div>
  );
}
