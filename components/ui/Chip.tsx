import type { HTMLAttributes } from "react";
import clsx from "clsx";

export function Chip({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "border border-board-border px-3.5 py-2.5 font-mono text-[11px] text-board-body",
        className
      )}
      {...props}
    />
  );
}
