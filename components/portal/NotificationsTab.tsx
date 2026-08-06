"use client";

import { usePortalStore } from "@/store/usePortalStore";

const ROWS: { key: "q" | "b" | "a" | "r"; label: string }[] = [
  { key: "q", label: "New question submitted" },
  { key: "b", label: "New backing received" },
  { key: "a", label: "Admin requests changes" },
  { key: "r", label: "Round results" },
];

export function NotificationsTab() {
  const notif = usePortalStore((s) => s.notif);
  const toggleNotif = usePortalStore((s) => s.toggleNotif);

  return (
    <div className="max-w-[700px] px-[clamp(14px,4vw,48px)] py-7.5 pb-[70px]">
      <div className="font-mono text-[20px] font-extrabold text-board-heading">NOTIFICATIONS</div>
      <div className="mt-2 font-mono text-[11px] leading-[1.7] text-board-secondary">
        Where to reach your team while the round is live.
      </div>

      <div className="mt-6.5 flex flex-col gap-3.5">
        <div>
          <label className="font-mono text-[9px] font-bold tracking-[0.14em] text-board-tertiary">EMAIL</label>
          <input
            defaultValue="team@ledgerboy.xyz"
            className="mt-2 w-full border border-board-border-alt bg-board-card-alt px-3.5 py-3 font-mono text-[12px] text-board-heading"
          />
        </div>
        <div className="flex flex-col gap-3 border border-board-border-alt bg-board-card-alt p-4.5">
          {ROWS.map((row) => {
            const on = notif[row.key];
            return (
              <div key={row.key} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleNotif(row.key)}
                  className="relative h-5 w-9 flex-none rounded-full transition-colors"
                  style={{ background: on ? "#CCFF00" : "#2C3327" }}
                >
                  <span
                    className="absolute top-0.5 h-4 w-4 rounded-full bg-board-bg transition-all"
                    style={{ left: on ? "18px" : "2px" }}
                  />
                </button>
                <span className="font-mono text-[11px] text-board-body">{row.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
