"use client";

import Link from "next/link";
import type { Project } from "@/lib/types";
import type { AdminProjectMeta } from "@/lib/mock/adminRoster";
import { useAdminStore } from "@/store/useAdminStore";

export function ProjectsTab({
  projects,
  meta,
}: {
  projects: Record<string, Project>;
  meta: Record<string, AdminProjectMeta>;
}) {
  const inviteVal = useAdminStore((s) => s.inviteVal);
  const setInviteVal = useAdminStore((s) => s.setInviteVal);
  const lastInvite = useAdminStore((s) => s.lastInvite);
  const inviteToken = useAdminStore((s) => s.inviteToken);
  const sendInvite = useAdminStore((s) => s.sendInvite);
  const detailKey = useAdminStore((s) => s.detailKey);
  const openDetail = useAdminStore((s) => s.openDetail);
  const closeDetail = useAdminStore((s) => s.closeDetail);
  const removedKeys = useAdminStore((s) => s.removedKeys);
  const removeConfirmOpen = useAdminStore((s) => s.removeConfirmOpen);
  const toggleRemoveConfirm = useAdminStore((s) => s.toggleRemoveConfirm);
  const doRemove = useAdminStore((s) => s.doRemove);

  const roster = Object.values(projects).filter((p) => !removedKeys[p.key]);
  const detail = detailKey ? { project: projects[detailKey], m: meta[detailKey] } : null;

  return (
    <div className="max-w-[1300px] px-[clamp(14px,4vw,48px)] py-7.5 pb-[70px]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[20px] font-extrabold text-board-heading">PROJECTS</div>
          <div className="mt-1.5 font-mono text-[11px] leading-[1.7] text-board-secondary">
            Invite teams, track onboarding, review what they&apos;ve submitted.
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={inviteVal}
            onChange={(e) => setInviteVal(e.target.value)}
            placeholder="project@email.com or 0x…"
            className="w-[220px] border border-board-border-alt bg-board-card-alt px-3.5 py-2.5 font-mono text-[11px] text-board-heading placeholder:text-board-disabled focus:border-board-lime focus:outline-none"
          />
          <button
            type="button"
            onClick={() => sendInvite(inviteVal)}
            className="border-2 border-board-lime bg-[#141A06] px-4 py-2.5 font-mono text-[10px] font-extrabold tracking-[0.1em] text-board-lime"
          >
            SEND INVITE
          </button>
        </div>
      </div>

      {lastInvite && inviteToken && (
        <div className="mt-3.5 border border-board-border-voting bg-board-card-success p-4">
          <div className="font-mono text-[10px] leading-[1.6] text-board-success">
            Invite sent to {lastInvite} — join link expires in 7 days.
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
            <div className="border border-board-border-alt bg-board-bg px-3 py-2 font-mono text-[10px] text-board-secondary">
              theboardroom.xyz/portal?invite={inviteToken}
            </div>
            <Link
              href={`/portal?invite=${inviteToken}`}
              target="_blank"
              className="font-mono text-[10px] font-bold tracking-[0.06em] text-board-lime transition hover:translate-x-0.5"
            >
              PREVIEW AS PROJECT →
            </Link>
          </div>
        </div>
      )}

      <div className="mt-5.5 border border-board-border-alt bg-board-card-alt">
        <div
          className="grid gap-2.5 border-b border-board-border-alt px-4.5 py-3 font-mono text-[9px] font-bold tracking-[0.12em] text-board-tertiary"
          style={{ gridTemplateColumns: "1.6fr 1fr 1fr 1fr" }}
        >
          <div>PROJECT</div>
          <div>STATUS</div>
          <div>ASSETS COMPLETE</div>
          <div />
        </div>
        {roster.map((p) => {
          const m = meta[p.key];
          return (
            <div
              key={p.key}
              className="grid items-center gap-2.5 border-b border-[#1A1E16] px-4.5 py-3.5 font-mono text-[11px] transition last:border-b-0 hover:bg-[#12160D]"
              style={{ gridTemplateColumns: "1.6fr 1fr 1fr 1fr" }}
            >
              <div className="flex items-center gap-3">
                <img src={p.mark} alt="" className="h-8.5 w-8.5 flex-none" />
                <div>
                  <div className="font-mono text-[12px] font-extrabold text-board-heading">{p.name}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-board-tertiary">{m.founder}</div>
                </div>
              </div>
              <div
                className="font-mono text-[10px] font-bold tracking-[0.08em]"
                style={{ color: m.status === "APPROVED" ? "#4ADE80" : "#E5B531" }}
              >
                {m.status}
              </div>
              <div className="text-board-secondary">{m.assetsDone} / 6</div>
              <button
                type="button"
                onClick={() => openDetail(p.key)}
                className="justify-self-start font-mono text-[10px] font-bold tracking-[0.08em] text-board-lime"
              >
                VIEW →
              </button>
            </div>
          );
        })}
      </div>

      {detail && (
        <div
          onClick={closeDetail}
          className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-[rgba(4,5,4,0.72)] px-4 py-10"
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[760px] border border-board-border-alt bg-board-card">
            <div className="flex items-center gap-4 border-b border-board-border-alt px-6.5 py-5">
              <img src={detail.project.mark} alt="" className="h-12 w-12" />
              <div className="flex-1">
                <div className="font-mono text-[16px] font-extrabold text-board-heading">{detail.project.name}</div>
                <div className="mt-1 font-mono text-[10px] text-board-tertiary">
                  {detail.m.founder} · {detail.m.status}
                </div>
              </div>
              <button type="button" onClick={closeDetail} className="font-mono text-[16px] font-bold text-board-tertiary">
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-4 px-6.5 py-5.5">
              <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
                <DetailFact label="VIDEO PITCH" value={detail.m.videoStatus} color={detail.m.videoStatus === "APPROVED" ? "#4ADE80" : "#E5B531"} />
                <DetailFact label="TRACTION" value={detail.project.shipped} />
                <DetailFact label="X PROFILE" value={detail.project.x} />
                <DetailFact label="WEBSITE" value={detail.project.site} />
              </div>
              <div className="border-t border-[#1A1E16] pt-3.5">
                <div className="mb-2.5 font-mono text-[9px] font-bold tracking-[0.12em] text-board-tertiary">
                  FOUNDER / TEAM SUBMITTED
                </div>
                <div className="font-mono text-[11px] leading-[1.8] text-board-body">{detail.m.teamText}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="border-2 border-board-success px-4 py-2.5 font-mono text-[10px] font-extrabold tracking-[0.1em] text-board-success">
                  APPROVE FOR ROUND
                </button>
                <button type="button" className="border border-board-border-alt px-4 py-2.5 font-mono text-[10px] font-bold tracking-[0.1em] text-board-secondary">
                  REQUEST CHANGES
                </button>
                <button
                  type="button"
                  onClick={toggleRemoveConfirm}
                  className="border border-board-border-error px-4 py-2.5 font-mono text-[10px] font-bold tracking-[0.1em] text-board-error"
                >
                  REMOVE FROM SEASON
                </button>
              </div>
              {removeConfirmOpen && (
                <div className="flex flex-wrap items-center gap-3.5 border border-board-border-error bg-board-card-error p-4">
                  <div className="min-w-[200px] flex-1 font-mono text-[11px] leading-[1.7] text-[#E4C7C1]">
                    Remove {detail.project.name} from Season 01? Any ballots cast for them become
                    void and backing becomes withdrawable. This can&apos;t be undone.
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={doRemove} className="border-2 border-board-error px-3.5 py-2.5 font-mono text-[10px] font-extrabold tracking-[0.08em] text-board-error">
                      YES, REMOVE
                    </button>
                    <button type="button" onClick={toggleRemoveConfirm} className="border border-board-border-alt px-3.5 py-2.5 font-mono text-[10px] font-bold tracking-[0.08em] text-board-secondary">
                      BACK
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailFact({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="border border-board-border-alt px-3.5 py-3">
      <div className="font-mono text-[9px] font-bold tracking-[0.12em] text-board-tertiary">{label}</div>
      <div className="mt-1.5 font-mono text-[11px] font-bold leading-[1.6]" style={{ color: color ?? "#C4CCBB" }}>
        {value}
      </div>
    </div>
  );
}
