/**
 * The "ONE OF US" celebration banner from the design prototype's Sealed
 * screen — ported per design_handoff_the_boardroom/MOTION.md "Winner
 * celebration". Confetti timing is exact from the prototype markup, not
 * re-timed. The crowd itself deviates from MOTION.md's spec (one asset
 * hue-shifted 7 ways) — 6 distinct stonkbroker portraits were supplied
 * later and used as-is instead, no hue-rotate, since they're already
 * individually colored.
 */

const CONFETTI = [
  { left: "8%", duration: "2.6s", delay: "0s" },
  { left: "19%", duration: "3.1s", delay: "0.4s" },
  { left: "31%", duration: "2.4s", delay: "0.9s" },
  { left: "44%", duration: "3.4s", delay: "0.2s" },
  { left: "57%", duration: "2.8s", delay: "1.1s" },
  { left: "68%", duration: "3.2s", delay: "0.6s" },
  { left: "79%", duration: "2.5s", delay: "1.4s" },
  { left: "90%", duration: "3s", delay: "0.8s" },
];

const CROWD = [
  { src: "/marks/stonkbroker-crowd-1.jpg", size: 68, delay: "0s" },
  { src: "/marks/stonkbroker-crowd-2.jpg", size: 80, delay: "0.1s" },
  { src: "/marks/stonkbroker-crowd-3.jpg", size: 92, delay: "0.05s" },
  { src: "/marks/stonkbroker-crowd-4.jpg", size: 92, delay: "0.2s" },
  { src: "/marks/stonkbroker-crowd-5.jpg", size: 80, delay: "0.25s" },
  { src: "/marks/stonkbroker-crowd-6.png", size: 68, delay: "0.15s" },
];

export function CelebrationBanner() {
  return (
    <div className="relative h-[clamp(210px,21.5vw,300px)] w-full max-w-[1440px] overflow-hidden border-b border-[#1A1E17] bg-[#04060A]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 90% at 50% 100%, rgba(204,255,0,0.16), transparent 70%)",
        }}
      />

      <div className="absolute inset-x-0 top-11 overflow-hidden">
        <div className="flex w-max" style={{ animation: "board-marquee 9s linear infinite" }}>
          {[0, 1].map((i) => (
            <div
              key={i}
              className="flex-none whitespace-nowrap font-mono text-[clamp(26px,5vw,44px)] font-extrabold leading-none tracking-[0.06em] text-[#33441C]"
            >
              ONE OF US! ONE OF US! ONE OF US! ONE OF US!{" "}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-3 flex items-end justify-center gap-6.5">
        {CROWD.map((m, i) => (
          <img
            key={i}
            src={m.src}
            alt=""
            className="[image-rendering:pixelated]"
            style={{
              width: m.size,
              height: m.size,
              animation: `board-jump 0.9s infinite ${m.delay}`,
            }}
          />
        ))}
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-[26px] border-t-[3px] border-[#36421F] bg-gradient-to-b from-[#242D19] to-[#141A0E]"
        style={{ clipPath: "polygon(16% 0, 84% 0, 100% 100%, 0 100%)" }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {CONFETTI.map((c, i) => (
          <div
            key={i}
            className="absolute top-[-30px] h-5 w-4 bg-[#E8E4D4] shadow-[0_1px_0_#9A9784]"
            style={{
              left: c.left,
              animation: `board-fall ${c.duration} ${c.delay} linear infinite`,
            }}
          />
        ))}
      </div>

      <div
        className="absolute left-[clamp(14px,4vw,48px)] top-6 font-mono text-[11px] font-bold tracking-[0.2em] text-board-lime"
        style={{ animation: "board-pulse 2.2s infinite" }}
      >
        THE ROOM APPROVES
      </div>
    </div>
  );
}
