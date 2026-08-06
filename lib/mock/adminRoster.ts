import type { ProjectKey } from "@/lib/types";

export type ProjectStatus = "APPROVED" | "ONBOARDING";
export type VideoStatus = "APPROVED" | "AWAITING SUBMISSION";

export interface AdminProjectMeta {
  key: ProjectKey;
  founder: string;
  status: ProjectStatus;
  videoStatus: VideoStatus;
  assetsDone: number;
  teamText: string;
}

/** Operator-only view of the roster — kept separate from the public
 *  `Project` type (lib/types.ts) rather than adding admin fields there. */
export const ADMIN_ROSTER: AdminProjectMeta[] = [
  { key: "A", founder: "Mira Okonkwo", status: "APPROVED", videoStatus: "APPROVED", assetsDone: 6, teamText: "Mira Okonkwo (Founder, @miraok), Devin Pratt (Protocol, @dev_pratt), 2 pseudonymous contributors." },
  { key: "B", founder: "Sasha Reyes", status: "APPROVED", videoStatus: "APPROVED", assetsDone: 6, teamText: "Sasha Reyes (Founder, @sashabuilds), 1 pseudonymous contributor." },
  { key: "C", founder: "Tobias Lund", status: "APPROVED", videoStatus: "APPROVED", assetsDone: 5, teamText: "Tobias Lund (Founder, @toblund), 2 pseudonymous contributors." },
  { key: "D", founder: "Ines Duval", status: "APPROVED", videoStatus: "APPROVED", assetsDone: 6, teamText: "Ines Duval (Founder, @inesduval), Ray Castellanos (Data, @raycstl), Priya Nadkarni (Audio, @priyandk), 2 pseudonymous." },
  { key: "E", founder: "Omar Haddad", status: "APPROVED", videoStatus: "APPROVED", assetsDone: 6, teamText: "Omar Haddad (Founder, @omarhaddad), June Park (Risk, @junepark)." },
  { key: "F", founder: "Cal Whitaker", status: "APPROVED", videoStatus: "APPROVED", assetsDone: 5, teamText: "Cal Whitaker (Founder, @calwhitaker), 2 pseudonymous contributors." },
  { key: "G", founder: "Hana Suzuki", status: "APPROVED", videoStatus: "APPROVED", assetsDone: 6, teamText: "Hana Suzuki (Founder, @hanasuzuki), Gene Alvarez (Infra, @genealv), Nour Bakri (Audit, @nourbakri), Ted Moss (Ops, @tedmoss)." },
  { key: "H", founder: "Blake Iyer", status: "ONBOARDING", videoStatus: "AWAITING SUBMISSION", assetsDone: 3, teamText: "Blake Iyer (Founder, @blakeiyer) — traction and X profile still pending." },
];

export function getAdminMeta(key: string): AdminProjectMeta | undefined {
  return ADMIN_ROSTER.find((p) => p.key === key);
}

export function listAdminRoster(): AdminProjectMeta[] {
  return ADMIN_ROSTER;
}
