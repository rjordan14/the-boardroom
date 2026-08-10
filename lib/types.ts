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
  /** When the question was asked — lets the feed show "how stale is this?"
   *  instead of pure upvote-count with no sense of time. */
  postedAt: number;
}

/** Freeform commentary, separate from the Q&A ask/answer flow — no
 *  answer field, no team reply, just the crowd talking. */
export interface Comment {
  id: string;
  projectKey: ProjectKey;
  author: string;
  text: string;
  postedAt: number;
  likes: number;
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
