"use client";

import type { Project, QaItem } from "@/lib/types";
import { useAdminStore } from "@/store/useAdminStore";

export function QaModerationTab({ qa, projects }: { qa: QaItem[]; projects: Record<string, Project> }) {
  const qaHidden = useAdminStore((s) => s.qaHidden);
  const toggleQaHidden = useAdminStore((s) => s.toggleQaHidden);

  return (
    <div className="max-w-[1100px] px-[clamp(14px,4vw,48px)] py-7.5 pb-[70px]">
      <div className="font-mono text-[20px] font-extrabold text-board-heading">Q&amp;A MODERATION</div>
      <div className="mt-2 font-mono text-[11px] leading-[1.7] text-board-secondary">
        Every question posts publicly by default. Hide spam or abuse; unanswered questions
        otherwise stay on the permanent record.
      </div>

      <div className="mt-5.5 flex flex-col gap-2.5">
        {qa.map((q) => {
          const hidden = !!qaHidden[q.id];
          const project = projects[q.projectKey];
          const borderColor = q.flag ? "#F0644B" : "transparent";
          return (
            <div
              key={q.id}
              className="flex flex-wrap items-start gap-4 border border-board-border-alt bg-board-card-alt p-4"
              style={{ borderLeft: `2px solid ${borderColor}` }}
            >
              <div className="min-w-[240px] flex-1">
                <div className="font-mono text-[9px] font-bold tracking-[0.1em] text-board-tertiary">
                  {project.name} · {q.asker}
                </div>
                <div className="mt-1.5 font-mono text-[11px] leading-[1.6] text-board-body">{q.question}</div>
                {q.answer && (
                  <div className="mt-2 font-mono text-[10px] leading-[1.6] text-board-success">
                    ⏳ answered · {q.answer}
                  </div>
                )}
              </div>
              {q.flag && (
                <div className="font-mono text-[10px] font-bold tracking-[0.08em] text-board-error">{q.flag}</div>
              )}
              <div className="flex gap-2">
                <button type="button" className="border border-board-border-alt px-3 py-2 font-mono text-[10px] font-bold tracking-[0.06em] text-board-secondary">
                  NOTIFY TEAM
                </button>
                <button
                  type="button"
                  onClick={() => toggleQaHidden(q.id)}
                  className="border border-board-border-error px-3 py-2 font-mono text-[10px] font-bold tracking-[0.06em] text-board-error"
                >
                  {hidden ? "UNHIDE" : "HIDE"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
