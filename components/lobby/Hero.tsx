export function Hero() {
  return (
    <div className="relative aspect-[1920/1080] overflow-hidden bg-board-bg-media">
      <img
        src="/marks/room.png"
        alt="The Boardroom conference room"
        className="absolute inset-x-0 top-0 block w-full"
      />
      <div className="absolute inset-x-0 top-0 h-[12%] animate-[board-flicker_7s_infinite] bg-gradient-to-b from-board-lime to-transparent opacity-[0.06]" />
      <div className="pointer-events-none absolute inset-0 w-1/3 -skew-x-12 animate-[board-sheen_9s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      <div className="absolute left-[23.75%] top-[13.33%] flex h-[42.96%] w-[52.5%] flex-col items-center justify-center gap-[2.4cqw] overflow-hidden [container-type:inline-size]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-6 animate-[board-scan_5s_ease-in-out_infinite] bg-gradient-to-b from-board-lime/25 to-transparent" />
        <div className="max-w-full whitespace-nowrap font-mono text-[clamp(6px,1.6cqw,12px)] font-bold tracking-[0.4em] text-[#7C9A2E]">
          THE BOARDROOM · SEASON 01
        </div>
        <div
          className="max-w-full text-balance text-center font-mono text-[clamp(15px,9.2cqw,68px)] font-extrabold leading-[1.02] tracking-[-0.03em] text-board-lime [animation:board-slamin_700ms_200ms_cubic-bezier(0.2,1.5,0.4,1)_both,board-glow_5s_1s_ease-in-out_infinite]"
        >
          THE COMMUNITY DECIDES
          <br />
          WHO LAUNCHES
        </div>
        <div className="max-w-full text-center font-mono text-[clamp(7px,2cqw,15px)] font-bold leading-[1.3] tracking-[0.02em] text-board-heading-alt">
          8 projects pitch. You vote. One launches.
        </div>
      </div>

      <div className="absolute right-[clamp(12px,2.4cqw,48px)] top-[clamp(10px,1.6cqw,26px)] border border-[rgba(204,255,0,0.22)] bg-[rgba(4,6,10,0.72)] px-[clamp(9px,1.1cqw,15px)] py-[clamp(6px,0.8cqw,11px)] text-right font-mono text-[clamp(8px,1.05cqw,15px)] leading-[1.6] tracking-[0.06em] text-[#B9C9A2] backdrop-blur-sm">
        CONFERENCE ROOM · THE BOARDROOM
        <br />
        <span className="font-bold text-board-lime">12,481 SEATED</span>
      </div>
    </div>
  );
}
