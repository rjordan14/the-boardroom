const ELIMINATED = [
  "COLD STORAGE CLUB",
  "GAS FEE THERAPY",
  "THE SLOW BID",
  "RUGPROOF",
  "LIQUIDITY LAUNDROMAT",
  "NOTARY NIGHT",
  "BAGHOLDER BINGO",
  "SETTLEMENT DINER",
];

export function EliminatedStrip() {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3.5 border border-board-border-alt bg-board-card p-3.5">
      <div className="shrink-0 font-mono text-[10px] font-bold tracking-[0.2em] text-board-tertiary">
        ROUND OF 16 · CLOSED JUL 5
      </div>
      <div className="flex flex-wrap gap-1.5">
        {ELIMINATED.map((name) => (
          <span
            key={name}
            className="border border-board-border-alt bg-board-card-alt px-2.5 py-1.5 font-mono text-[10px] text-board-disabled line-through"
          >
            {name}
          </span>
        ))}
      </div>
      <div className="ml-auto font-mono text-[10px] text-[#4A5540]">
        8 eliminated · 24,118 ballots sealed
      </div>
    </div>
  );
}
