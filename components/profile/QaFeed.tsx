"use client";

import { useMemo, useState } from "react";
import type { QaItem } from "@/lib/types";
import { getSubmittedQuestions, useBoardroomStore } from "@/store/useBoardroomStore";
import { SparkBurst } from "@/components/ui/SparkBurst";
import { formatRelativeTime } from "@/lib/utils/format";

interface FeedItem {
  id: string;
  asker: string;
  upvotes: number;
  question: string;
  answer: string | null;
  answeredBy: string | null;
  postedAt: number;
  // Only true for a question you posted yourself this session — those
  // are the only ones you can retract (nothing else is "yours" to
  // delete, and there's no moderation surface for the mock seed data).
  isLocal: boolean;
}

type QaFilter = "all" | "unanswered" | "answered";

export function QaFeed({ projectKey, projectName, qa }: { projectKey: string; projectName: string; qa: QaItem[] }) {
  const qaUpvotes = useBoardroomStore((s) => s.qaUpvotes);
  const toggleQaUpvote = useBoardroomStore((s) => s.toggleQaUpvote);
  const submitted = useBoardroomStore((s) => getSubmittedQuestions(s.submittedQuestions, projectKey));
  const submitQuestion = useBoardroomStore((s) => s.submitQuestion);
  const retractQuestion = useBoardroomStore((s) => s.retractQuestion);
  const [draft, setDraft] = useState("");
  const [justPosted, setJustPosted] = useState(false);
  const [sparkingId, setSparkingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<QaFilter>("all");

  const allItems: FeedItem[] = useMemo(
    () =>
      [
        ...qa.map((q) => ({
          id: q.id,
          asker: q.asker,
          upvotes: q.upvotes,
          question: q.question,
          answer: q.answer,
          answeredBy: q.answeredBy,
          postedAt: q.postedAt,
          isLocal: false,
        })),
        ...submitted.map((q) => ({
          id: q.id,
          asker: "you",
          upvotes: 0,
          question: q.question,
          answer: null,
          answeredBy: null,
          postedAt: q.askedAt,
          isLocal: true,
        })),
      ]
        .map((item) => ({ ...item, upvotes: item.upvotes + (qaUpvotes[item.id] ? 1 : 0) }))
        .sort((a, b) => b.upvotes - a.upvotes),
    [qa, submitted, qaUpvotes]
  );

  const answeredCount = allItems.filter((q) => q.answer).length;
  const unansweredCount = allItems.length - answeredCount;
  const visibleItems = allItems.filter((item) => {
    if (filter === "answered") return !!item.answer;
    if (filter === "unanswered") return !item.answer;
    return true;
  });

  const post = () => {
    const text = draft.trim();
    if (!text) return;
    submitQuestion(projectKey, text);
    setDraft("");
    setJustPosted(true);
    setTimeout(() => setJustPosted(false), 3000);
  };

  return (
    <div>
      <div className="mb-4 flex items-baseline gap-3.5">
        <div className="font-mono text-[18px] font-extrabold tracking-[0.02em] text-board-heading">
          ASK THE TEAM
        </div>
        <div className="font-mono text-[11px] text-board-tertiary">
          {answeredCount} of {allItems.length} answered
        </div>
      </div>

      {allItems.length > 0 && (
        <div className="mb-4 flex gap-1.5">
          <QaFilterTab active={filter === "all"} onClick={() => setFilter("all")}>
            ALL <span className="opacity-60">· {allItems.length}</span>
          </QaFilterTab>
          <QaFilterTab active={filter === "unanswered"} onClick={() => setFilter("unanswered")}>
            AWAITING ANSWER <span className="opacity-60">· {unansweredCount}</span>
          </QaFilterTab>
          <QaFilterTab active={filter === "answered"} onClick={() => setFilter("answered")}>
            ANSWERED <span className="opacity-60">· {answeredCount}</span>
          </QaFilterTab>
        </div>
      )}

      <div className="mb-5.5 border border-board-border-alt bg-board-card-alt p-4.5">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Ask ${projectName}'s team something — answers post here, visible to everyone.`}
          rows={2}
          className="min-h-[56px] w-full resize-y border border-board-border-alt bg-[#080A06] p-3 font-mono text-[12px] leading-[1.6] text-board-heading-alt placeholder:text-board-disabled focus:border-board-lime focus:outline-none"
        />
        <div className="mt-2.5 flex items-center gap-3">
          <div className="font-mono text-[10px] text-board-tertiary">
            Questions are public. The team answers on their own time.
          </div>
          <button
            type="button"
            onClick={post}
            disabled={!draft.trim()}
            className="ml-auto flex-none whitespace-nowrap bg-board-lime px-5 py-2.5 font-mono text-[11px] font-extrabold tracking-[0.1em] text-board-bg transition hover:bg-board-lime-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            POST QUESTION
          </button>
        </div>
        {justPosted && (
          <div className="mt-2.5 font-mono text-[11px] font-bold text-board-success">
            ✓ Posted — visible below.
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2.5">
        {allItems.length === 0 && (
          <div className="border border-board-border-alt bg-board-card-alt p-4.5 font-mono text-[11px] text-board-tertiary">
            No questions yet. Be the first — the answer goes on the permanent record.
          </div>
        )}
        {allItems.length > 0 && visibleItems.length === 0 && (
          <div className="border border-board-border-alt bg-board-card-alt p-4.5 font-mono text-[11px] text-board-tertiary">
            Nothing in this view yet.
          </div>
        )}
        {visibleItems.map((item) => (
          <div key={item.id} className="flex gap-3.5 border border-board-border-alt bg-board-card-alt p-4.5">
            <button
              type="button"
              onClick={() => {
                if (!qaUpvotes[item.id]) {
                  setSparkingId(item.id);
                  setTimeout(() => setSparkingId((cur) => (cur === item.id ? null : cur)), 500);
                }
                toggleQaUpvote(item.id);
              }}
              aria-label={qaUpvotes[item.id] ? "Remove upvote" : "Upvote this question"}
              title={qaUpvotes[item.id] ? "Remove upvote" : "Upvote this question"}
              className={`relative flex w-11 flex-none flex-col items-center gap-0.5 border py-2 transition hover:-translate-y-0.5 ${
                qaUpvotes[item.id]
                  ? "border-board-lime bg-[#141A06] text-board-lime"
                  : "border-board-border-alt text-[#C4CCBB] hover:border-[#4A5A2C] hover:text-board-lime"
              }`}
            >
              {sparkingId === item.id && <SparkBurst />}
              <span className="font-mono text-[13px] font-extrabold leading-none">▲</span>
              <span className="font-mono text-[12px] font-bold leading-none">{item.upvotes}</span>
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {item.answer ? (
                  <span className="inline-flex items-center gap-1 bg-[#12200C] px-2 py-0.5 font-mono text-[9px] font-extrabold tracking-[0.1em] text-board-success">
                    ✓ ANSWERED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 border border-[#3D3826] bg-[#1A1608] px-2 py-0.5 font-mono text-[9px] font-extrabold tracking-[0.1em] text-board-amber">
                    ● AWAITING ANSWER
                  </span>
                )}
                <span className="font-mono text-[10px] text-board-tertiary">{item.asker}</span>
                <span className="font-mono text-[9px] text-board-disabled">{formatRelativeTime(item.postedAt)}</span>
                {item.isLocal && (
                  <button
                    type="button"
                    onClick={() => retractQuestion(projectKey, item.id)}
                    aria-label="Delete this question"
                    title="Delete this question"
                    className="ml-auto flex-none font-mono text-[9px] font-bold text-board-tertiary transition hover:text-board-error"
                  >
                    ✕ DELETE
                  </button>
                )}
              </div>
              <div className="mt-2 font-mono text-[13px] font-bold leading-[1.5] text-board-heading">
                {item.question}
              </div>
              {item.answer && (
                <div className="mt-3 border-l-2 border-board-lime bg-[#12160D] px-3.5 py-3">
                  <div className="font-mono text-[9px] font-bold tracking-[0.12em] text-board-lime">
                    {item.answeredBy}
                  </div>
                  <div className="mt-1.5 font-mono text-[12px] leading-[1.6] text-board-body">
                    {item.answer}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QaFilterTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-3 py-1.5 font-mono text-[9px] font-bold tracking-[0.08em] transition ${
        active
          ? "border-board-lime bg-[#141A06] text-board-lime"
          : "border-board-border-alt text-board-secondary hover:border-[#4A5A2C] hover:text-board-heading"
      }`}
    >
      {children}
    </button>
  );
}
