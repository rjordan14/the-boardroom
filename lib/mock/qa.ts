import type { QaItem } from "@/lib/types";

const HOUR = 3_600_000;

/** Ported from the prototype's QA constant, flattened to one list keyed by projectKey. */
export const QA_ITEMS: QaItem[] = [
  {
    id: "A-1",
    projectKey: "A",
    asker: "0x71…C3F0",
    upvotes: 38,
    question:
      "What happens to receipts if a wallet gets rotated to a new address?",
    answer:
      "Receipts are bound to the transaction hash, not the wallet — so history stays intact even if you move wallets. A linked-wallet view is on the testnet roadmap.",
    answeredBy: "LEDGERBOY TEAM",
    postedAt: Date.now() - 30 * HOUR,
  },
  {
    id: "A-2",
    projectKey: "A",
    asker: "0x4A…88E1",
    upvotes: 21,
    question:
      "Is the fee-share retroactive for testnet users, or only after mainnet launch?",
    answer:
      "Fee-share starts accruing at mainnet launch. Testnet activity counts toward an allowlist multiplier, not a token amount.",
    answeredBy: "LEDGERBOY TEAM",
    postedAt: Date.now() - 21 * HOUR,
  },
  {
    id: "A-3",
    projectKey: "A",
    asker: "0x0C…9942",
    upvotes: 9,
    question: "Any plan to support Solana receipts or is this EVM-only?",
    answer: null,
    answeredBy: null,
    postedAt: Date.now() - 3 * HOUR,
  },
  {
    id: "B-1",
    projectKey: "B",
    asker: "0x9E…21AB",
    upvotes: 44,
    question:
      "How aggressive are the nag notifications — can I mute them per-vault?",
    answer:
      "Yes — nag frequency is per-vault and capped at once a day by default. Fully mutable.",
    answeredBy: "VAULTMOUSE TEAM",
    postedAt: Date.now() - 40 * HOUR,
  },
  {
    id: "B-2",
    projectKey: "B",
    asker: "0x2F…7710",
    upvotes: 16,
    question:
      "What happens to a vault if the staking-gate contract gets upgraded?",
    answer: null,
    answeredBy: null,
    postedAt: Date.now() - 6 * HOUR,
  },
  {
    id: "F-1",
    projectKey: "F",
    asker: "0x4E…2290",
    upvotes: 12,
    question: "Is liquidation audio generated live or pre-recorded?",
    answer: "Live, pulled from onchain events.",
    answeredBy: "MARGIN CALL FM TEAM",
    postedAt: Date.now() - 18 * HOUR,
  },
  {
    id: "H-1",
    projectKey: "H",
    asker: "0x22…88AF",
    upvotes: 1,
    question: "buy my coin!!! check bio for 100x gem",
    answer: null,
    answeredBy: null,
    flag: "LIKELY SPAM",
    postedAt: Date.now() - 1 * HOUR,
  },
];

export function getQaForProject(projectKey: string): QaItem[] {
  return QA_ITEMS.filter((q) => q.projectKey === projectKey).sort(
    (a, b) => b.upvotes - a.upvotes
  );
}

export function listAllQa(): QaItem[] {
  return QA_ITEMS;
}
