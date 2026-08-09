/** The on-screen "I Voted" card — real HTML/CSS/SVG, not a canvas
 *  snapshot, specifically so the catbroker gif actually loops here
 *  instead of freezing on whatever frame happened to be current when
 *  a canvas grabbed it. The downloadable/shareable file (see
 *  lib/utils/votedCard.ts) is necessarily a static PNG — canvas can
 *  only ever capture one frame of a gif — but this preview is the
 *  version people actually look at before deciding to share, so it's
 *  the one worth keeping alive. */
export function VotedCardVisual({ projectName }: { projectName: string }) {
  return (
    <div className="flex flex-col items-center gap-7 border border-[#2C3327] bg-[#0A0D07] px-6 py-10">
      <div className="text-center">
        <div className="font-mono text-[20px] font-extrabold tracking-[0.1em] text-board-lime">
          THE BOARDROOM
        </div>
        <div className="mt-1 font-mono text-[11px] tracking-[0.2em] text-board-tertiary">SEASON 01</div>
      </div>

      <div className="relative h-[280px] w-[280px] flex-none">
        <div className="absolute inset-0 rounded-full bg-board-lime" />
        <div className="absolute overflow-hidden rounded-full bg-black" style={{ inset: 36 }}>
          <img
            src="/marks/catbroker-swing.gif"
            alt=""
            className="h-full w-full object-cover [image-rendering:pixelated]"
          />
        </div>
        <svg viewBox="0 0 280 280" className="pointer-events-none absolute inset-0 h-full w-full">
          <defs>
            <path id="voted-ring-path" d="M 28,140 A 112,112 0 0 1 252,140" fill="none" />
          </defs>
          <text
            fill="#0A0D07"
            fontSize="14"
            fontWeight="bold"
            fontFamily="var(--font-jetbrains-mono), monospace"
            letterSpacing="1.5"
          >
            <textPath href="#voted-ring-path" startOffset="50%" textAnchor="middle">
              ★ I VOTED ★ I VOTED ★
            </textPath>
          </text>
        </svg>
        <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 font-mono text-[15px] font-bold leading-none text-[#0A0D07]">
          ★
        </div>
      </div>

      <div className="text-center">
        <div className="font-mono text-[32px] font-extrabold leading-[1.05] text-board-heading">
          {projectName.toUpperCase()}
        </div>
        <div className="mx-auto mt-3 max-w-[300px] font-mono text-[17px] font-extrabold leading-[1.35] text-board-lime">
          THE COMMUNITY DECIDES WHO LAUNCHES.
        </div>
      </div>
    </div>
  );
}
