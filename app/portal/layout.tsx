import type { ReactNode } from "react";
import { getQaForProject } from "@/lib/api/qa";
import { PortalGateShell } from "@/components/portal/PortalGateShell";

/** The portal is scoped to one project's team — LEDGERBOY, matching the
 *  design mock. No per-project switching, same as the design. */
const PORTAL_PROJECT_KEY = "A";

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const qa = await getQaForProject(PORTAL_PROJECT_KEY);

  return (
    <div data-screen="portal">
      <PortalGateShell qa={qa}>{children}</PortalGateShell>
    </div>
  );
}
