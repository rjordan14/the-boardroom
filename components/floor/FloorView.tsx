"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Comment, Project, ProjectKey } from "@/lib/types";
import { useBoardroomStore } from "@/store/useBoardroomStore";
import { formatRelativeTime } from "@/lib/utils/format";

type SortMode = "recent" | "top";

export function FloorView({ comments, projects }: { comments: Comment[]; projects: Project[] }) {
  const postedComments = useBoardroomStore((s) => s.postedComments);
  const commentLikes = useBoardroomStore((s) => s.commentLikes);
  const toggleCommentLike = useBoardroomStore((s) => s.toggleCommentLike);
  const postComment = useBoardroomStore((s) => s.postComment);

  const [filter, setFilter] = useState<string>("ALL");
  const [sort, setSort] = useState<SortMode>("recent");
  const [draft, setDraft] = useState("");
  const [draftProject, setDraftProject] = useState<string>(projects[0]?.key ?? "");
  const [justPostedId, setJustPostedId] = useState<string | null>(null);

  const projectByKey = useMemo(() => Object.fromEntries(projects.map((p) => [p.key, p])), [projects]);

  const allComments = useMemo(
    () => [...comments, ...Object.values(postedComments).flat()],
    [comments, postedComments]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const cm of allComments) c[cm.projectKey] = (c[cm.projectKey] ?? 0) + 1;
    return c;
  }, [allComments]);

  const visible = useMemo(() => {
    const base = filter === "ALL" ? allComments : allComments.filter((c) => c.projectKey === filter);
    return [...base].sort((a, b) => {
      const likesA = a.likes + (commentLikes[a.id] ? 1 : 0);
      const likesB = b.likes + (commentLikes[b.id] ? 1 : 0);
      if (sort === "top") return likesB - likesA || b.postedAt - a.postedAt;
      return b.postedAt - a.postedAt;
    });
  }, [allComments, filter, sort, commentLikes]);

  const post = () => {
    const text = draft.trim();
    if (!text || !draftProject) return;
    postComment(draftProject as ProjectKey, "you", text);
    setDraft("");
    setJustPostedId(draftProject);
    setTimeout(() => setJustPostedId(null), 1500);
  };

  return (
    <div className="mx-auto max-w-[980px] px-[clamp(14px,4vw,48px)] py-10">
      <div className="flex items-center gap-2.5 font-mono text-[9px] font-bold tracking-[0.2em] text-board-secondary-alt">
        <span className="block h-1.5 w-1.5 animate-[board-pulse_2s_ease-in-out_infinite] rounded-full bg-board-lime" />
        LIVE · {allComments.length} COMMENTS ACROSS {projects.length} PROJECTS
      </div>
      <div className="mt-2 font-mono text-[clamp(24px,4vw,36px)] font-extrabold leading-[1.1] text-board-heading">
        FROM THE FLOOR
      </div>
      <div className="mt-2 max-w-[620px] font-mono text-[12px] leading-[1.7] text-board-secondary">
        Everything the crowd is saying about every project, in one place — not questions with
        answers, just the floor talking. Head to a project&apos;s profile for the formal Q&amp;A.
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-1.5">
        <FilterChip active={filter === "ALL"} onClick={() => setFilter("ALL")}>
          ALL <span className="text-board-tertiary">· {allComments.length}</span>
        </FilterChip>
        {projects.map((p) => (
          <FilterChip key={p.key} active={filter === p.key} onClick={() => setFilter(p.key)}>
            <img src={p.mark} alt="" className="h-3.5 w-3.5" />
            {p.name}
            <span className="text-board-tertiary">· {counts[p.key] ?? 0}</span>
          </FilterChip>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex gap-1.5">
          <SortChip active={sort === "recent"} onClick={() => setSort("recent")}>
            MOST RECENT
          </SortChip>
          <SortChip active={sort === "top"} onClick={() => setSort("top")}>
            TOP LIKED
          </SortChip>
        </div>
      </div>

      <div className="mt-4 border border-board-border-alt bg-board-card-alt p-4.5">
        <div className="flex flex-wrap gap-2">
          {projects.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setDraftProject(p.key)}
              className={`flex items-center gap-1.5 border px-2.5 py-1.5 font-mono text-[9px] font-bold tracking-[0.06em] transition ${
                draftProject === p.key
                  ? "border-board-lime bg-[#141A06] text-board-lime"
                  : "border-board-border-alt text-board-secondary hover:border-board-lime hover:text-board-lime"
              }`}
            >
              <img src={p.mark} alt="" className="h-3 w-3" />
              {p.name}
            </button>
          ))}
        </div>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Say something about ${projectByKey[draftProject]?.name ?? "a project"}…`}
          rows={2}
          className="mt-3 min-h-[56px] w-full resize-y border border-board-border-alt bg-[#080A06] p-3 font-mono text-[12px] leading-[1.6] text-board-heading-alt placeholder:text-board-disabled focus:border-board-lime focus:outline-none"
        />
        <div className="mt-2.5 flex items-center gap-3">
          <div className="font-mono text-[10px] text-board-tertiary">Posts publicly, right below.</div>
          <button
            type="button"
            onClick={post}
            disabled={!draft.trim()}
            className="ml-auto flex-none whitespace-nowrap bg-board-lime px-5 py-2.5 font-mono text-[11px] font-extrabold tracking-[0.1em] text-board-bg transition hover:bg-board-lime-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            POST
          </button>
        </div>
      </div>

      <div className="mt-5.5 flex flex-col gap-2.5">
        {visible.length === 0 && (
          <div className="border border-board-border-alt bg-board-card-alt p-4.5 font-mono text-[11px] text-board-tertiary">
            Nothing here yet — be the first.
          </div>
        )}
        {visible.map((c) => {
          const project = projectByKey[c.projectKey];
          if (!project) return null;
          const liked = !!commentLikes[c.id];
          const isNew = justPostedId === c.projectKey && c.author === "you";
          return (
            <div
              key={c.id}
              className="flex gap-3.5 border border-board-border-alt bg-board-card-alt p-4"
              style={isNew ? { animation: "board-eliminated-settle 400ms ease-out both" } : undefined}
            >
              <Link href={`/profile/${project.key}`} className="flex-none transition hover:scale-110">
                <img src={project.mark} alt="" className="h-9 w-9" />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/profile/${project.key}`}
                    className="font-mono text-[10px] font-extrabold tracking-[0.06em] text-board-lime transition hover:translate-x-0.5"
                  >
                    {project.name}
                  </Link>
                  <span className="font-mono text-[9px] text-board-tertiary">{c.author}</span>
                  <span className="font-mono text-[9px] text-board-disabled">{formatRelativeTime(c.postedAt)}</span>
                </div>
                <div className="mt-1.5 font-mono text-[12px] leading-[1.6] text-board-body">{c.text}</div>
              </div>
              <button
                type="button"
                onClick={() => toggleCommentLike(c.id)}
                className={`flex flex-none items-center gap-1 self-start font-mono text-[10px] font-bold transition hover:-translate-y-0.5 ${
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

function FilterChip({
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
      className={`flex items-center gap-1.5 border px-2.5 py-1.5 font-mono text-[9px] font-bold tracking-[0.06em] transition ${
        active
          ? "border-board-lime bg-[#141A06] text-board-lime"
          : "border-board-border-alt text-board-secondary hover:border-board-lime hover:text-board-lime"
      }`}
    >
      {children}
    </button>
  );
}

function SortChip({
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
      className={`border px-3 py-1.5 font-mono text-[9px] font-bold tracking-[0.1em] transition ${
        active
          ? "border-board-lime text-board-lime"
          : "border-transparent text-board-tertiary hover:text-board-secondary"
      }`}
    >
      {children}
    </button>
  );
}
