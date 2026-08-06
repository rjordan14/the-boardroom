"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { QaItem } from "@/lib/types";
import { usePortalStore } from "@/store/usePortalStore";

const TABS = [
  { href: "/portal", label: "OVERVIEW" },
  { href: "/portal/video", label: "PITCH VIDEO" },
  { href: "/portal/info", label: "PROJECT INFO" },
  { href: "/portal/team", label: "TEAM" },
  { href: "/portal/qa", label: "Q&A" },
  { href: "/portal/backing", label: "BACKING" },
  { href: "/portal/notifications", label: "NOTIFICATIONS" },
];

export function PortalGateShell({ children, qa }: { children: ReactNode; qa: QaItem[] }) {
  return (
    <Suspense fallback={null}>
      <PortalGateInner qa={qa}>{children}</PortalGateInner>
    </Suspense>
  );
}

function PortalGateInner({ children, qa }: { children: ReactNode; qa: QaItem[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const hasInvite = searchParams.has("invite");

  const gate = usePortalStore((s) => s.gate);
  const connectProject = usePortalStore((s) => s.connectProject);
  const onboarded = usePortalStore((s) => s.onboarded);
  const setOnboarded = usePortalStore((s) => s.setOnboarded);
  const finishOnboard = usePortalStore((s) => s.finishOnboard);
  const answers = usePortalStore((s) => s.answers);

  useEffect(() => {
    if (onboarded === null) setOnboarded(!hasInvite);
  }, [hasInvite, onboarded, setOnboarded]);

  const [onboardName, setOnboardName] = useState("");
  const [onboardFounder, setOnboardFounder] = useState("");
  const [onboardX, setOnboardX] = useState("");

  const unansweredCount = qa.filter((q) => !q.answer && !answers[q.id]).length;

  if (gate === "locked") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-board-bg px-5 py-20">
        <div className="w-full max-w-[400px] border border-board-border-alt bg-board-card-alt p-9 text-center">
          <div className="font-mono text-[14px] font-extrabold tracking-[0.12em] text-board-lime">
            THE BOARDROOM
          </div>
          <div className="mt-2 font-mono text-[10px] font-bold tracking-[0.14em] text-board-tertiary">
            PROJECT PORTAL
          </div>
          <div className="mt-4.5 font-mono text-[11px] leading-[1.7] text-board-secondary">
            {hasInvite
              ? "You've been invited to join Season 01. Connect the project's wallet to claim your room."
              : "Connect the wallet your project registered with to manage your Boardroom listing."}
          </div>
          <button
            type="button"
            onClick={connectProject}
            className="mt-5 w-full border-2 border-board-lime bg-[#141A06] py-3.5 font-mono text-[11px] font-extrabold tracking-[0.12em] text-board-lime transition hover:bg-[#1A2208]"
          >
            CONNECT WALLET
          </button>
        </div>
      </div>
    );
  }

  if (onboarded === false) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-board-bg px-5 py-20">
        <div className="w-full max-w-[460px] border border-board-border-alt bg-board-card-alt p-9">
          <div className="font-mono text-[10px] font-bold tracking-[0.14em] text-board-secondary-alt">
            CLAIM YOUR INVITE
          </div>
          <div className="mt-2.5 font-mono text-[18px] font-extrabold text-board-heading">
            Welcome to Season 01
          </div>
          <div className="mt-2.5 font-mono text-[11px] leading-[1.7] text-board-secondary">
            Wallet 0x25…1A50 connected. Fill in the basics to claim your room — you can edit
            everything else once you&apos;re in.
          </div>
          <div className="mt-5.5 flex flex-col gap-3.5">
            <OnboardField label="PROJECT NAME" value={onboardName} onChange={setOnboardName} placeholder="e.g. LEDGERBOY" bold />
            <OnboardField label="FOUNDER NAME" value={onboardFounder} onChange={setOnboardFounder} placeholder="Your name" />
            <OnboardField label="X PROFILE" value={onboardX} onChange={setOnboardX} placeholder="@handle" />
          </div>
          <button
            type="button"
            onClick={finishOnboard}
            className="mt-5.5 w-full border-2 border-board-lime bg-[#141A06] py-3.5 text-center font-mono text-[11px] font-extrabold tracking-[0.12em] text-board-lime transition hover:bg-[#1A2208]"
          >
            ENTER PORTAL
          </button>
          <div className="mt-3 text-center font-mono text-[9px] leading-[1.6] text-board-disabled">
            Pitch video, traction, team and Q&amp;A come next — assigned room: Quarterfinal 01
          </div>
        </div>
      </div>
    );
  }

  if (onboarded === null) return null;

  return (
    <div>
      <div className="sticky top-0 z-40 flex flex-wrap items-center gap-2 border-b border-[#161914] bg-board-bg px-[clamp(14px,4vw,48px)] py-4">
        <div className="mr-2.5 border-b-2 border-board-lime pb-1 font-mono text-[13px] font-extrabold tracking-[0.12em] text-board-lime">
          THE BOARDROOM
        </div>
        <div className="bg-[#8CA05A] px-2 py-1.5 font-mono text-[10px] font-bold tracking-[0.1em] text-[#08090A]">
          PROJECT PORTAL
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="block h-2 w-2 animate-[board-pulse_2.2s_ease-in-out_infinite] rounded-full bg-board-success" />
          <span className="font-mono text-[10px] font-bold tracking-[0.1em] text-board-success">
            APPROVED · LIVE
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
              className="flex items-center gap-1.5 px-4 py-2.5 font-mono text-[10px] font-bold tracking-[0.1em]"
              style={{
                color: active ? "#CCFF00" : "#6C7563",
                borderBottom: `2px solid ${active ? "#CCFF00" : "transparent"}`,
              }}
            >
              {tab.label}
              {tab.label === "Q&A" && unansweredCount > 0 && (
                <span className="bg-board-amber px-1.5 py-0.5 font-mono text-[9px] font-extrabold text-[#12100A]">
                  {unansweredCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}

function OnboardField({
  label,
  value,
  onChange,
  placeholder,
  bold,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  bold?: boolean;
}) {
  return (
    <div>
      <label className="font-mono text-[9px] font-bold tracking-[0.12em] text-board-tertiary">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={
          "mt-2 w-full border border-board-border-alt bg-board-bg px-3.5 py-3 font-mono text-[12px] text-board-heading placeholder:text-board-disabled focus:border-board-lime focus:outline-none " +
          (bold ? "font-bold" : "font-normal")
        }
      />
    </div>
  );
}
