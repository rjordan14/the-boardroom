"use client";

import { useState } from "react";
import Link from "next/link";
import type { FloorQuestion } from "@/lib/mock/floor";
import type { Project } from "@/lib/types";
import { useBoardroomStore } from "@/store/useBoardroomStore";

export function FloorPreview({
  questions,
  projects,
}: {
  questions: FloorQuestion[];
  projects: Record<string, Project>;
}) {
  const floorUpvotes = useBoardroomStore((s) => s.floorUpvotes);
  const toggleFloorUpvote = useBoardroomStore((s) => s.toggleFloorUpvote);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="border border-board-border-alt bg-board-card-alt p-5">
      <div className="mb-4 flex items-baseline gap-3 font-mono text-[14px] font-extrabold tracking-[0.06em] text-board-heading">
        FROM THE FLOOR
        <span className="font-mono text-[10px] font-normal tracking-normal text-board-tertiary">
          tap to expand · ▲ to upvote
        </span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3">
        {questions.map((q) => {
          const project = projects[q.projectKey];
          const voted = !!floorUpvotes[q.id];
          const open = openId === q.id;
          const accent = q.answered ? "#4ADE80" : "#8CA05A";
          return (
            <div
              key={q.id}
              className="border bg-board-card transition hover:-translate-y-0.5"
              style={{ borderColor: "#23271F", borderLeftColor: accent, borderLeftWidth: 2 }}
            >
              <div
                className="flex cursor-pointer items-start gap-3.5 px-4 py-3.5"
                onClick={() => setOpenId(open ? null : q.id)}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFloorUpvote(q.id);
                  }}
                  className="flex min-h-11 min-w-11 flex-none flex-col items-center justify-center gap-0.5 border transition active:scale-90"
                  style={{
                    borderColor: voted ? "#CCFF00" : "#2C3327",
                    background: voted ? "#161B08" : "#080A06",
                    color: voted ? "#CCFF00" : "#8A9184",
                  }}
                >
                  <span className="font-mono text-[11px] font-extrabold">▲</span>
                  <span className="font-mono text-[11px] font-bold">
                    {q.upvotes + (voted ? 1 : 0)}
                  </span>
                </button>
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-[11px] leading-[1.6] text-board-body">
                    &quot;{q.question}&quot;
                  </div>
                  <div
                    className="mt-2 font-mono text-[10px] leading-[1.7]"
                    style={{ color: q.answered ? "#4ADE80" : "#6C7563" }}
                  >
                    {q.answered
                      ? `⏳ ${q.answeredBy} answered · 2h ago`
                      : "Awaiting answer · tap for status"}
                  </div>
                </div>
                <span className="flex-none pt-0.5 font-mono text-[10px] font-bold text-board-tertiary">
                  {open ? "−" : "+"}
                </span>
              </div>
              {open && (
                <div className="px-4 pb-4">
                  <div
                    className="px-3.5 py-3 "
                    style={{ borderLeft: `2px solid ${accent}`, background: "#12160D" }}
                  >
                    <div
                      className="font-mono text-[9px] font-extrabold tracking-[0.12em]"
                      style={{ color: accent }}
                    >
                      {q.answered ? q.answeredBy : "STATUS"}
                    </div>
                    <div className="mt-2 font-mono text-[11px] leading-[1.7] text-board-body">
                      {q.answer ??
                        "No answer yet. The team still has time left in the round to respond — unanswered questions stay on the record and show on the profile after the vote closes."}
                    </div>
                  </div>
                  <Link
                    href={`/profile/${project.key}`}
                    className="mt-3 inline-flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.1em] text-board-lime transition hover:translate-x-0.5"
                  >
                    ALL QUESTIONS →
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
