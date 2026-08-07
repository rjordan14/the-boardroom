/**
 * The "ONE OF US" celebration banner from the design prototype's Sealed
 * screen — ported per design_handoff_the_boardroom/MOTION.md "Winner
 * celebration", then deliberately amplified past the spec (more
 * confetti, brighter/faster ticker, a second counter-scrolling layer)
 * per explicit feedback that the original port read as too subdued.
 * The crowd also deviates from MOTION.md (one asset hue-shifted 7
 * ways) — 6 distinct stonkbroker portraits were supplied later and
 * used as-is instead, no hue-rotate, since they're already
 * individually colored.
 */

const CONFETTI_COLORS = [
  { fill: "#E8E4D4", shadow: "#9A9784" },
  { fill: "#CCFF00", shadow: "#82A200" },
  { fill: "#E5B531", shadow: "#8A6A14" },
];

const CONFETTI = Array.from({ length: 20 }, (_, i) => {
  const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
  return {
    left: `${(i * 5.1) % 98}%`,
    duration: `${1.6 + ((i * 0.37) % 1.8)}s`,
    delay: `${(i * 0.23) % 2}s`,
    size: 12 + (i % 3) * 4,
    ...color,
  };
});

const CROWD = [
  { src: "/marks/stonkbroker-crowd-1.jpg", size: 68, delay: "0s", duration: "0.85s" },
  { src: "/marks/stonkbroker-crowd-2.jpg", size: 80, delay: "0.1s", duration: "0.72s" },
  { src: "/marks/stonkbroker-crowd-3.jpg", size: 92, delay: "0.05s", duration: "0.9s" },
  { src: "/marks/stonkbroker-crowd-4.jpg", size: 92, delay: "0.2s", duration: "0.68s" },
  { src: "/marks/stonkbroker-crowd-5.jpg", size: 80, delay: "0.25s", duration: "0.95s" },
  { src: "/marks/stonkbroker-crowd-6.png", size: 68, delay: "0.15s", duration: "0.78s" },
];

function TickerRow({
  speed,
  size,
  color,
  glow,
}: {
  speed: string;
  size: string;
  color: string;
  glow?: boolean;
}) {
  return (
    <div
      className="flex w-max"
      style={{ animation: `board-marquee ${speed} linear infinite`, gap: `calc(${size} * 0.55)` }}
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          className="flex-none whitespace-nowrap font-mono font-extrabold leading-none tracking-[0.06em]"
          style={{
            fontSize: size,
            color,
            animation: glow ? "board-glow 1.6s ease-in-out infinite" : undefined,
          }}
        >
          ONE OF US! ONE OF US! ONE OF US! ONE OF US! ONE OF US!
        </div>
      ))}
    </div>
  );
}

export function CelebrationBanner() {
  return (
    <div className="relative h-[clamp(210px,21.5vw,300px)] w-full max-w-[1440px] overflow-hidden border-b border-[#1A1E17] bg-[#04060A]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 90% at 50% 100%, rgba(204,255,0,0.22), transparent 70%)",
        }}
      />

      <div className="absolute inset-x-0 top-3 overflow-hidden opacity-40">
        <TickerRow speed="7s" size="clamp(14px,2.6vw,24px)" color="#5C7A1E" />
      </div>
      <div className="absolute inset-x-0 top-11 overflow-hidden">
        <TickerRow speed="5s" size="clamp(28px,5.6vw,50px)" color="#CCFF00" glow />
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
              animation: `board-jump ${m.duration} infinite ${m.delay}`,
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
            className="absolute top-[-30px]"
            style={{
              left: c.left,
              width: c.size * 0.8,
              height: c.size,
              background: c.fill,
              boxShadow: `0 1px 0 ${c.shadow}`,
              animation: `board-fall ${c.duration} ${c.delay} linear infinite`,
            }}
          />
        ))}
      </div>

      <div
        className="absolute left-[clamp(14px,4vw,48px)] bottom-3 font-mono text-[11px] font-bold tracking-[0.2em] text-board-lime"
        style={{ animation: "board-pulse 2.2s infinite" }}
      >
        THE ROOM APPROVES
      </div>
    </div>
  );
}
