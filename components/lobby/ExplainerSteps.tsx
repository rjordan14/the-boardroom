const STEPS = [
  {
    n: "01",
    title: "CLOCK IN",
    body: "Punch into a room. Your wallet gets one ballot, and one only.",
  },
  {
    n: "02",
    title: "WATCH BOTH",
    body: "Two pitches, head to head. Skip either one and the ballot stays locked.",
  },
  {
    n: "03",
    title: "SEAL IT",
    body: "Clock out with your vote. Results stay sealed until the round closes.",
  },
];

export function ExplainerSteps() {
  return (
    <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3">
      {STEPS.map((step) => (
        <div
          key={step.n}
          className="animate-[board-floaty_5.6s_ease-in-out_infinite] border border-board-border bg-board-card-alt p-4 transition hover:-translate-y-1 hover:border-board-lime"
        >
          <div className="font-mono text-[10px] font-extrabold tracking-[0.18em] text-board-lime">
            {step.n} · {step.title}
          </div>
          <div className="mt-2.5 font-mono text-[11px] leading-[1.7] text-board-secondary">
            {step.body}
          </div>
        </div>
      ))}
    </div>
  );
}
