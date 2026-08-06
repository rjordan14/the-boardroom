import type { Project } from "@/lib/types";

const CHECKLIST = [
  "Pitch video uploaded",
  "Traction, token plan and risks filled in",
  "Team roster added",
  "X profile and website linked",
];

export function OverviewTab({ project, unansweredCount }: { project: Project; unansweredCount: number }) {
  return (
    <div className="max-w-[1100px] px-[clamp(14px,4vw,48px)] py-7.5 pb-[70px]">
      <div className="flex flex-wrap items-center gap-4">
        {/* Plain placeholder, not the design tool's image-slot.js — see
            the plan's note: that component depends on a browser bridge
            (window.omelette) that doesn't exist in a real app. */}
        <div className="flex h-16 w-16 flex-none items-center justify-center border border-dashed border-board-border-alt bg-board-card-alt font-mono text-[9px] font-bold tracking-[0.08em] text-board-disabled">
          LOGO
        </div>
        <div>
          <div className="font-mono text-[20px] font-extrabold text-board-heading">{project.name}</div>
          <div className="mt-1 font-mono text-[11px] leading-[1.6] text-board-secondary">
            Quarterfinal · Room 01 vs VAULTMOUSE · closes in 2d 07:03
          </div>
        </div>
      </div>

      <div className="mt-6.5 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
        <Stat label="SUBMISSION STATUS" value="APPROVED · LIVE" color="#4ADE80" />
        <Stat label="PROFILE COMPLETE" value="6 / 6" color="#F2F5EF" />
        <Stat label="OPEN QUESTIONS" value={String(unansweredCount)} color="#F2F5EF" />
        <Stat label="$STONKBROKER BACKED" value="61,400" color="#E5B531" amber />
      </div>

      <div className="mb-3 mt-7.5 font-mono text-[14px] font-extrabold tracking-[0.06em] text-board-heading">
        SETUP CHECKLIST
      </div>
      <div className="border border-board-border-alt bg-board-card-alt">
        {CHECKLIST.map((item) => (
          <div key={item} className="flex items-center gap-3 border-b border-[#1A1E16] px-4.5 py-3.5 font-mono text-[11px] last:border-b-0">
            <span className="text-board-success">✓</span>
            <span className="flex-1 text-board-body">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, color, amber }: { label: string; value: string; color: string; amber?: boolean }) {
  return (
    <div className={"border p-4.5 " + (amber ? "border-board-border-amber bg-board-card-amber" : "border-board-border-alt bg-board-card-alt")}>
      <div className="font-mono text-[9px] font-bold tracking-[0.14em]" style={{ color: amber ? "#7A6B42" : "#6C7563" }}>
        {label}
      </div>
      <div className="mt-2.5 font-mono text-[15px] font-extrabold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
