"use client";

import { useRouter } from "next/navigation";
import type { WaitlistApplicant } from "@/lib/mock/waitlist";
import { useAdminStore } from "@/store/useAdminStore";

export function WaitlistTab({ applicants }: { applicants: WaitlistApplicant[] }) {
  const router = useRouter();
  const waitlistDecisions = useAdminStore((s) => s.waitlistDecisions);
  const decideWaitlist = useAdminStore((s) => s.decideWaitlist);
  const sendInvite = useAdminStore((s) => s.sendInvite);

  const visible = applicants.filter((a) => waitlistDecisions[a.id] !== "declined");

  return (
    <div className="max-w-[1200px] px-[clamp(14px,4vw,48px)] py-7.5 pb-[70px]">
      <div className="font-mono text-[20px] font-extrabold text-board-heading">SEASON 02 WAITLIST</div>
      <div className="mt-2 font-mono text-[11px] leading-[1.7] text-board-secondary">
        Applications from the public &quot;Apply&quot; page. Inviting a project here sends the
        same onboarding link as Projects → Send Invite.
      </div>

      <div className="mt-5.5 border border-board-border-alt bg-board-card-alt">
        <div
          className="grid gap-2.5 border-b border-board-border-alt px-4.5 py-3 font-mono text-[9px] font-bold tracking-[0.12em] text-board-tertiary"
          style={{ gridTemplateColumns: "1.6fr 1.6fr 1fr 1fr" }}
        >
          <div>PROJECT</div>
          <div>ONE-LINER</div>
          <div>SUBMITTED</div>
          <div />
        </div>
        {visible.map((w) => {
          const invited = waitlistDecisions[w.id] === "invited";
          return (
            <div
              key={w.id}
              className="grid items-center gap-2.5 border-b border-[#1A1E16] px-4.5 py-3.5 font-mono text-[11px] transition last:border-b-0 hover:bg-[#12160D]"
              style={{ gridTemplateColumns: "1.6fr 1.6fr 1fr 1fr" }}
            >
              <div>
                <div className="font-mono text-[12px] font-extrabold text-board-heading">{w.name}</div>
                <div className="mt-0.5 font-mono text-[10px] text-board-tertiary">
                  {w.founder} · {w.x}
                </div>
              </div>
              <div className="text-board-secondary">{w.line}</div>
              <div className="font-mono text-[10px] text-board-tertiary">{w.when}</div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    decideWaitlist(w.id, "invited");
                    sendInvite(w.founder);
                    router.push("/admin/projects");
                  }}
                  className="border-2 border-board-lime px-3 py-2 font-mono text-[10px] font-extrabold tracking-[0.06em] text-board-lime"
                >
                  {invited ? "INVITED" : "INVITE"}
                </button>
                <button
                  type="button"
                  onClick={() => decideWaitlist(w.id, "declined")}
                  className="border border-board-border-alt px-3 py-2 font-mono text-[10px] font-bold tracking-[0.06em] text-board-secondary"
                >
                  DECLINE
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
