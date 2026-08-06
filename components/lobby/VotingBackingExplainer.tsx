export function VotingBackingExplainer() {
  return (
    <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3">
      <div className="border border-board-border-voting bg-board-card-alt p-4">
        <div className="flex items-center gap-2">
          <span className="block h-2 w-2 bg-board-lime" />
          <span className="font-mono text-[10px] font-extrabold tracking-[0.16em] text-board-lime">
            VOTING · ALWAYS FREE
          </span>
        </div>
        <div className="mt-2.5 font-mono text-[11px] leading-[1.7] text-board-secondary">
          One eligible wallet, one vote — eligible meaning a wallet with prior
          Robinhood Chain activity or any StonkBroker NFT. Holding more
          $STONKBROKER, more NFTs or a higher tier does{" "}
          <span className="text-board-lime">not</span> buy influence.
        </div>
      </div>
      <div className="relative overflow-hidden border-2 border-board-amber bg-gradient-to-b from-[#1A150B] to-[#12100A] p-4">
        <div className="flex items-center gap-2">
          <span className="block h-2 w-2 animate-[board-pulse_2.2s_ease-in-out_infinite] bg-board-amber" />
          <span className="font-mono text-[10px] font-extrabold tracking-[0.16em] text-board-amber">
            BACKING · OPTIONAL
          </span>
        </div>
        <div className="mt-2.5 font-mono text-[11px] leading-[1.7] text-[#C4B893]">
          After you vote, you can escrow $STONKBROKER on a project. If it
          wins <span className="text-board-amber">and</span> launches, you
          claim its token. Otherwise you reclaim everything.
        </div>
      </div>
    </div>
  );
}
