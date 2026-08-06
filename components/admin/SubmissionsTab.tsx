"use client";

import type { Project } from "@/lib/types";
import type { Submission } from "@/lib/mock/submissions";
import { useAdminStore } from "@/store/useAdminStore";

export function SubmissionsTab({
  submissions,
  projects,
}: {
  submissions: Submission[];
  projects: Record<string, Project>;
}) {
  const subDecisions = useAdminStore((s) => s.subDecisions);
  const decideSubmission = useAdminStore((s) => s.decideSubmission);

  return (
    <div className="max-w-[1100px] px-[clamp(14px,4vw,48px)] py-7.5 pb-[70px]">
      <div className="font-mono text-[20px] font-extrabold text-board-heading">
        VIDEO PITCH SUBMISSIONS
      </div>
      <div className="mt-2 font-mono text-[11px] leading-[1.7] text-board-secondary">
        Review before a pitch goes live in a room. Once approved it appears on the public compare
        screen.
      </div>

      <div className="mt-5.5 flex flex-col gap-2.5">
        {submissions.map((s) => {
          const project = projects[s.projectKey];
          const decision = subDecisions[s.id];
          const status = decision === "approved" ? "APPROVED" : decision === "rejected" ? "REJECTED" : "PENDING";
          const color = decision === "approved" ? "#4ADE80" : decision === "rejected" ? "#F0644B" : "#E5B531";
          return (
            <div
              key={s.id}
              className="flex flex-wrap items-center gap-4 border border-board-border-alt bg-board-card-alt p-4"
            >
              <img src={project.mark} alt="" className="h-10 w-10 flex-none" />
              <div className="min-w-[180px] flex-1">
                <div className="font-mono text-[12px] font-extrabold text-board-heading">{project.name}</div>
                <div className="mt-0.5 font-mono text-[10px] text-board-tertiary">
                  Submitted {s.when} · {s.length}
                </div>
              </div>
              <div className="border border-board-border-alt px-6 py-2.5 font-mono text-[10px] font-bold tracking-[0.08em] text-board-secondary">
                ▶ WATCH
              </div>
              <div className="min-w-[90px] font-mono text-[10px] font-bold tracking-[0.08em]" style={{ color }}>
                {status}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => decideSubmission(s.id, "approved")}
                  className="border-2 border-board-success px-3.5 py-2.5 font-mono text-[10px] font-extrabold tracking-[0.08em] text-board-success"
                >
                  APPROVE
                </button>
                <button
                  type="button"
                  onClick={() => decideSubmission(s.id, "rejected")}
                  className="border border-board-border-error px-3.5 py-2.5 font-mono text-[10px] font-bold tracking-[0.08em] text-board-error"
                >
                  REJECT
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
