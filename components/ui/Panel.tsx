import type { HTMLAttributes } from "react";
import clsx from "clsx";

type PanelTone = "default" | "amber" | "success" | "error";

const toneClasses: Record<PanelTone, string> = {
  default: "border-board-border-alt bg-board-card-alt",
  amber: "border-board-border-amber bg-board-card-amber",
  success: "border-board-border-voting bg-board-card-alt",
  error: "border-board-border-error bg-board-card-error",
};

export function Panel({
  tone = "default",
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { tone?: PanelTone }) {
  return (
    <div
      className={clsx("border", toneClasses[tone], className)}
      {...props}
    />
  );
}
