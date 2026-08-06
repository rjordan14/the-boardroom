"use client";

import { useEffect, useState } from "react";
import { formatCountdown } from "@/lib/utils/format";

export function CountdownTimer({
  target,
  className,
}: {
  target: string;
  className?: string;
}) {
  const targetMs = new Date(target).getTime();
  // null until mount: computing from Date.now() during SSR would bake a
  // stale timestamp into the HTML and risk a hydration mismatch against
  // the client's actual clock.
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setLabel(formatCountdown(targetMs - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  return <span className={className}>{label ?? formatCountdown(0)}</span>;
}
