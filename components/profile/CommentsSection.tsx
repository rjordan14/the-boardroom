"use client";

import { useMemo, useState } from "react";
import type { Comment, ProjectKey } from "@/lib/types";
import { useBoardroomStore } from "@/store/useBoardroomStore";
import { formatRelativeTime } from "@/lib/utils/format";

/** Deliberately separate from QaFeed — freeform commentary, not
 *  questions with answers. Keeps "ASK THE TEAM" clean for things a
 *  founder should actually reply to, while this stays open banter
 *  (also aggregated across every project on /floor). */
export function CommentsSection({
  projectKey,
  projectName,
  comments,
}: {
  projectKey: string;
  projectName: string;
  comments: Comment[];
}) {
  const postedComments = useBoardroomStore((s) => s.postedComments[projectKey]);
  const commentLikes = useBoardroomStore((s) => s.commentLikes);
  const toggleCommentLike = useBoardroomStore((s) => s.toggleCommentLike);
  const postComment = useBoardroomStore((s) => s.postComment);
  const [draft, setDraft] = useState("");
  const [justPosted, setJustPosted] = useState(false);

  const all = useMemo(
    () => [...comments, ...(postedComments ?? [])].sort((a, b) => b.postedAt - a.postedAt),
    [comments, postedComments]
  );

  const post = () => {
    const text = draft.trim();
    if (!text) return;
    postComment(projectKey as ProjectKey, "you", text);
    setDraft("");
    setJustPosted(true);
    setTimeout(() => setJustPosted(false), 3000);
  };

  return (
    <div>
      <div className="mb-4 flex items-baseline gap-3.5">
        <div className="font-mono text-[18px] font-extrabold tracking-[0.02em] text-board-heading">
          THE FLOOR
        </div>
        <div className="font-mono text-[11px] text-board-tertiary">{all.length} comments</div>
      </div>

      <div className="mb-5.5 border border-board-border-alt bg-board-card-alt p-4.5">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Say something about ${projectName} — no need for it to be a question.`}
          rows={2}
          className="min-h-[56px] w-full resize-y border border-board-border-alt bg-[#080A06] p-3 font-mono text-[12px] leading-[1.6] text-board-heading-alt placeholder:text-board-disabled focus:border-board-lime focus:outline-none"
        />
        <div className="mt-2.5 flex items-center gap-3">
          <div className="font-mono text-[10px] text-board-tertiary">
            Public, casual — also shows up on the floor.
          </div>
          <button
            type="button"
            onClick={post}
            disabled={!draft.trim()}
            className="ml-auto flex-none whitespace-nowrap bg-board-lime px-5 py-2.5 font-mono text-[11px] font-extrabold tracking-[0.1em] text-board-bg transition hover:bg-board-lime-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            POST
          </button>
        </div>
        {justPosted && (
          <div className="mt-2.5 font-mono text-[11px] font-bold text-board-success">
            ✓ Posted — visible below.
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2.5">
        {all.length === 0 && (
          <div className="border border-board-border-alt bg-board-card-alt p-4.5 font-mono text-[11px] text-board-tertiary">
            No comments yet. Be the first.
          </div>
        )}
        {all.map((c) => {
          const liked = !!commentLikes[c.id];
          return (
            <div key={c.id} className="flex gap-4 border border-board-border-alt bg-board-card-alt p-4.5">
              <div className="flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[10px] text-board-tertiary">{c.author}</span>
                  <span className="font-mono text-[9px] text-board-disabled">{formatRelativeTime(c.postedAt)}</span>
                </div>
                <div className="mt-2 font-mono text-[12px] leading-[1.6] text-board-body">{c.text}</div>
              </div>
              <button
                type="button"
                onClick={() => toggleCommentLike(c.id)}
                className={`flex flex-none items-start gap-1 font-mono text-[10px] font-bold transition hover:-translate-y-0.5 ${
                  liked ? "text-board-lime" : "text-board-secondary hover:text-board-lime"
                }`}
              >
                {liked ? "♥" : "♡"} {c.likes + (liked ? 1 : 0)}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
