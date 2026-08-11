"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Comment, ProjectKey } from "@/lib/types";
import { useBoardroomStore } from "@/store/useBoardroomStore";
import { formatRelativeTime } from "@/lib/utils/format";

/** Deliberately separate from QaFeed — freeform commentary, not
 *  questions with answers. Keeps "ASK THE TEAM" clean for things a
 *  founder should actually reply to, while this stays open banter
 *  (also aggregated across every project on /floor).
 *
 *  The "king of the hill" comment-battle widget (components/profile/QaBattle.tsx)
 *  is intentionally not mounted here for this demo/v1 — parked for a
 *  later pass, not deleted. */
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

  const feed = all.map((c) => ({ ...c, likes: c.likes + (commentLikes[c.id] ? 1 : 0) }));

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
      <div className="mb-1 flex items-baseline gap-3.5">
        <Link
          href="/floor"
          className="font-mono text-[16px] font-bold tracking-[0.02em] text-board-secondary-alt transition hover:text-board-lime"
        >
          💬 THE FLOOR ↗
        </Link>
        <div className="font-mono text-[11px] text-board-tertiary">{all.length} comments</div>
      </div>
      <div className="mb-4 font-mono text-[10px] leading-[1.6] text-board-disabled">
        Casual talk, not official answers — for that, see Ask the Team above.
      </div>

      <div className="mb-5 border border-dashed border-[#2C3327] p-4">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Say something about ${projectName} — no need for it to be a question.`}
          rows={2}
          className="min-h-[48px] w-full resize-y border border-[#232A1E] bg-transparent p-2.5 font-mono text-[12px] leading-[1.6] text-board-heading-alt placeholder:text-board-disabled focus:border-board-secondary-alt focus:outline-none"
        />
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={post}
            disabled={!draft.trim()}
            className="ml-auto flex-none whitespace-nowrap border border-[#3D4536] px-4 py-2 font-mono text-[10px] font-bold tracking-[0.08em] text-board-secondary transition hover:border-board-lime hover:text-board-lime disabled:cursor-not-allowed disabled:opacity-40"
          >
            POST
          </button>
        </div>
        {justPosted && (
          <div className="mt-2 font-mono text-[10px] font-bold text-board-success">
            ✓ Posted — visible below.
          </div>
        )}
      </div>

      {all.length === 0 ? (
        <div className="font-mono text-[11px] text-board-tertiary">No comments yet. Be the first.</div>
      ) : (
        <div className="border-t border-[#1A1E16]">
          {feed.map((c) => {
            const liked = !!commentLikes[c.id];
            return (
              <div key={c.id} className="flex gap-4 border-b border-[#1A1E16] py-3.5">
                <div className="flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[10px] text-board-tertiary">{c.author}</span>
                    <span className="font-mono text-[9px] text-board-disabled">{formatRelativeTime(c.postedAt)}</span>
                  </div>
                  <div className="mt-1.5 font-mono text-[12px] leading-[1.6] text-board-body">{c.text}</div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleCommentLike(c.id)}
                  aria-label={liked ? "Unlike this comment" : "Like this comment"}
                  title={liked ? "Unlike this comment" : "Like this comment"}
                  className={`flex flex-none items-center gap-1.5 self-start border px-3.5 py-2.5 font-mono text-[15px] font-bold transition hover:-translate-y-0.5 ${
                    liked
                      ? "border-board-lime bg-[#141A06] text-board-lime"
                      : "border-board-border-alt text-board-secondary hover:border-[#4A5A2C] hover:text-board-lime"
                  }`}
                >
                  <span className="text-[19px] leading-none">{liked ? "♥" : "♡"}</span> {c.likes}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
