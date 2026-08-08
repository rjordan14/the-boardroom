"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/** Header nav links didn't reflect which page you were already on —
 *  same complaint that motivated the Room tab bar's "NOW SHOWING"
 *  treatment, applied here. Needs its own pathname read, so it's the
 *  one client piece inside an otherwise server-rendered Header. */
export function HeaderNavLink({
  href,
  variant = "outline",
  children,
}: {
  href: string;
  variant?: "outline" | "filled";
  children: ReactNode;
}) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  if (active) {
    return (
      <Link
        href={href}
        className="border-2 border-board-lime bg-[#141A06] px-3.5 py-2.5 font-mono text-[10px] font-bold tracking-[0.1em] text-board-lime"
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={
        variant === "filled"
          ? "border border-board-border bg-[#0E110C] px-3.5 py-2.5 font-mono text-[10px] font-bold tracking-[0.1em] text-board-body transition hover:border-board-lime hover:bg-[#12160A] hover:text-board-lime"
          : "border border-board-border-alt px-3.5 py-2.5 font-mono text-[10px] font-bold tracking-[0.1em] text-board-secondary transition hover:border-board-lime hover:text-board-lime"
      }
    >
      {children}
    </Link>
  );
}
