import type { ReactNode } from "react";
import Link from "next/link";

export function Header({
  left,
  right,
}: {
  left?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="sticky top-0 z-40 flex flex-wrap items-center gap-2 border-b border-[#161914] bg-board-bg px-[clamp(14px,4vw,48px)] py-4">
      <Link
        href="/"
        className="border-b-2 border-board-lime pb-1 font-mono text-[13px] font-extrabold tracking-[0.12em] text-board-lime"
      >
        THE BOARDROOM
      </Link>
      {left}
      <div className="ml-auto flex items-center gap-3.5">
        <Link
          href="/my-activity"
          className="border border-dashed border-[#3D4536] px-3.5 py-2.5 font-mono text-[10px] font-bold tracking-[0.1em] text-board-secondary transition hover:border-board-lime hover:text-board-lime"
        >
          MY ACTIVITY
        </Link>
        {right}
      </div>
    </div>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="ml-2 font-mono text-[11px] text-board-secondary transition hover:text-board-lime"
    >
      ← {label}
    </Link>
  );
}

export function WalletChip({
  address,
  eligible,
}: {
  address: string;
  eligible: boolean;
}) {
  return (
    <div
      className={
        eligible
          ? "border border-board-border px-3.5 py-2.5 font-mono text-[11px] text-board-body"
          : "border border-board-border-amber-alt px-3.5 py-2.5 font-mono text-[11px] text-board-amber"
      }
    >
      {address}
      {!eligible && " · NOT ELIGIBLE"}
    </div>
  );
}
