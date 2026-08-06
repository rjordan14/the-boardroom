export function BackingTab() {
  return (
    <div className="max-w-[900px] px-[clamp(14px,4vw,48px)] py-7.5 pb-[70px]">
      <div className="font-mono text-[20px] font-extrabold text-board-heading">BACKING</div>
      <div className="mt-2 font-mono text-[11px] leading-[1.7] text-board-secondary">
        Read-only — backing never buys votes, and you can&apos;t influence who backs you. This is
        here so you know what&apos;s riding on the outcome.
      </div>

      <div className="mt-6.5 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
        <div className="border border-board-border-amber bg-board-card-amber p-4.5">
          <div className="font-mono text-[9px] font-bold tracking-[0.14em] text-[#7A6B42]">TOTAL BACKED</div>
          <div className="mt-2.5 font-mono text-[24px] font-extrabold text-board-amber">61,400</div>
        </div>
        <div className="border border-board-border-alt bg-board-card-alt p-4.5">
          <div className="font-mono text-[9px] font-bold tracking-[0.14em] text-board-tertiary">BACKERS</div>
          <div className="mt-2.5 font-mono text-[24px] font-extrabold text-board-heading">34</div>
        </div>
        <div className="border border-board-border-alt bg-board-card-alt p-4.5">
          <div className="font-mono text-[9px] font-bold tracking-[0.14em] text-board-tertiary">RANK VS OTHER 7</div>
          <div className="mt-2.5 font-mono text-[24px] font-extrabold text-board-heading">#2</div>
        </div>
      </div>

      <div className="mt-5 border border-board-border-alt bg-board-card-alt p-4.5 font-mono text-[11px] leading-[1.7] text-board-secondary">
        If you win and launch, backers convert at the fixed pre-round price with a vesting
        schedule — that&apos;s between them and the protocol. Nothing here requires action from
        you.
      </div>
    </div>
  );
}
