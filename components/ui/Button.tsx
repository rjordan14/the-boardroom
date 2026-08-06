import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "amber" | "outline" | "ghost";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-2 border-board-lime bg-board-lime text-board-bg shadow-[0_3px_0_#82A200] hover:brightness-105 active:translate-y-1 active:shadow-none",
  amber:
    "border-2 border-board-amber bg-board-amber text-[#15130A] shadow-[0_3px_0_#8A6A14] hover:brightness-105 active:translate-y-1 active:shadow-none",
  outline:
    "border border-board-border text-board-secondary hover:border-board-lime hover:text-board-lime",
  ghost: "border border-transparent text-board-tertiary hover:text-board-lime",
};

export function Button({
  variant = "primary",
  className,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      disabled={disabled}
      className={clsx(
        "px-5 py-3.5 font-mono text-[11px] font-extrabold uppercase tracking-[0.12em] transition",
        disabled
          ? "cursor-not-allowed border border-board-border text-board-disabled"
          : clsx("cursor-pointer", variantClasses[variant]),
        className
      )}
      {...props}
    />
  );
}
