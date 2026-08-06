import type { ProjectKey } from "@/lib/types";

export interface FloorQuestion {
  id: string;
  projectKey: ProjectKey;
  question: string;
  upvotes: number;
  answered: boolean;
  answeredBy: string | null;
  answer: string | null;
}

export const FLOOR_QUESTIONS: FloorQuestion[] = [
  {
    id: "f1",
    projectKey: "A",
    question: "Who holds the multisig keys?",
    upvotes: 78,
    answered: true,
    answeredBy: "LEDGERBOY TEAM",
    answer:
      "Three signers, 2-of-3. Two are doxxed founders, the third is an outside auditor. Signer addresses are published in the repo and rotate every season.",
  },
  {
    id: "f2",
    projectKey: "B",
    question: "What's the plan if volume dies in month two?",
    upvotes: 41,
    answered: false,
    answeredBy: null,
    answer: null,
  },
];
