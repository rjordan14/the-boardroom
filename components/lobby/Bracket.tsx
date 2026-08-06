import type { Project, Room } from "@/lib/types";

/**
 * Simplified structural bracket — quarterfinal matchups, semifinal
 * winner placeholders, and the final/featured-launch panel. Not a
 * pixel match for the prototype's diagonal-connector bracket (that's
 * decorative flourish outside this slice's scope); the round
 * hierarchy and matchup data are real.
 */
export function Bracket({
  rooms,
  projects,
}: {
  rooms: Room[];
  projects: Record<string, Project>;
}) {
  return (
    <div>
      <div className="mb-5 font-mono text-[clamp(19px,2.8vw,26px)] font-extrabold leading-[1.05] tracking-[0.02em] text-board-heading">
        THE ROAD TO LAUNCH
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
        {rooms.map((room) => {
          const a = projects[room.projectA];
          const b = projects[room.projectB];
          return (
            <div key={room.id} className="border border-board-border-alt bg-board-card-alt">
              <div className="border-b border-board-border-alt px-3 py-2 font-mono text-[9px] font-bold tracking-[0.16em] text-board-tertiary">
                QF{room.id}
              </div>
              <div className="flex flex-col gap-1 p-2">
                {[a, b].map((p) => (
                  <div
                    key={p.key}
                    className="flex items-center gap-2.5 border border-board-border-alt bg-board-card px-3 py-2"
                    style={{ borderLeft: "3px solid #CCFF00" }}
                  >
                    <img src={p.mark} alt="" className="h-[22px] w-[22px]" />
                    <span className="font-mono text-[11px] font-bold text-board-body">
                      {p.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
        <div className="border border-dashed border-[#6E8050] bg-board-card-alt px-3.5 py-3.5 font-mono text-[11px] font-bold tracking-[0.08em] text-board-body">
          SEMIFINAL · SET AFTER QUARTERFINAL RESULTS
        </div>
        <div className="border-2 border-dashed border-board-lime bg-[#111607] px-4 py-4 text-center">
          <div className="font-mono text-[13px] font-extrabold tracking-[0.14em] text-board-lime">
            THE FEATURED LAUNCH
          </div>
          <div className="mt-3 font-mono text-[10px] leading-[1.8] text-board-secondary-alt">
            Automatic V3 liquidity · fee split · staking vault · featured
            token launch
          </div>
        </div>
      </div>
    </div>
  );
}
