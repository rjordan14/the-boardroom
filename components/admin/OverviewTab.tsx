"use client";

import { useAdminStore } from "@/store/useAdminStore";

const STATUS_COLOR: Record<string, string> = { live: "#4ADE80", paused: "#E5B531", ended: "#6C7563" };
const STATUS_LABEL: Record<string, string> = { live: "LIVE", paused: "PAUSED", ended: "ENDED" };

const ACTIVITY = [
  { mark: "✓", color: "#4ADE80", text: 'LEDGERBOY answered "Who holds the multisig keys?"', time: "12m ago" },
  { mark: "$", color: "#E5B531", text: "0x2f…91A backed 5,000 $STONKBROKER on TICKERTAPE", time: "40m ago" },
  { mark: "!", color: "#F0644B", text: "Question flagged as spam on SEVEN FIGURE SODA", time: "1h ago" },
  { mark: "✓", color: "#4ADE80", text: "SEVEN FIGURE SODA submitted video pitch", time: "6h ago" },
];

export function OverviewTab() {
  const tourStatus = useAdminStore((s) => s.tourStatus);
  const togglePause = useAdminStore((s) => s.togglePause);
  const cancelOpen = useAdminStore((s) => s.cancelOpen);
  const toggleCancelConfirm = useAdminStore((s) => s.toggleCancelConfirm);
  const doCancel = useAdminStore((s) => s.doCancel);
  const color = STATUS_COLOR[tourStatus];

  return (
    <div className="max-w-[1300px] px-[clamp(14px,4vw,48px)] py-7.5 pb-[70px]">
      <div className="flex flex-wrap items-center gap-6 border-2 bg-board-card-alt p-6.5" style={{ borderColor: color }}>
        <div className="min-w-[240px] flex-1">
          <div className="font-mono text-[9px] font-bold tracking-[0.16em] text-board-tertiary">
            SEASON 01 · QUARTERFINAL
          </div>
          <div className="mt-2 font-mono text-[20px] font-extrabold text-board-heading">
            {STATUS_LABEL[tourStatus]}
          </div>
          <div className="mt-2 font-mono text-[11px] leading-[1.7] text-board-secondary">
            8 projects · Quarterfinal opened Jul 8 · closes in 2d 07:03
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={togglePause}
            className="border border-board-border-amber px-4.5 py-3 font-mono text-[10px] font-bold tracking-[0.1em] text-board-amber"
          >
            {tourStatus === "paused" ? "RESUME TOURNAMENT" : "PAUSE TOURNAMENT"}
          </button>
          <button
            type="button"
            onClick={toggleCancelConfirm}
            className="border border-board-border-error px-4.5 py-3 font-mono text-[10px] font-bold tracking-[0.1em] text-board-error"
          >
            CANCEL TOURNAMENT
          </button>
        </div>
      </div>

      {cancelOpen && (
        <div className="mt-3.5 flex flex-wrap items-center gap-4 border border-board-border-error bg-board-card-error p-4">
          <div className="min-w-[220px] flex-1 font-mono text-[11px] leading-[1.7] text-[#E4C7C1]">
            Cancel Season 01? All open ballots void. Escrowed backing becomes withdrawable. This
            can&apos;t be undone.
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={doCancel} className="border-2 border-board-error px-4 py-2.5 font-mono text-[10px] font-extrabold tracking-[0.1em] text-board-error">
              YES, CANCEL
            </button>
            <button type="button" onClick={toggleCancelConfirm} className="border border-board-border-alt px-4 py-2.5 font-mono text-[10px] font-bold tracking-[0.1em] text-board-secondary">
              BACK
            </button>
          </div>
        </div>
      )}

      <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
        <Stat label="BALLOTS SEALED" value="24,118" color="#CCFF00" />
        <Stat label="$STONKBROKER ESCROWED" value="1,402,000" color="#E5B531" />
        <Stat label="PROJECTS LIVE" value="8 / 8" color="#F2F5EF" />
        <Stat label="OPEN QUESTIONS" value="6" color="#F2F5EF" />
      </div>

      <div className="mb-3.5 mt-8.5 font-mono text-[14px] font-extrabold tracking-[0.06em] text-board-heading">
        RECENT ACTIVITY
      </div>
      <div className="border border-board-border-alt bg-board-card-alt">
        {ACTIVITY.map((a) => (
          <div key={a.text} className="flex items-center gap-3.5 border-b border-[#1A1E16] px-4.5 py-3.5 font-mono text-[11px] last:border-b-0">
            <span style={{ color: a.color }}>{a.mark}</span>
            <span className="flex-1 text-board-body">{a.text}</span>
            <span className="text-board-disabled">{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="border border-board-border-alt bg-board-card-alt p-4.5">
      <div className="font-mono text-[9px] font-bold tracking-[0.14em] text-board-tertiary">{label}</div>
      <div className="mt-2.5 font-mono text-[26px] font-extrabold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
