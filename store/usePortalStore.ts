"use client";

import { create } from "zustand";

export interface PortalTeamMember {
  id: number;
  name: string;
  role: string;
  handle: string | null;
}

const INITIAL_TEAM: PortalTeamMember[] = [
  { id: 1, name: "Mira Okonkwo", role: "Founder", handle: "@miraok" },
  { id: 2, name: "Devin Pratt", role: "Protocol", handle: "@dev_pratt" },
  { id: 3, name: "—", role: "Frontend", handle: null },
  { id: 4, name: "—", role: "Design", handle: null },
];

interface NotifToggles {
  q: boolean;
  b: boolean;
  a: boolean;
  r: boolean;
}

export type VideoUploadState =
  | "idle"
  | "uploading"
  | "processing"
  | "ready"
  | "rejected"
  | "errored";

interface PortalState {
  gate: "locked" | "open";
  connectProject: () => void;

  /** null until componentDidMount-equivalent checks the invite query param. */
  onboarded: boolean | null;
  setOnboarded: (v: boolean | null) => void;
  finishOnboard: () => void;

  team: PortalTeamMember[];
  addMember: (name: string, role: string, handle: string) => void;
  removeMember: (id: number) => void;

  /** Keyed by QaItem.id (string, e.g. "A-1") — matches lib/types.ts. */
  answeringId: string | null;
  drafts: Record<string, string>;
  answers: Record<string, string>;
  startAnswer: (id: string) => void;
  cancelAnswer: () => void;
  setDraft: (id: string, text: string) => void;
  postAnswer: (id: string) => void;

  /** Mock-fallback upload notice — used when Mux isn't configured. */
  uploadedNotice: boolean;
  triggerUpload: () => void;

  /** Real-upload state, driven by app/api/mux/* once Mux is configured. */
  videoUploadState: VideoUploadState;
  videoUploadProgress: number;
  videoPlaybackId: string | null;
  videoStatusMessage: string | null;
  setVideoUpload: (partial: Partial<{
    state: VideoUploadState;
    progress: number;
    playbackId: string | null;
    message: string | null;
  }>) => void;
  resetVideoUpload: () => void;

  infoSaved: boolean;
  saveInfo: () => void;

  notif: NotifToggles;
  toggleNotif: (key: keyof NotifToggles) => void;
}

export const usePortalStore = create<PortalState>((set) => ({
  gate: "locked",
  connectProject: () => set({ gate: "open" }),

  onboarded: null,
  setOnboarded: (v) => set({ onboarded: v }),
  finishOnboard: () => set({ onboarded: true }),

  team: INITIAL_TEAM,
  addMember: (name, role, handle) =>
    set((s) => ({
      team: [...s.team, { id: Date.now(), name, role, handle: handle || null }],
    })),
  removeMember: (id) => set((s) => ({ team: s.team.filter((m) => m.id !== id) })),

  answeringId: null,
  drafts: {},
  answers: {},
  startAnswer: (id) => set({ answeringId: id }),
  cancelAnswer: () => set({ answeringId: null }),
  setDraft: (id, text) => set((s) => ({ drafts: { ...s.drafts, [id]: text } })),
  postAnswer: (id) =>
    set((s) => {
      const text = s.drafts[id];
      if (!text) return s;
      return { answers: { ...s.answers, [id]: text }, answeringId: null };
    }),

  uploadedNotice: false,
  triggerUpload: () => set({ uploadedNotice: true }),

  videoUploadState: "idle",
  videoUploadProgress: 0,
  videoPlaybackId: null,
  videoStatusMessage: null,
  setVideoUpload: (partial) =>
    set((s) => ({
      videoUploadState: partial.state ?? s.videoUploadState,
      videoUploadProgress: partial.progress ?? s.videoUploadProgress,
      videoPlaybackId: partial.playbackId !== undefined ? partial.playbackId : s.videoPlaybackId,
      videoStatusMessage: partial.message !== undefined ? partial.message : s.videoStatusMessage,
    })),
  resetVideoUpload: () =>
    set({
      videoUploadState: "idle",
      videoUploadProgress: 0,
      videoPlaybackId: null,
      videoStatusMessage: null,
    }),

  infoSaved: false,
  saveInfo: () => set({ infoSaved: true }),

  notif: { q: true, b: true, a: true, r: true },
  toggleNotif: (key) => set((s) => ({ notif: { ...s.notif, [key]: !s.notif[key] } })),
}));
