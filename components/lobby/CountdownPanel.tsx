import Link from "next/link";
import { CountdownTimer } from "@/components/ui/CountdownTimer";

export function CountdownPanel({
  closesAt,
  firstOpenRoomId,
}: {
  closesAt: string;
  firstOpenRoomId: string;
}) {
  return (
    <div className="border-2 border-dashed border-board-lime bg-gradient-to-b from-[#141B08] to-[#0F1407] p-[clamp(20px,2vw,28px)] shadow-[0_0_0_1px_rgba(204,255,0,0.10),0_14px_44px_rgba(204,255,0,0.13)]">
      <div className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.22em] text-[#9AB63C]">
        <span className="block h-[7px] w-[7px] animate-[board-pulse_1.5s_ease-in-out_infinite] rounded-full bg-board-lime" />
        QUARTERFINAL CLOSES IN
      </div>
      <div className="mt-3.5 animate-[board-tick-pulse_2s_ease-in-out_infinite] font-mono text-[clamp(34px,3.6vw,52px)] font-extrabold leading-none tracking-[-0.02em] text-board-lime [text-shadow:0_0_30px_rgba(204,255,0,0.28)]">
        <CountdownTimer target={closesAt} />
      </div>
      <div className="mt-3 font-mono text-[10px] text-board-secondary-alt">
        9,204 ballots sealed
      </div>

      <Link
        href={`/room/${firstOpenRoomId}`}
        className="mt-5 block bg-board-lime px-4 py-5 text-center font-mono text-[clamp(12px,1.15vw,15px)] font-extrabold leading-[1.2] tracking-[0.1em] text-board-bg shadow-[0_5px_0_#82A200] transition hover:bg-board-lime-hover"
      >
        CLOCK IN TO BOARDROOM TO VOTE →
      </Link>
      <div className="mt-2.5 text-center font-mono text-[9px] leading-[1.6] text-board-tertiary">
        Takes about 5 minutes · two pitches, one ballot
      </div>
    </div>
  );
}
