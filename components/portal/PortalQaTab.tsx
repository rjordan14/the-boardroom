"use client";

import type { QaItem } from "@/lib/types";
import { usePortalStore } from "@/store/usePortalStore";

export function PortalQaTab({ qa }: { qa: QaItem[] }) {
  const answers = usePortalStore((s) => s.answers);
  const answeringId = usePortalStore((s) => s.answeringId);
  const drafts = usePortalStore((s) => s.drafts);
  const startAnswer = usePortalStore((s) => s.startAnswer);
  const cancelAnswer = usePortalStore((s) => s.cancelAnswer);
  const setDraft = usePortalStore((s) => s.setDraft);
  const postAnswer = usePortalStore((s) => s.postAnswer);

  return (
    <div className="max-w-[900px] px-[clamp(14px,4vw,48px)] py-7.5 pb-[70px]">
      <div className="font-mono text-[20px] font-extrabold text-board-heading">
        QUESTIONS FROM THE FLOOR
      </div>
      <div className="mt-2 font-mono text-[11px] leading-[1.7] text-board-secondary">
        Answer as many as you can before the round closes. Unanswered questions stay on the
        record — silence is visible.
      </div>

      <div className="mt-5.5 flex flex-col gap-3">
        {qa.map((q) => {
          const answer = q.answer ?? answers[q.id] ?? null;
          const answering = answeringId === q.id;
          return (
            <div key={q.id} className="border border-board-border-alt bg-board-card-alt p-4">
              <div className="font-mono text-[9px] font-bold tracking-[0.1em] text-board-tertiary">
                {q.asker} · {q.upvotes} UPVOTES
              </div>
              <div className="mt-2 font-mono text-[12px] leading-[1.6] text-board-body">{q.question}</div>

              {answer && (
                <div className="mt-3 border-l-2 border-board-success pl-3 font-mono text-[11px] leading-[1.7] text-board-secondary">
                  {answer}
                </div>
              )}

              {answering && (
                <div className="mt-3 flex flex-col gap-2">
                  <textarea
                    value={drafts[q.id] ?? ""}
                    onChange={(e) => setDraft(q.id, e.target.value)}
                    placeholder="Type your answer…"
                    rows={2}
                    className="w-full resize-y border border-board-border-alt bg-board-bg px-3.5 py-2.5 font-mono text-[11px] leading-[1.6] text-board-heading placeholder:text-board-disabled focus:border-board-lime focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => postAnswer(q.id)}
                      className="border-2 border-board-lime bg-[#141A06] px-3.5 py-2.5 font-mono text-[10px] font-extrabold tracking-[0.08em] text-board-lime"
                    >
                      POST ANSWER
                    </button>
                    <button
                      type="button"
                      onClick={cancelAnswer}
                      className="border border-board-border-alt px-3.5 py-2.5 font-mono text-[10px] font-bold tracking-[0.08em] text-board-secondary"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              )}

              {!answer && !answering && (
                <button
                  type="button"
                  onClick={() => startAnswer(q.id)}
                  className="mt-2.5 font-mono text-[10px] font-bold tracking-[0.08em] text-board-lime"
                >
                  REPLY →
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
