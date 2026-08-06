import type { Project, Room } from "@/lib/types";

export function BracketTab({ rooms, projects }: { rooms: Room[]; projects: Record<string, Project> }) {
  return (
    <div className="max-w-[1100px] px-[clamp(14px,4vw,48px)] py-7.5 pb-[70px]">
      <div className="font-mono text-[20px] font-extrabold text-board-heading">BRACKET</div>
      <div className="mt-2 font-mono text-[11px] leading-[1.7] text-board-secondary">
        Assign who plays whom. Matchups lock once a round opens for voting.
      </div>

      <div className="mb-3 mt-6.5 font-mono text-[9px] font-bold tracking-[0.14em] text-board-tertiary">
        QUARTERFINAL · LIVE, LOCKED
      </div>
      <div className="flex flex-col gap-2.5">
        {rooms.map((room) => {
          const a = projects[room.projectA];
          const b = projects[room.projectB];
          return (
            <div
              key={room.id}
              className="grid items-center gap-3.5 border border-board-border-alt bg-board-card-alt p-4"
              style={{ gridTemplateColumns: "60px 1fr 40px 1fr 120px" }}
            >
              <div className="font-mono text-[12px] font-extrabold text-board-tertiary">R{room.id}</div>
              <div className="flex items-center gap-2.5">
                <img src={a.mark} alt="" className="h-7 w-7" />
                <span className="font-mono text-[12px] font-bold text-board-heading">{a.name}</span>
              </div>
              <div className="text-center font-mono text-[10px] font-extrabold text-board-disabled">VS</div>
              <div className="flex items-center gap-2.5">
                <img src={b.mark} alt="" className="h-7 w-7" />
                <span className="font-mono text-[12px] font-bold text-board-heading">{b.name}</span>
              </div>
              <div className="text-right font-mono text-[10px] font-bold tracking-[0.06em] text-board-success">
                {room.status === "closed" ? "DECIDED" : "LOCKED"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-3 mt-7.5 font-mono text-[9px] font-bold tracking-[0.14em] text-board-tertiary">
        SEMIFINAL · SET AFTER QUARTERFINAL RESULTS
      </div>
      <div className="border border-dashed border-board-border-alt p-5.5 text-center font-mono text-[11px] leading-[1.7] text-board-disabled">
        Semifinal matchups unlock for editing once all 4 quarterfinal rooms have a winner. Winners
        are auto-seeded 1v4 / 2v3 by ballot count; you can override before the round opens.
      </div>

      <div className="mt-5">
        <button type="button" className="border border-board-border-alt px-4.5 py-3 font-mono text-[10px] font-bold tracking-[0.1em] text-board-secondary">
          EXPORT BRACKET
        </button>
      </div>
    </div>
  );
}
