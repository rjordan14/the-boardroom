/** The VS mark between two projects — float bob (matches the design
 *  handoff) plus a periodic squash/rotate "impact" beat layered on
 *  top, on request, for a bit more competitive energy. `className`
 *  carries sizing/alignment (goes on the wrapper, not the image, so
 *  the two animations can each own their own element). */
export function VsMark({ className }: { className?: string }) {
  return (
    <span className={`inline-block animate-[board-floaty_4.2s_ease-in-out_infinite] ${className ?? ""}`}>
      <img
        src="/marks/vs.png"
        alt="VS"
        className="block h-full w-full"
        style={{ animation: "board-vs-impact 3.6s ease-in-out infinite" }}
      />
    </span>
  );
}
