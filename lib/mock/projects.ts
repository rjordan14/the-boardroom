import type { Project } from "@/lib/types";

/**
 * Ported from the design prototype's own PROJ constant
 * (The Boardroom - prototype.dc.html) — already well-shaped as seed data.
 * Building against all 8 projects/marks, not the hero copy's "16" —
 * see README "Assets" section and the plan's Flags section.
 */
export const PROJECTS: Record<string, Project> = {
  A: {
    key: "A",
    name: "LEDGERBOY",
    line: "Onchain receipts for people who lose them",
    mark: "/marks/ledgerboy.png",
    pitchSeconds: 148,
    team: "4 contributors · 2 doxxed",
    shipped: "Testnet app · 3,100 wallets",
    tokenPlan: "Fee-share · no presale",
    risksDisclosed: "2 disclosed",
    x: "@ledgerboy",
    site: "ledgerboy.xyz",
    thesis:
      "Every onchain action leaves a receipt and nobody can read them. We turn raw transaction history into plain-language records you can search, export and hand to an accountant.",
    people: [
      { name: "Mira Okonkwo", role: "Founder", handle: "@miraok" },
      { name: "Devin Pratt", role: "Protocol", handle: "@dev_pratt" },
      { name: "pseudonymous", role: "Frontend", handle: null },
      { name: "pseudonymous", role: "Design", handle: null },
    ],
  },
  B: {
    key: "B",
    name: "VAULTMOUSE",
    line: "A savings vault that nags you like a broker",
    mark: "/marks/vaultmouse.png",
    pitchSeconds: 132,
    team: "2 contributors · 1 doxxed",
    shipped: "Closed beta · 640 wallets",
    tokenPlan: "Staking-gated · no presale",
    risksDisclosed: "3 disclosed",
    x: "@vaultmouse",
    site: "vaultmouse.app",
    thesis:
      "Savings apps fail because they are polite. Vaultmouse holds the deposit, tracks the goal, and escalates its nagging until you either fund it or admit you were never going to.",
    people: [
      { name: "Sasha Reyes", role: "Founder", handle: "@sashabuilds" },
      { name: "pseudonymous", role: "Contracts", handle: null },
    ],
  },
  C: {
    key: "C",
    name: "PAPERHANDS ANONYMOUS",
    line: "A commitment device for the weak-willed",
    mark: "/marks/paperhands.png",
    pitchSeconds: 118,
    team: "3 contributors · 1 doxxed",
    shipped: "Live mini-app · 1,900 wallets",
    tokenPlan: "Vesting-locked · no presale",
    risksDisclosed: "2 disclosed",
    x: "@paperhandsanon",
    site: "paperhands.group",
    thesis:
      "Selling early is a behavior problem, not an information problem. We give holders a voluntary lockup with a public commitment and a support group attached to it.",
    people: [
      { name: "Tobias Lund", role: "Founder", handle: "@toblund" },
      { name: "pseudonymous", role: "Contracts", handle: null },
      { name: "pseudonymous", role: "Community", handle: null },
    ],
  },
  D: {
    key: "D",
    name: "TICKERTAPE",
    line: "Read the tape. Out loud. In your feed.",
    mark: "/marks/tickertape.png",
    pitchSeconds: 141,
    team: "5 contributors · 3 doxxed",
    shipped: "Public beta · 5,200 wallets",
    tokenPlan: "Fee-share · no presale",
    risksDisclosed: "1 disclosed",
    x: "@tickertape",
    site: "tickertape.fm",
    thesis:
      "Market data is read in private and reacted to in public. Tickertape turns live tape into short narrated clips that post straight to your feed, so analysis becomes distribution.",
    people: [
      { name: "Ines Duval", role: "Founder", handle: "@inesduval" },
      { name: "Ray Castellanos", role: "Data", handle: "@raycstl" },
      { name: "Priya Nadkarni", role: "Audio", handle: "@priyandk" },
      { name: "pseudonymous", role: "Frontend", handle: null },
      { name: "pseudonymous", role: "Ops", handle: null },
    ],
  },
  E: {
    key: "E",
    name: "DIVIDEND DINER",
    line: "Yield you can order off a menu",
    mark: "/marks/dividenddiner.png",
    pitchSeconds: 138,
    team: "2 contributors · 2 doxxed",
    shipped: "Testnet · 870 wallets",
    tokenPlan: "Revenue-share · no presale",
    risksDisclosed: "3 disclosed",
    x: "@dividenddiner",
    site: "dividenddiner.xyz",
    thesis:
      "Yield products are priced like derivatives and explained like nothing at all. We put strategies on a menu with the risk, the term and the payout written the way a diner writes prices.",
    people: [
      { name: "Omar Haddad", role: "Founder", handle: "@omarhaddad" },
      { name: "June Park", role: "Risk", handle: "@junepark" },
    ],
  },
  F: {
    key: "F",
    name: "MARGIN CALL FM",
    line: "Onchain radio for liquidation season",
    mark: "/marks/margincallfm.png",
    pitchSeconds: 129,
    team: "3 contributors · 1 doxxed",
    shipped: "Closed beta · 410 wallets",
    tokenPlan: "Listener-gated · no presale",
    risksDisclosed: "2 disclosed",
    x: "@margincallfm",
    site: "margincall.fm",
    thesis:
      "Liquidation season has an audience and no broadcast. We run a continuous onchain radio station where the playlist is driven by what the market is doing right now.",
    people: [
      { name: "Cal Whitaker", role: "Founder", handle: "@calwhitaker" },
      { name: "pseudonymous", role: "Audio", handle: null },
      { name: "pseudonymous", role: "Contracts", handle: null },
    ],
  },
  G: {
    key: "G",
    name: "THE FILING CABINET",
    line: "Boring, audited, permanent storage",
    mark: "/marks/filingcabinet.png",
    pitchSeconds: 145,
    team: "4 contributors · 4 doxxed",
    shipped: "Mainnet · 8,400 wallets",
    tokenPlan: "Storage-fee share · no presale",
    risksDisclosed: "0 disclosed",
    x: "@filingcabinet",
    site: "filingcabinet.org",
    thesis:
      "Permanent storage should be boring. We audit, replicate and price archival storage on a flat schedule, and publish the audit so nobody has to trust us about it.",
    people: [
      { name: "Hana Suzuki", role: "Founder", handle: "@hanasuzuki" },
      { name: "Gene Alvarez", role: "Infra", handle: "@genealv" },
      { name: "Nour Bakri", role: "Audit", handle: "@nourbakri" },
      { name: "Ted Moss", role: "Ops", handle: "@tedmoss" },
    ],
  },
  H: {
    key: "H",
    name: "SEVEN FIGURE SODA",
    line: "A drink brand that settles onchain",
    mark: "/marks/sevenfiguresoda.png",
    pitchSeconds: 103,
    team: "2 contributors · 1 doxxed",
    shipped: "Prelaunch · 260 wallets",
    tokenPlan: "Royalty-gated · no presale",
    risksDisclosed: "4 disclosed",
    x: "@sevenfiguresoda",
    site: "sevenfigure.soda",
    thesis:
      "A drink brand is a supply chain and a loyalty program. We settle both onchain, so distributors get paid on delivery and drinkers hold something worth holding.",
    people: [
      { name: "Blake Iyer", role: "Founder", handle: "@blakeiyer" },
      { name: "pseudonymous", role: "Supply", handle: null },
    ],
  },
};

export function getProject(key: string): Project | undefined {
  return PROJECTS[key];
}

export function listProjects(): Project[] {
  return Object.values(PROJECTS);
}
