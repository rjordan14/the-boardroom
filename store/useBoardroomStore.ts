"use client";

import { create } from "zustand";

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

  floorUpvotes: Record<string, boolean>;
  toggleFloorUpvote: (questionId: string) => void;

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
}

export const useBoardroomStore = create<BoardroomState>((set) => ({
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

  floorUpvotes: {},
  toggleFloorUpvote: (questionId) =>
    set((state) => ({
      floorUpvotes: {
        ...state.floorUpvotes,
        [questionId]: !state.floorUpvotes[questionId],
      },
    })),

  modalProjectKey: null,
  openProfileModal: (projectKey) => set({ modalProjectKey: projectKey }),
  closeProfileModal: () => set({ modalProjectKey: null }),

  ballotChoice: {},
  setBallotChoice: (roomId, projectKey) =>
    set((state) => ({
      ballotChoice: { ...state.ballotChoice, [roomId]: projectKey },
      ballotSealedAt: { ...state.ballotSealedAt, [roomId]: Date.now() },
    })),

  ballotSealedAt: {},

  backing: {},
  setBackingAmount: (roomId, amount) =>
    set((state) => ({
      backing: {
        ...state.backing,
        [roomId]: { amount, escrowed: state.backing[roomId]?.escrowed ?? false },
      },
    })),
  setBackingEscrowed: (roomId, escrowed) =>
    set((state) => ({
      backing: {
        ...state.backing,
        [roomId]: { amount: state.backing[roomId]?.amount ?? 888, escrowed },
      },
    })),

  qaUpvotes: {},
  toggleQaUpvote: (qaId) =>
    set((state) => ({
      qaUpvotes: { ...state.qaUpvotes, [qaId]: !state.qaUpvotes[qaId] },
    })),

  submittedQuestions: {},
  submitQuestion: (projectKey, question) =>
    set((state) => ({
      submittedQuestions: {
        ...state.submittedQuestions,
        [projectKey]: [
          ...(state.submittedQuestions[projectKey] ?? EMPTY_QUESTIONS),
          { id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, question, askedAt: Date.now() },
        ],
      },
    })),
}));

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
