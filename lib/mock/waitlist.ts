export interface WaitlistApplicant {
  id: string;
  name: string;
  founder: string;
  x: string;
  line: string;
  when: string;
}

export const WAITLIST: WaitlistApplicant[] = [
  { id: "w1", name: "DEADWEIGHT DAO", founder: "Priya Malhotra", x: "@deadweightdao", line: "Governance for tokens whose founders vanished.", when: "2d ago" },
  { id: "w2", name: "SLIPPAGE SALOON", founder: "Nate Okafor", x: "@slippagesaloon", line: "A trading arena where the house edge is public and onchain.", when: "5d ago" },
  { id: "w3", name: "COLD STORAGE CLUB", founder: "Wren Sato", x: "@coldstorageclub", line: "Time-locked vaults with social accountability built in.", when: "1w ago" },
];

export function listWaitlist(): WaitlistApplicant[] {
  return WAITLIST;
}
