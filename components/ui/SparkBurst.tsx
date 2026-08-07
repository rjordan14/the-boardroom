/** A brief particle burst — drop it inside a `relative` upvote button,
 *  render conditionally (e.g. `{justVoted && <SparkBurst />}`) for
 *  ~500ms after the vote lands, then unmount it. Each spark's
 *  endpoint is carried via its own --spark-x/--spark-y custom
 *  properties, consumed by the shared board-spark-burst keyframe. */
const SPARKS = [
  { x: -12, y: -16, delay: "0s" },
  { x: 11, y: -14, delay: "0.03s" },
  { x: -16, y: 3, delay: "0.02s" },
  { x: 16, y: 5, delay: "0.05s" },
  { x: -3, y: -20, delay: "0.01s" },
  { x: 3, y: 12, delay: "0.06s" },
];

export function SparkBurst() {
  return (
    <span className="pointer-events-none absolute inset-0 overflow-visible">
      {SPARKS.map((s, i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-board-lime"
          style={
            {
              animation: `board-spark-burst 450ms ease-out ${s.delay} both`,
              "--spark-x": `${s.x}px`,
              "--spark-y": `${s.y}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </span>
  );
}
