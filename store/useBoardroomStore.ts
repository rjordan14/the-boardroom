"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Comment, ProjectKey } from "@/lib/types";

interface WatchProgress {
  pA: number;
  pB: number;
}

// Single shared reference for "no entry yet" so a selector reading a
// room with no stored progress returns a stable object identity across
// renders — a fresh `{ pA: 0, pB: 0 }` literal on every call breaks
// useSyncExternalStore's reference-equality check and causes an
// infinite render loop ("Maximum update depth exceeded").
const EMPTY_PROGRESS: WatchProgress = { pA: 0, pB: 0 };

export interface SubmittedQuestion {
  id: string;
  question: string;
  askedAt: number;
}

// Same reference-stability concern as EMPTY_PROGRESS above, for
// projects with no locally-submitted questions yet.
const EMPTY_QUESTIONS: SubmittedQuestion[] = [];

export interface PitchReaction {
  id: string;
  emoji: string;
  /** Simulated playback position (seconds) when this was fired — later
   *  viewers replay it as their own playback crosses this mark. */
  atSeconds: number;
}

const EMPTY_REACTIONS: PitchReaction[] = [];

const EMPTY_COMMENTS: Comment[] = [];

interface BoardroomState {
  /** Keyed by roomId. Lifted out of the Room page so progress survives
   *  navigating to Compare and back, matching the prototype's single-
   *  component behavior now that each screen is a real route. */
  watchProgress: Record<string, WatchProgress>;
  setWatchProgress: (roomId: string, key: "pA" | "pB", value: number) => void;

  /** Keyed by roomId — wall-clock time this wallet first started
   *  watching, for the Lobby's "WATCHING NOW · IN {time}" display
   *  (matches the design handoff's TIME CARD, which shows real
   *  clock-in/out times rather than elapsed playback duration). */
  watchStartedAt: Record<string, number>;

  modalProjectKey: string | null;
  openProfileModal: (projectKey: string) => void;
  closeProfileModal: () => void;

  /** Keyed by roomId — which project a wallet sealed its ballot for. */
  ballotChoice: Record<string, string>;
  setBallotChoice: (roomId: string, projectKey: string) => void;

  /** Keyed by roomId — wall-clock time the ballot was sealed, for the
   *  Lobby's TIME CARD "OUT" timestamp. */
  ballotSealedAt: Record<string, number>;

  /** Keyed by roomId — optional backing escrow chosen on the Sealed screen. */
  backing: Record<string, { amount: number; escrowed: boolean }>;
  setBackingAmount: (roomId: string, amount: number) => void;
  setBackingEscrowed: (roomId: string, escrowed: boolean) => void;

  /** Keyed by Q&A item id (mock items and locally-submitted ones share
   *  the id namespace, both are unique strings). */
  qaUpvotes: Record<string, boolean>;
  toggleQaUpvote: (qaId: string) => void;

  /** Keyed by projectKey — questions asked from the Project Profile
   *  screen this session. No backend to post to, so this IS the record. */
  submittedQuestions: Record<string, SubmittedQuestion[]>;
  submitQuestion: (projectKey: string, question: string) => void;
  retractQuestion: (projectKey: string, id: string) => void;

  /** Keyed by project.key (a pitch belongs to the project, not a room —
   *  reused if the same project ever appears in a replayed room). Every
   *  reaction anyone has fired replays for later viewers as their own
   *  simulated playback crosses `atSeconds` — see
   *  components/room/PitchReactionLayer.tsx. */
  pitchReactions: Record<string, PitchReaction[]>;
  addPitchReaction: (projectKey: string, emoji: string, atSeconds: number) => void;

  /** Freeform comments, separate from the Q&A ask/answer flow — keyed
   *  by projectKey. Mock seed comments live in lib/mock/comments.ts;
   *  this is only the locally-posted ones, merged client-side same as
   *  submittedQuestions above. */
  postedComments: Record<string, Comment[]>;
  postComment: (projectKey: ProjectKey, author: string, text: string) => void;
  commentLikes: Record<string, boolean>;
  toggleCommentLike: (commentId: string) => void;

  /** Keyed by projectKey — no real notifications behind this yet, but
   *  it's a genuine toggle (not a dead click dressed as a Link, which
   *  is what this replaced on the Result screen). */
  followedProjects: Record<string, boolean>;
  toggleFollow: (projectKey: string) => void;

  /** Cosmetic-only for now (leaderboard/profile flex) — see the
   *  session's points-system decision: never touches vote weight. */
  points: number;
  pointsLog: PointsLogEntry[];
  awardPoints: (amount: number, reason: string) => void;

  /** Keyed by projectKey — the live "king of the hill" head-to-head
   *  between that project's two top-upvoted not-yet-crowned questions.
   *  One battle at a time per project; resolves on a timer (see
   *  BATTLE_DURATION_MS in QaBattle.tsx) into `crowns`. */
  battles: Record<string, QaBattle>;
  startBattle: (projectKey: string, aId: string, bId: string, seedA: number, seedB: number) => void;
  /** battleKey = `${projectKey}:${aId}:${bId}` — scopes a user's vote to
   *  this specific pairing so a later, different pairing isn't silently
   *  pre-voted by a stale key collision. */
  battleVotes: Record<string, "A" | "B">;
  castBattleVote: (projectKey: string, battleKey: string, side: "A" | "B") => void;
  /** Keyed by projectKey — most recent champion; a fresh battle winner
   *  replaces it (dethroning, not accumulating a full history). */
  crowns: Record<string, Crown>;
  resolveBattle: (projectKey: string, battleKey: string, winner: Crown, winningSide: "A" | "B") => void;

  /** Wipes every field above back to its just-clocked-in-for-the-first-
   *  time state — watch progress, ballots, comments, questions, points,
   *  all of it. This is the only "real" reset available: there's no
   *  backend to reset instead, so a wallet's local storage IS its whole
   *  history (see the module comment on the persist() call below). Exists
   *  for demo prep, where leftover progress from earlier testing makes a
   *  room skip straight to "already watched" instead of starting fresh. */
  resetActivity: () => void;
}

export interface PointsLogEntry {
  id: string;
  amount: number;
  reason: string;
  at: number;
}

export interface QaBattle {
  aId: string;
  bId: string;
  votesA: number;
  votesB: number;
  startedAt: number;
}

export interface Crown {
  questionId: string;
  question: string;
  asker: string;
  wonAt: number;
}

// Persisted to localStorage — this is a wallet's whole session (votes,
// watch progress, comments, points…), and losing it on an ordinary
// page refresh made "did I already vote here?" impossible to answer
// after the fact. No real backend exists behind any of this yet, so
// the browser's own storage is the only record there is.
export const useBoardroomStore = create<BoardroomState>()(
  persist(
    (set, get) => ({
  watchProgress: {},
  setWatchProgress: (roomId, key, value) =>
    set((state) => ({
      watchProgress: {
        ...state.watchProgress,
        [roomId]: { ...(state.watchProgress[roomId] ?? EMPTY_PROGRESS), [key]: value },
      },
      watchStartedAt: state.watchStartedAt[roomId]
        ? state.watchStartedAt
        : { ...state.watchStartedAt, [roomId]: Date.now() },
    })),

  watchStartedAt: {},

  modalProjectKey: null,
  openProfileModal: (projectKey) => set({ modalProjectKey: projectKey }),
  closeProfileModal: () => set({ modalProjectKey: null }),

  ballotChoice: {},
  setBallotChoice: (roomId, projectKey) => {
    set((state) => ({
      ballotChoice: { ...state.ballotChoice, [roomId]: projectKey },
      ballotSealedAt: { ...state.ballotSealedAt, [roomId]: Date.now() },
    }));
    get().awardPoints(25, "Ballot sealed");
  },

  ballotSealedAt: {},

  backing: {},
  setBackingAmount: (roomId, amount) =>
    set((state) => ({
      backing: {
        ...state.backing,
        [roomId]: { amount, escrowed: state.backing[roomId]?.escrowed ?? false },
      },
    })),
  setBackingEscrowed: (roomId, escrowed) => {
    set((state) => ({
      backing: {
        ...state.backing,
        [roomId]: { amount: state.backing[roomId]?.amount ?? 888, escrowed },
      },
    }));
    if (escrowed) get().awardPoints(15, "Backed a project");
  },

  qaUpvotes: {},
  toggleQaUpvote: (qaId) =>
    set((state) => ({
      qaUpvotes: { ...state.qaUpvotes, [qaId]: !state.qaUpvotes[qaId] },
    })),

  submittedQuestions: {},
  submitQuestion: (projectKey, question) => {
    set((state) => ({
      submittedQuestions: {
        ...state.submittedQuestions,
        [projectKey]: [
          ...(state.submittedQuestions[projectKey] ?? EMPTY_QUESTIONS),
          { id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, question, askedAt: Date.now() },
        ],
      },
    }));
    get().awardPoints(5, "Asked a question");
  },
  retractQuestion: (projectKey, id) =>
    set((state) => ({
      submittedQuestions: {
        ...state.submittedQuestions,
        [projectKey]: (state.submittedQuestions[projectKey] ?? EMPTY_QUESTIONS).filter((q) => q.id !== id),
      },
    })),

  pitchReactions: {},
  addPitchReaction: (projectKey, emoji, atSeconds) => {
    set((state) => ({
      pitchReactions: {
        ...state.pitchReactions,
        [projectKey]: [
          ...(state.pitchReactions[projectKey] ?? EMPTY_REACTIONS),
          { id: `rx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, emoji, atSeconds },
        ],
      },
    }));
    get().awardPoints(2, "Reacted to a pitch");
  },

  postedComments: {},
  postComment: (projectKey, author, text) => {
    set((state) => ({
      postedComments: {
        ...state.postedComments,
        [projectKey]: [
          ...(state.postedComments[projectKey] ?? EMPTY_COMMENTS),
          {
            id: `cm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            projectKey,
            author,
            text,
            postedAt: Date.now(),
            likes: 0,
          },
        ],
      },
    }));
    get().awardPoints(3, "Posted a comment");
  },
  commentLikes: {},
  toggleCommentLike: (commentId) =>
    set((state) => ({
      commentLikes: { ...state.commentLikes, [commentId]: !state.commentLikes[commentId] },
    })),

  followedProjects: {},
  toggleFollow: (projectKey) =>
    set((state) => ({
      followedProjects: { ...state.followedProjects, [projectKey]: !state.followedProjects[projectKey] },
    })),

  points: 0,
  pointsLog: [],
  awardPoints: (amount, reason) =>
    set((state) => ({
      points: state.points + amount,
      // Capped so a long session doesn't grow this without bound — only
      // the most recent handful are ever shown anywhere.
      pointsLog: [{ id: `pt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, amount, reason, at: Date.now() }, ...state.pointsLog].slice(0, 20),
    })),

  battles: {},
  startBattle: (projectKey, aId, bId, seedA, seedB) =>
    set((state) =>
      state.battles[projectKey]
        ? state
        : {
            battles: {
              ...state.battles,
              [projectKey]: { aId, bId, votesA: seedA, votesB: seedB, startedAt: Date.now() },
            },
          }
    ),

  battleVotes: {},
  castBattleVote: (projectKey, battleKey, side) =>
    set((state) => {
      if (state.battleVotes[battleKey]) return state;
      const battle = state.battles[projectKey];
      if (!battle) return state;
      return {
        battleVotes: { ...state.battleVotes, [battleKey]: side },
        battles: {
          ...state.battles,
          [projectKey]: {
            ...battle,
            votesA: battle.votesA + (side === "A" ? 1 : 0),
            votesB: battle.votesB + (side === "B" ? 1 : 0),
          },
        },
      };
    }),

  crowns: {},
  resolveBattle: (projectKey, battleKey, winner, winningSide) => {
    set((state) => {
      const restBattles = { ...state.battles };
      delete restBattles[projectKey];
      return {
        battles: restBattles,
        crowns: { ...state.crowns, [projectKey]: winner },
      };
    });
    if (get().battleVotes[battleKey] === winningSide) {
      get().awardPoints(10, "Backed the winning question");
    }
  },

  resetActivity: () =>
    set({
      watchProgress: {},
      watchStartedAt: {},
      modalProjectKey: null,
      ballotChoice: {},
      ballotSealedAt: {},
      backing: {},
      qaUpvotes: {},
      submittedQuestions: {},
      pitchReactions: {},
      postedComments: {},
      commentLikes: {},
      followedProjects: {},
      points: 0,
      pointsLog: [],
      battles: {},
      battleVotes: {},
      crowns: {},
    }),
    }),
    {
      name: "boardroom-store",
      // Throwing (rather than just returning undefined) when storage
      // isn't there lets createJSONStorage's own try/catch take over and
      // fall back to an in-memory no-op — the test environment's jsdom
      // doesn't provide window.localStorage at all, and a real browser
      // can throw accessing it in some private-browsing modes; either
      // way this should degrade to "just don't persist," not crash.
      storage: createJSONStorage(() => {
        if (typeof window === "undefined" || !window.localStorage) {
          throw new Error("localStorage unavailable");
        }
        return window.localStorage;
      }),
    }
  )
);

export function getRoomProgress(
  progress: Record<string, WatchProgress>,
  roomId: string
): WatchProgress {
  return progress[roomId] ?? EMPTY_PROGRESS;
}

export function getSubmittedQuestions(
  submitted: Record<string, SubmittedQuestion[]>,
  projectKey: string
): SubmittedQuestion[] {
  return submitted[projectKey] ?? EMPTY_QUESTIONS;
}
