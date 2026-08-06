import clsx from "clsx";

export function ProgressBar({
  percent,
  className,
  trackClassName,
  fillClassName,
}: {
  percent: number;
  className?: string;
  trackClassName?: string;
  fillClassName?: string;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      className={clsx("h-1.5 bg-board-border", trackClassName, className)}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        // fillClassName replaces the default fill color rather than being
        // appended after it — two `bg-*` utility classes on one element
        // don't reliably resolve in class-list order (Tailwind's own
        // generated-CSS order decides, not JSX order), so a caller's
        // override color could silently lose to this default.
        className={clsx("h-full transition-[width]", fillClassName || "bg-board-lime")}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
