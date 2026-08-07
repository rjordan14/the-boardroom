const FEED_ITEMS = [
  <>0x8f2…c41 clocked in to <b className="text-board-heading">ROOM 01</b></>,
  <>R03 <b className="text-board-heading">answer posted</b></>,
  <>1,204 ballots sealed in <b className="text-board-heading">ROOM 01</b></>,
  <>the room started chanting again</>,
  <>question asked on <b className="text-board-heading">VAULTMOUSE</b></>,
  <>0x4b1…9de clocked out of <b className="text-board-heading">ROOM 04</b></>,
  <>integrity check queued</>,
];

function FeedContent() {
  return (
    <div className="flex flex-none whitespace-nowrap pl-4 font-mono text-[11px] text-board-tertiary">
      {FEED_ITEMS.map((item, i) => (
        <span key={i} className="pr-4">
          {item} ·
        </span>
      ))}
    </div>
  );
}

export function ActivityTicker() {
  return (
    <div className="flex items-center overflow-hidden border-b border-[#161914] bg-[#0A130C]">
      <div className="flex flex-none items-center gap-1.5 border-r border-[#1F3A22] px-4 py-3 font-mono text-[10px] font-bold tracking-[0.14em] text-board-success">
        <span className="block h-1.5 w-1.5 animate-[board-pulse_2s_ease-in-out_infinite] rounded-full bg-board-success" />
        THE FLOOR
      </div>
      <div className="flex-1 overflow-hidden py-3">
        <div className="flex w-max animate-[board-marquee_42s_linear_infinite]">
          {/* Two copies back-to-back so the -50% marquee loop has no visible seam. */}
          <FeedContent />
          <FeedContent />
        </div>
      </div>
    </div>
  );
}
