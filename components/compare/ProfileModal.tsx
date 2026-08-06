"use client";

import type { Project, QaItem } from "@/lib/types";

export function ProfileModal({
  project,
  qa,
  onClose,
}: {
  project: Project | null;
  qa: QaItem[];
  onClose: () => void;
}) {
  if (!project) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-auto bg-[rgba(4,6,10,0.86)] px-6 py-12"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[760px] border border-board-border bg-board-card shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
      >
        <div className="sticky top-0 flex items-center gap-3.5 border-b border-[#1A1E17] bg-board-card px-5.5 py-4">
          <span className="font-mono text-[10px] font-bold tracking-[0.16em] text-board-secondary-alt">
            PROJECT PROFILE
          </span>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto flex items-center gap-2 border border-[#3D4536] px-3.5 py-2 font-mono text-[10px] font-bold tracking-[0.1em] text-board-body transition hover:border-board-lime hover:text-board-lime"
          >
            CLOSE ✕
          </button>
        </div>

        <div className="flex items-center gap-4.5 px-5.5 pt-6.5">
          <img src={project.mark} alt="" className="h-[62px] w-[62px] flex-none" />
          <div>
            <div className="font-mono text-[24px] font-extrabold text-board-heading">{project.name}</div>
            <div className="mt-2 font-mono text-[12px] leading-[1.6] text-board-secondary">
              {project.line}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-2.5 p-5.5">
          <Fact label="TEAM" value={project.team} />
          <Fact label="SHIPPED" value={project.shipped} />
          <Fact label="TOKEN PLAN" value={project.tokenPlan} />
          <Fact label="DISCLOSED RISKS" value={project.risksDisclosed} />
        </div>

        <div className="flex flex-col gap-5.5 px-5.5 pb-6.5">
          <div className="border border-board-border bg-board-card-alt p-5.5">
            <div className="font-mono text-[9px] font-bold tracking-[0.14em] text-board-tertiary">
              THESIS
            </div>
            <div className="mt-2.5 max-w-[760px] text-pretty font-mono text-[13px] leading-[1.8] text-board-body">
              {project.thesis}
            </div>
            <div className="mt-4.5 flex flex-wrap gap-2">
              <a
                href={`https://x.com/${project.x.slice(1)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 border border-board-border bg-[#0C0F09] px-2.5 py-1.5 font-mono text-[10px] text-board-body transition hover:border-board-lime hover:text-board-lime"
              >
                <span className="font-mono text-[11px] font-bold">X</span>
                {project.x}
              </a>
              <a
                href={`https://${project.site}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 border border-board-border bg-[#0C0F09] px-2.5 py-1.5 font-mono text-[10px] text-board-body transition hover:border-board-lime hover:text-board-lime"
              >
                {project.site} <span className="text-board-tertiary">↗</span>
              </a>
            </div>
          </div>

          <div>
            <div className="mb-3 font-mono text-[9px] font-bold tracking-[0.14em] text-board-tertiary">
              TEAM
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-2.5">
              {project.people.map((p) => (
                <div
                  key={`${p.name}-${p.role}`}
                  className="flex flex-col gap-2.5 border border-board-border bg-board-card-alt p-3.5"
                >
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-mono text-[12px] font-bold text-board-heading-alt">
                      {p.name}
                    </span>
                    <span className="font-mono text-[10px] text-board-tertiary">{p.role}</span>
                  </div>
                  {p.handle && (
                    <a
                      href={`https://x.com/${p.handle.slice(1)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-fit items-center gap-1.5 border border-board-border bg-[#0C0F09] px-2.5 py-1.5 font-mono text-[10px] text-board-body transition hover:border-board-lime hover:text-board-lime"
                    >
                      <span className="font-mono text-[11px] font-bold">X</span>
                      {p.handle}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-baseline gap-3">
              <div className="font-mono text-[14px] font-extrabold text-board-heading">
                ASK THE TEAM
              </div>
              <div className="font-mono text-[10px] text-board-tertiary">
                {qa.filter((q) => q.answer).length} of {qa.length} answered
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              {qa.map((q) => (
                <div key={q.id} className="border border-board-border bg-board-card-alt p-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[10px] text-board-tertiary">{q.asker}</span>
                    <span className="font-mono text-[10px] text-board-tertiary">▲ {q.upvotes}</span>
                    {q.answer && (
                      <span className="font-mono text-[9px] font-bold tracking-[0.1em] text-board-success">
                        ✓ ANSWERED
                      </span>
                    )}
                  </div>
                  <div className="mt-2 font-mono text-[12px] font-bold leading-[1.5] text-board-heading">
                    {q.question}
                  </div>
                  {q.answer && (
                    <div className="mt-2.5 border-l-2 border-board-lime bg-[#12160D] px-3.5 py-3">
                      <div className="font-mono text-[9px] font-bold tracking-[0.12em] text-board-lime">
                        {q.answeredBy}
                      </div>
                      <div className="mt-1.5 font-mono text-[11px] leading-[1.6] text-board-body">
                        {q.answer}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {qa.length === 0 && (
                <div className="border border-board-border bg-board-card-alt p-4 font-mono text-[11px] text-board-tertiary">
                  No questions yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-5.5 pb-5.5">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-board-lime py-4 text-center font-mono text-[12px] font-extrabold tracking-[0.1em] text-board-bg shadow-[0_3px_0_#82A200] transition active:translate-y-1 active:shadow-none"
          >
            BACK TO THE MATCHUP
          </button>
        </div>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-board-border bg-board-card-alt p-3.5">
      <div className="font-mono text-[9px] text-board-tertiary tracking-[0.14em]">{label}</div>
      <div className="mt-2 font-mono text-[12px] font-bold leading-[1.5] text-board-heading-alt">
        {value}
      </div>
    </div>
  );
}
