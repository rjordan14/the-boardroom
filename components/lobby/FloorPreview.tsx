import Link from "next/link";
import type { Comment, Project } from "@/lib/types";

/** A lightweight teaser for /floor — same data model (comments, ♥
 *  likes), not a separate interactive surface. It used to preview a
 *  disconnected set of upvotable Q&A-style "floor questions" that
 *  didn't exist anywhere on the actual /floor page, so the "▲ to
 *  upvote" hint here promised an interaction the destination never
 *  had. Liking/posting is real on /floor itself; here it's just a
 *  static count to entice a click-through. */
export function FloorPreview({
  comments,
  projects,
}: {
  comments: Comment[];
  projects: Record<string, Project>;
}) {
  const top = [...comments].sort((a, b) => b.likes - a.likes).slice(0, 4);

  return (
    <div className="border border-board-border-alt bg-board-card-alt p-5">
      <div className="mb-4 flex flex-wrap items-baseline gap-3 font-mono text-[14px] font-extrabold tracking-[0.06em] text-board-heading">
        FROM THE FLOOR
        <span className="font-mono text-[10px] font-normal tracking-normal text-board-tertiary">
          what the crowd&apos;s saying — tap a card for the project
        </span>
        <Link
          href="/floor"
          className="ml-auto font-mono text-[10px] font-bold tracking-[0.08em] text-board-lime transition hover:translate-x-0.5"
        >
          VIEW ALL →
        </Link>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-3">
        {top.map((c) => {
          const project = projects[c.projectKey];
          if (!project) return null;
          return (
            <Link
              key={c.id}
              href={`/profile/${project.key}`}
              className="flex gap-3 border border-[#23271F] bg-board-card p-3.5 transition hover:-translate-y-0.5 hover:border-[#3D4536]"
            >
              <img src={project.mark} alt="" className="h-8 w-8 flex-none" />
              <div className="min-w-0 flex-1">
                <div className="font-mono text-[9px] font-extrabold tracking-[0.08em] text-board-lime">
                  {project.name}
                </div>
                <div className="mt-1.5 font-mono text-[11px] leading-[1.6] text-board-body">
                  &quot;{c.text}&quot;
                </div>
              </div>
              <div className="flex-none self-start font-mono text-[10px] font-bold text-board-secondary">
                ♥ {c.likes}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
