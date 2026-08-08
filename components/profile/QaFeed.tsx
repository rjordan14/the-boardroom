"use client";

import { useState } from "react";
import type { QaItem } from "@/lib/types";
import { getSubmittedQuestions, useBoardroomStore } from "@/store/useBoardroomStore";
import { SparkBurst } from "@/components/ui/SparkBurst";
import { QaBattle } from "@/components/profile/QaBattle";

interface FeedItem {
  id: string;
  asker: string;
  upvotes: number;
  question: string;
  answer: string | null;
  answeredBy: string | null;
}

export function QaFeed({ projectKey, projectName, qa }: { projectKey: string; projectName: string; qa: QaItem[] }) {
  const qaUpvotes = useBoardroomStore((s) => s.qaUpvotes);
  const toggleQaUpvote = useBoardroomStore((s) => s.toggleQaUpvote);
  const submitted = useBoardroomStore((s) => getSubmittedQuestions(s.submittedQuestions, projectKey));
  const submitQuestion = useBoardroomStore((s) => s.submitQuestion);
  const crown = useBoardroomStore((s) => s.crowns[projectKey]);
  const [draft, setDraft] = useState("");
  const [justPosted, setJustPosted] = useState(false);
  const [sparkingId, setSparkingId] = useState<string | null>(null);
  const [crownCopied, setCrownCopied] = useState(false);

  const shareCrown = async () => {
    if (!crown) return;
    try {
      const mine = crown.asker === "you";
      const text = mine
        ? `👑 My question just got crowned best question on ${projectName} in THE BOARDROOM: "${crown.question}"\n${window.location.origin}/profile/${projectKey}`
        : `👑 The crowd just crowned the best question on ${projectName} in THE BOARDROOM: "${crown.question}"\n${window.location.origin}/profile/${projectKey}`;
      await navigator.clipboard.writeText(text);
      setCrownCopied(true);
      setTimeout(() => setCrownCopied(false), 1800);
    } catch {
      // Clipboard access can be denied by the browser — no fallback
      // worth building for a "nice to have" share affordance.
    }
  };

  const allItems: FeedItem[] = [
    ...qa.map((q) => ({
      id: q.id,
      asker: q.asker,
      upvotes: q.upvotes,
      question: q.question,
      answer: q.answer,
      answeredBy: q.answeredBy,
    })),
    ...submitted.map((q) => ({
      id: q.id,
      asker: "you",
      upvotes: 0,
      question: q.question,
      answer: null,
      answeredBy: null,
    })),
  ]
    .map((item) => ({ ...item, upvotes: item.upvotes + (qaUpvotes[item.id] ? 1 : 0) }))
    .sort((a, b) => b.upvotes - a.upvotes);

  // The crowned question gets its own pinned card up top instead of
  // sitting wherever its upvote count happens to sort it — winning a
  // battle is a bigger deal than the ▲ count alone.
  const items = allItems.filter((item) => item.id !== crown?.questionId);
  const answeredCount = allItems.filter((q) => q.answer).length;

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

      <QaBattle
        projectKey={projectKey}
        candidates={allItems.map((item) => ({
          id: item.id,
          question: item.question,
          asker: item.asker,
          upvotes: item.upvotes,
        }))}
      />

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
        {crown && (
          <div
            className="flex items-center gap-3 border-2 border-board-lime bg-[#141A06] p-4.5"
            style={{ animation: "board-stampin-flat 500ms cubic-bezier(0.3,1.4,0.5,1) both" }}
          >
            <span className="flex-none text-[22px] leading-none">👑</span>
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[9px] font-extrabold tracking-[0.12em] text-board-lime">
                CROWNED · BEST QUESTION
              </div>
              <div className="mt-1.5 font-mono text-[13px] font-bold leading-[1.5] text-board-heading">
                &quot;{crown.question}&quot;
              </div>
              <div className="mt-1 font-mono text-[9px] text-board-tertiary">asked by {crown.asker}</div>
            </div>
            <button
              type="button"
              onClick={shareCrown}
              className="flex-none whitespace-nowrap border border-board-lime px-3 py-2 font-mono text-[9px] font-extrabold tracking-[0.08em] text-board-lime transition hover:bg-[#1B2308]"
            >
              {crownCopied ? "COPIED ✓" : "SHARE THIS WIN ↗"}
            </button>
          </div>
        )}
        {allItems.length === 0 && (
          <div className="border border-board-border-alt bg-board-card-alt p-4.5 font-mono text-[11px] text-board-tertiary">
            No questions yet. Be the first — the answer goes on the permanent record.
          </div>
        )}
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 border border-board-border-alt bg-board-card-alt p-4.5">
            <button
              type="button"
              onClick={() => {
                if (!qaUpvotes[item.id]) {
                  setSparkingId(item.id);
                  setTimeout(() => setSparkingId((cur) => (cur === item.id ? null : cur)), 500);
                }
                toggleQaUpvote(item.id);
              }}
              className={`relative flex w-11 flex-none flex-col items-center gap-1 pt-0.5 transition hover:-translate-y-0.5 hover:text-board-lime ${
                qaUpvotes[item.id] ? "text-board-lime" : "text-[#C4CCBB]"
              }`}
            >
              {sparkingId === item.id && <SparkBurst />}
              <span className="font-mono text-[13px] font-extrabold">▲</span>
              <span className="font-mono text-[12px] font-bold">{item.upvotes}</span>
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[10px] text-board-tertiary">{item.asker}</span>
                {item.answer && (
                  <span className="font-mono text-[9px] font-bold tracking-[0.1em] text-board-success">
                    ✓ ANSWERED
                  </span>
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
