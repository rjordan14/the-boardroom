import type { Project, QaItem } from "@/lib/types";

export function CompareCard({
  project,
  qa,
  picked,
  onPick,
  onOpenProfile,
}: {
  project: Project;
  qa: QaItem[];
  picked: boolean;
  onPick: () => void;
  onOpenProfile: () => void;
}) {
  const doxxed = project.people.filter((p) => p.handle);
  const answeredCount = qa.filter((q) => q.answer).length;
  const topQuestions = [...qa].sort((a, b) => b.upvotes - a.upvotes).slice(0, 2);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onPick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPick();
        }
      }}
      // A real <button> can't contain other interactive elements (the
      // profile button, X links, the mark's own click target) — the
      // browser would silently split the DOM at the first nested
      // <button>. A div with the button role gets the same semantics
      // and click/keyboard behavior without that HTML constraint.
      className="flex min-w-0 flex-1 basis-[240px] cursor-pointer flex-col gap-4 border-2 p-6 text-left transition hover:-translate-y-0.5"
      style={{
        borderColor: picked ? "#CCFF00" : "#2C3327",
        background: picked ? "#141A08" : "#0E110C",
      }}
    >
      <div className="flex items-center gap-3.5">
        <img
          src={project.mark}
          alt=""
          className="h-[52px] w-[52px] transition-transform hover:scale-[1.12] hover:-rotate-3"
          onClick={(e) => {
            e.stopPropagation();
            onOpenProfile();
          }}
        />
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-[20px] font-extrabold leading-[1.1] text-board-heading">
            {project.name}
          </div>
          <div className="mt-1.5 font-mono text-[11px] leading-[1.5] text-[#7C8474]">
            {project.line}
          </div>
        </div>
        <div
          className="ml-auto flex h-6.5 w-6.5 flex-none items-center justify-center border-2"
          style={{ borderColor: picked ? "#CCFF00" : "#2C3327", background: picked ? "#CCFF00" : "transparent" }}
        >
          {picked && (
            <span
              className="font-mono text-[15px] font-extrabold leading-none text-board-bg"
              style={{ animation: "board-check-pop 380ms cubic-bezier(0.3,1.6,0.4,1) both" }}
            >
              ✓
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-[minmax(96px,130px)_1fr] gap-x-3.5 gap-y-2.5 font-mono text-[11px] leading-[1.6]">
        <span className="text-board-tertiary">TEAM</span>
        <span className="text-board-body">{project.team}</span>
        <span className="text-board-tertiary">TOKEN CONCEPT</span>
        <span className="text-board-body">{project.tokenPlan}</span>
        <span className="text-board-tertiary">RISKS</span>
        <span className="text-board-body">{project.risksDisclosed}</span>
      </div>

      <div className="flex flex-col gap-3.5 border-t border-[#232A1E] pt-4">
        <div>
          <div className="font-mono text-[9px] font-bold tracking-[0.14em] text-board-tertiary">
            THESIS
          </div>
          <div className="mt-2 text-pretty font-mono text-[12px] leading-[1.7] text-board-body">
            {project.thesis}
          </div>
        </div>
        {doxxed.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 font-mono text-[9px] font-bold tracking-[0.14em] text-board-tertiary">
              DOXXED
            </span>
            {doxxed.map((m) => (
              <a
                key={m.handle}
                href={`https://x.com/${m.handle!.slice(1)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 border border-board-border bg-[#0C0F09] px-2.5 py-1.5 font-mono text-[10px] text-board-body transition hover:border-board-lime hover:text-board-lime"
              >
                <span className="font-mono text-[11px] font-bold">X</span>
                {m.handle}
                <span className="text-board-tertiary">{m.role}</span>
              </a>
            ))}
          </div>
        )}

        {qa.length > 0 && (
          <div>
            <div className="font-mono text-[9px] font-bold tracking-[0.14em] text-board-tertiary">
              ASK THE TEAM · {answeredCount} of {qa.length} answered
            </div>
            <div className="mt-2 flex flex-col gap-1.5">
              {topQuestions.map((q) => (
                <div key={q.id} className="border-l-2 border-[#2C3327] pl-2.5 font-mono text-[11px] leading-[1.5] text-board-body">
                  &quot;{q.question}&quot;
                  {q.answer && <span className="ml-1.5 text-[9px] font-bold text-board-success">✓ ANSWERED</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenProfile();
          }}
          className="self-start font-mono text-[10px] font-bold tracking-[0.08em] text-board-lime transition hover:translate-x-0.5"
        >
          VIEW FULL PROFILE ↗
        </button>
      </div>
    </div>
  );
}
