import type { Comment, Project, QaItem } from "@/lib/types";
import { formatClock } from "@/lib/utils/format";
import { QaFeed } from "@/components/profile/QaFeed";
import { CommentsSection } from "@/components/profile/CommentsSection";

export function ProjectProfileView({
  project,
  qa,
  comments,
}: {
  project: Project;
  qa: QaItem[];
  comments: Comment[];
}) {
  return (
    <div className="mx-auto max-w-[1000px] px-[clamp(14px,4vw,48px)] py-10">
      <div className="flex items-center gap-5.5">
        <img src={project.mark} alt="" className="h-[74px] w-[74px] flex-none" />
        <div>
          <div className="font-mono text-[clamp(21px,3.2vw,30px)] font-extrabold leading-[1.05] text-board-heading">
            {project.name}
          </div>
          <div className="mt-2 font-mono text-[13px] text-board-secondary">{project.line}</div>
        </div>
      </div>

      <div className="mt-7.5 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        <Fact label="TEAM" value={project.team} />
        <Fact label="SHIPPED" value={project.shipped} />
        <Fact label="TOKEN PLAN" value={project.tokenPlan} />
        <Fact label="DISCLOSED RISKS" value={project.risksDisclosed} />
      </div>

      <div className="mt-7.5 flex flex-wrap items-center gap-5 border border-board-border-alt bg-board-card-alt p-5">
        <div className="relative flex aspect-video w-[220px] flex-none items-center justify-center overflow-hidden border border-[#333D26] bg-gradient-to-br from-[#171B10] to-[#0A0D07]">
          <div className="absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-board-lime/10 to-transparent" />
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-board-lime shadow-[0_3px_0_#82A200] transition hover:scale-105">
            <span className="ml-1 h-0 w-0 border-y-8 border-l-[13px] border-y-transparent border-l-[#10140B]" />
          </div>
          <div className="absolute bottom-2 left-2.5 font-mono text-[9px] font-bold text-board-body">
            0:00 / {formatClock(project.pitchSeconds)}
          </div>
        </div>
        <div>
          <div className="font-mono text-[11px] font-extrabold tracking-[0.14em] text-board-lime">
            BUILDER PITCH · {formatClock(project.pitchSeconds)}
          </div>
          <div className="mt-2 max-w-[560px] font-mono text-[12px] leading-[1.7] text-board-secondary">
            A founder from {project.name}, in their own words — no script, no editing, recorded in
            one take before the round opened.
          </div>
        </div>
      </div>

      <div className="mt-7.5 border border-board-border-alt bg-board-card-alt p-5.5">
        <div className="font-mono text-[9px] font-bold tracking-[0.14em] text-board-tertiary">THESIS</div>
        <div className="mt-2.5 max-w-[760px] text-pretty font-mono text-[13px] leading-[1.8] text-board-body">
          {project.thesis}
        </div>
        <div className="mt-4.5 flex flex-wrap gap-2">
          <LinkChip href={`https://x.com/${project.x.slice(1)}`} label={project.x} />
          <LinkChip href={`https://${project.site}`} label={project.site} arrow />
        </div>
      </div>

      <div className="mt-7.5">
        <div className="mb-3 font-mono text-[9px] font-bold tracking-[0.14em] text-board-tertiary">TEAM</div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-2.5">
          {project.people.map((p) => (
            <div
              key={`${p.name}-${p.role}`}
              className="flex flex-col gap-2.5 border border-board-border-alt bg-board-card-alt p-3.5"
            >
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono text-[12px] font-bold text-board-heading-alt">{p.name}</span>
                <span className="font-mono text-[10px] text-board-tertiary">{p.role}</span>
              </div>
              {p.handle && <LinkChip href={`https://x.com/${p.handle.slice(1)}`} label={p.handle} />}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8.5">
        <QaFeed projectKey={project.key} projectName={project.name} qa={qa} />
      </div>

      <div className="mt-8.5">
        <CommentsSection projectKey={project.key} projectName={project.name} comments={comments} />
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-board-border-alt bg-board-card-alt p-3.5">
      <div className="font-mono text-[9px] tracking-[0.14em] text-board-tertiary">{label}</div>
      <div className="mt-2 font-mono text-[12px] font-bold leading-[1.5] text-board-heading-alt">{value}</div>
    </div>
  );
}

function LinkChip({ href, label, arrow }: { href: string; label: string; arrow?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-fit items-center gap-1.5 border border-board-border-alt bg-[#0C0F09] px-2.5 py-1.5 font-mono text-[10px] text-board-body transition hover:border-board-lime hover:text-board-lime"
    >
      {!arrow && <span className="font-mono text-[11px] font-bold">X</span>}
      {label}
      {arrow && <span className="text-board-tertiary">↗</span>}
    </a>
  );
}
