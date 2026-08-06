"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminStore } from "@/store/useAdminStore";

const TABS = [
  { href: "/admin", label: "OVERVIEW" },
  { href: "/admin/setup", label: "TOURNAMENT SETUP" },
  { href: "/admin/bracket", label: "BRACKET" },
  { href: "/admin/projects", label: "PROJECTS" },
  { href: "/admin/submissions", label: "SUBMISSIONS" },
  { href: "/admin/qa", label: "Q&A MODERATION" },
  { href: "/admin/waitlist", label: "WAITLIST" },
];

const STATUS_COLOR: Record<string, string> = {
  live: "#4ADE80",
  paused: "#E5B531",
  ended: "#6C7563",
};

export function AdminGateShell({ children }: { children: ReactNode }) {
  const gate = useAdminStore((s) => s.gate);
  const connectAdmin = useAdminStore((s) => s.connectAdmin);
  const connectWrongWallet = useAdminStore((s) => s.connectWrongWallet);
  const tourStatus = useAdminStore((s) => s.tourStatus);
  const pathname = usePathname();

  if (gate !== "open") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-board-bg px-5 py-20">
        <div className="w-full max-w-[400px] border border-board-border-alt bg-board-card-alt p-9 text-center">
          <div className="font-mono text-[14px] font-extrabold tracking-[0.12em] text-board-lime">
            THE BOARDROOM
          </div>
          <div className="mt-2 font-mono text-[10px] font-bold tracking-[0.14em] text-board-tertiary">
            ADMIN ACCESS
          </div>
          <div className="mt-4.5 font-mono text-[11px] leading-[1.7] text-board-secondary">
            Connect the operator wallet to manage this tournament. Only wallets on the operator
            allowlist can enter.
          </div>
          {gate === "denied" && (
            <div className="mt-4 border border-board-border-error px-3 py-2.5 font-mono text-[10px] leading-[1.6] text-board-error">
              0x9c1…07B is not on the operator allowlist.
            </div>
          )}
          <button
            type="button"
            onClick={connectAdmin}
            className="mt-5 w-full border-2 border-board-lime bg-[#141A06] py-3.5 font-mono text-[11px] font-extrabold tracking-[0.12em] text-board-lime transition hover:bg-[#1A2208]"
          >
            CONNECT WALLET
          </button>
          <button
            type="button"
            onClick={connectWrongWallet}
            className="mt-2.5 font-mono text-[10px] text-board-disabled transition hover:text-board-tertiary"
          >
            try a non-operator wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 z-40 flex flex-wrap items-center gap-2 border-b border-[#161914] bg-board-bg px-[clamp(14px,4vw,48px)] py-4">
        <div className="mr-2.5 border-b-2 border-board-lime pb-1 font-mono text-[13px] font-extrabold tracking-[0.12em] text-board-lime">
          THE BOARDROOM
        </div>
        <div className="bg-board-amber px-2 py-1.5 font-mono text-[10px] font-bold tracking-[0.1em] text-[#08090A]">
          ADMIN
        </div>
        <Link href="/" className="ml-4 font-mono text-[11px] text-board-tertiary transition hover:text-board-lime">
          ← BACK TO PUBLIC APP
        </Link>
        <div className="ml-auto flex items-center gap-3.5">
          <div className="border border-board-border px-3.5 py-2.5 font-mono text-[11px] text-board-body">
            0x25…1A50 · OPERATOR
          </div>
          <span
            className="block h-2 w-2 animate-[board-pulse_2.2s_ease-in-out_infinite]"
            style={{ background: STATUS_COLOR[tourStatus] }}
          />
          <span
            className="font-mono text-[10px] font-bold tracking-[0.12em]"
            style={{ color: STATUS_COLOR[tourStatus] }}
          >
            {tourStatus.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 border-b border-[#161914] px-[clamp(14px,4vw,48px)] pt-3.5">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="px-4 py-2.5 font-mono text-[10px] font-bold tracking-[0.1em]"
              style={{
                color: active ? "#CCFF00" : "#6C7563",
                borderBottom: `2px solid ${active ? "#CCFF00" : "transparent"}`,
              }}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}
