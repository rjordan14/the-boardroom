import type { ProjectKey } from "@/lib/types";

export interface Submission {
  id: string;
  projectKey: ProjectKey;
  when: string;
  length: string;
}

// Lengths match each project's pitchSeconds in lib/mock/projects.ts.
export const SUBMISSIONS: Submission[] = [
  { id: "s1", projectKey: "A", when: "3d ago", length: "2:28" },
  { id: "s2", projectKey: "H", when: "6h ago", length: "1:43" },
  { id: "s3", projectKey: "D", when: "1h ago", length: "2:21" },
];

export function listSubmissions(): Submission[] {
  return SUBMISSIONS;
}
