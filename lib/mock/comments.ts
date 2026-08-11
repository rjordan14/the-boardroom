import type { Comment } from "@/lib/types";

/** Timestamps are relative offsets from "now" at import time so the
 *  feed always reads as recent regardless of when this session runs. */
const now = Date.now();
const minsAgo = (n: number) => now - n * 60_000;

export const COMMENTS: Comment[] = [
  { id: "c-A-1", projectKey: "A", author: "ryglizzy", text: "the multisig answer actually made me trust these guys more", postedAt: minsAgo(14), likes: 12 },
  { id: "c-A-2", projectKey: "A", author: "0x1B7…44Ef", text: "onchain receipts is such an unsexy pitch and that's exactly why it'll work", postedAt: minsAgo(41), likes: 27 },
  { id: "c-A-3", projectKey: "A", author: "0x6C0…91Bd", text: "still waiting on the linked-wallet view tbh", postedAt: minsAgo(120), likes: 6 },

  { id: "c-B-1", projectKey: "B", author: "toco4prez", text: "vaultmouse nagged me into not selling my bag last week, unreal", postedAt: minsAgo(9), likes: 34 },
  { id: "c-B-2", projectKey: "B", author: "0x77D…5F1a", text: "the staking-gate cooldown feels a little aggressive ngl", postedAt: minsAgo(55), likes: 9 },
  { id: "c-B-3", projectKey: "B", author: "0xE21…9B44", text: "sasha answering her own DMs at 2am is a good sign", postedAt: minsAgo(190), likes: 41 },

  { id: "c-C-1", projectKey: "C", author: "degenduck", text: "paperhands anonymous but the commitment device actually works, embarrassing to admit", postedAt: minsAgo(22), likes: 19 },
  { id: "c-C-2", projectKey: "C", author: "0x0F3…77Ac", text: "the weak-willed branding is doing numbers in my group chat", postedAt: minsAgo(67), likes: 15 },

  { id: "c-D-1", projectKey: "D", author: "0x8E1…C093", text: "tickertape's audio feed is genuinely relaxing during a red day, weirdly", postedAt: minsAgo(6), likes: 8 },
  { id: "c-D-2", projectKey: "D", author: "moonpumpkin", text: "read the tape out loud in your feed is such a specific hook and it works", postedAt: minsAgo(88), likes: 22 },
  { id: "c-D-3", projectKey: "D", author: "0x5A0…B231", text: "priya's audio design carries this whole thing honestly", postedAt: minsAgo(150), likes: 17 },

  { id: "c-E-1", projectKey: "E", author: "satoshi_stan", text: "dividend diner's liquidation menu bit is funnier than it has any right to be", postedAt: minsAgo(18), likes: 31 },
  { id: "c-E-2", projectKey: "E", author: "0x611…D9A2", text: "yield you can order off a menu is either genius or a lawsuit waiting to happen", postedAt: minsAgo(72), likes: 13 },

  { id: "c-F-1", projectKey: "F", author: "wagmi_walt", text: "margin call fm playing liquidation sirens as a jingle is unhinged and I love it", postedAt: minsAgo(11), likes: 45 },
  { id: "c-F-2", projectKey: "F", author: "0xA24…6C15", text: "cal's the only founder in this whole season who does bits during the pitch", postedAt: minsAgo(95), likes: 20 },

  { id: "c-G-1", projectKey: "G", author: "0x7E9…3A02", text: "the filing cabinet is boring on purpose and it's the most trustworthy pitch in the round", postedAt: minsAgo(4), likes: 5 },
  { id: "c-G-2", projectKey: "G", author: "apedaddy", text: "four person team with an actual auditor on staff, that's rare this season", postedAt: minsAgo(60), likes: 24 },
  { id: "c-G-3", projectKey: "G", author: "0x88C…D170", text: "permanent storage is not a meme it's just correct", postedAt: minsAgo(133), likes: 11 },

  { id: "c-H-1", projectKey: "H", author: "0x4B2…E608", text: "seven figure soda settling onchain is the most 2026 sentence I've read all week", postedAt: minsAgo(3), likes: 3 },
  { id: "c-H-2", projectKey: "H", author: "0xC90…1D5E", text: "blake's supply chain answers were more detailed than half the tokenomics decks I've seen", postedAt: minsAgo(48), likes: 16 },
];

export function getCommentsForProject(projectKey: string): Comment[] {
  return COMMENTS.filter((c) => c.projectKey === projectKey).sort((a, b) => b.postedAt - a.postedAt);
}

export function listAllComments(): Comment[] {
  return [...COMMENTS].sort((a, b) => b.postedAt - a.postedAt);
}
