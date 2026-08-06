export type ProjectKey = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";

export interface TeamMember {
  name: string;
  role: string;
  /** null = pseudonymous. A member is "doxxed" iff this is set. */
  handle: string | null;
}

export interface Project {
  key: ProjectKey;
  name: string;
  line: string;
  /** Path under /public, e.g. "/marks/ledgerboy.png" */
  mark: string;
  pitchSeconds: number;
  team: string;
  shipped: string;
  tokenPlan: string;
  risksDisclosed: string;
  x: string;
  site: string;
  thesis: string;
  people: TeamMember[];
}

export interface QaItem {
  id: string;
  projectKey: ProjectKey;
  asker: string;
  upvotes: number;
  question: string;
  answer: string | null;
  answeredBy: string | null;
  /** Auto-flagged for moderation review (e.g. "LIKELY SPAM"), null otherwise. */
  flag?: string | null;
}

export type RoomStatus = "open" | "closed" | "upcoming";

export interface Room {
  id: string;
  roundLabel: string;
  n: number;
  projectA: ProjectKey;
  projectB: ProjectKey;
  status: RoomStatus;
  closesAt: string;
}
