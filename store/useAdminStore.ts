"use client";

import { create } from "zustand";

export type TourStatus = "live" | "paused" | "ended";
export type SubmissionDecision = "approved" | "rejected";
export type WaitlistDecision = "invited" | "declined";

function genToken() {
  return Math.random().toString(36).slice(2, 8);
}

interface AdminState {
  gate: "locked" | "open" | "denied";
  connectAdmin: () => void;
  connectWrongWallet: () => void;

  tourStatus: TourStatus;
  togglePause: () => void;
  cancelOpen: boolean;
  toggleCancelConfirm: () => void;
  doCancel: () => void;

  inviteVal: string;
  setInviteVal: (v: string) => void;
  lastInvite: string | null;
  inviteToken: string | null;
  sendInvite: (target: string) => void;

  detailKey: string | null;
  removeConfirmOpen: boolean;
  openDetail: (key: string) => void;
  closeDetail: () => void;
  toggleRemoveConfirm: () => void;
  doRemove: () => void;
  removedKeys: Record<string, boolean>;

  subDecisions: Record<string, SubmissionDecision>;
  decideSubmission: (id: string, decision: SubmissionDecision) => void;

  qaHidden: Record<string, boolean>;
  toggleQaHidden: (id: string) => void;

  waitlistDecisions: Record<string, WaitlistDecision>;
  decideWaitlist: (id: string, decision: WaitlistDecision) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  gate: "locked",
  connectAdmin: () => set({ gate: "open" }),
  connectWrongWallet: () => set({ gate: "denied" }),

  tourStatus: "live",
  togglePause: () =>
    set((s) => ({ tourStatus: s.tourStatus === "paused" ? "live" : "paused" })),
  cancelOpen: false,
  toggleCancelConfirm: () => set((s) => ({ cancelOpen: !s.cancelOpen })),
  doCancel: () => set({ tourStatus: "ended", cancelOpen: false }),

  inviteVal: "",
  setInviteVal: (v) => set({ inviteVal: v }),
  lastInvite: null,
  inviteToken: null,
  sendInvite: (target) =>
    set((s) => (target ? { lastInvite: target, inviteVal: "", inviteToken: genToken() } : s)),

  detailKey: null,
  removeConfirmOpen: false,
  openDetail: (key) => set({ detailKey: key, removeConfirmOpen: false }),
  closeDetail: () => set({ detailKey: null, removeConfirmOpen: false }),
  toggleRemoveConfirm: () => set((s) => ({ removeConfirmOpen: !s.removeConfirmOpen })),
  removedKeys: {},
  doRemove: () =>
    set((s) => ({
      removedKeys: s.detailKey ? { ...s.removedKeys, [s.detailKey]: true } : s.removedKeys,
      detailKey: null,
      removeConfirmOpen: false,
    })),

  subDecisions: {},
  decideSubmission: (id, decision) =>
    set((s) => ({ subDecisions: { ...s.subDecisions, [id]: decision } })),

  qaHidden: {},
  toggleQaHidden: (id) =>
    set((s) => ({ qaHidden: { ...s.qaHidden, [id]: !s.qaHidden[id] } })),

  waitlistDecisions: {},
  decideWaitlist: (id, decision) =>
    set((s) => ({ waitlistDecisions: { ...s.waitlistDecisions, [id]: decision } })),
}));
