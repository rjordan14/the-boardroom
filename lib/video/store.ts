/**
 * Server-side-only, in-memory upload-status tracking. Explicitly
 * ephemeral (resets on server restart) — this is intentional scope per
 * docs/decisions.md: the upload itself is real, but persisting the
 * result durably is a separate, larger "real backend/database"
 * question this doesn't attempt to answer. Not the Zustand client
 * store (store/usePortalStore.ts) — that runs in the browser and can't
 * hold data written by the webhook route, which runs server-side.
 */

/** 2:30 — see docs/decisions.md "Pitch video: length cap". */
export const MAX_PITCH_SECONDS = 150;

export type UploadStatus =
  | { state: "waiting" }
  | { state: "ready"; assetId: string; playbackId: string; durationSeconds: number }
  | { state: "rejected"; reason: string; durationSeconds: number }
  | { state: "errored"; message: string };

/** "pitch" uploads (VideoTab.tsx) surface in Admin's Submissions queue
 *  once ready — see listReadyPitchUploads below. "qa-answer" uploads
 *  (VideoAnswerRecorder.tsx) don't; they're a per-question reply, not
 *  a new pitch to review. */
export type UploadKind = "pitch" | "qa-answer";

interface UploadContext {
  kind: UploadKind;
  projectKey?: string;
  questionId?: string;
}

const uploads = new Map<string, UploadStatus>();
const contexts = new Map<string, UploadContext>();
// Separate from UploadStatus itself so decideReadyStatus (below) can
// stay a pure function of its inputs — its own tests assert an exact
// return shape, and a timestamp inside it would make that assertion
// depend on wall-clock time.
const readyAt = new Map<string, number>();

export function initUpload(uploadId: string, context: UploadContext = { kind: "pitch" }): void {
  uploads.set(uploadId, { state: "waiting" });
  contexts.set(uploadId, context);
}

export function setUploadStatus(uploadId: string, status: UploadStatus): void {
  uploads.set(uploadId, status);
  if (status.state === "ready") readyAt.set(uploadId, Date.now());
}

export function getUploadStatus(uploadId: string): UploadStatus | undefined {
  return uploads.get(uploadId);
}

export interface ReadyPitchUpload {
  uploadId: string;
  projectKey: string;
  assetId: string;
  playbackId: string;
  durationSeconds: number;
  readyAt: number;
}

/** Every completed, ready pitch upload — what Admin's Submissions
 *  queue merges in alongside its mock seed data (see
 *  lib/api/submissions.ts). Same ephemeral-in-memory caveat as the
 *  rest of this module: gone on server restart, and on a serverless
 *  deploy, only reliable if the webhook and this read land on the
 *  same warm instance — real persistence is the eventual fix, not
 *  attempted here. */
export function listReadyPitchUploads(): ReadyPitchUpload[] {
  const results: ReadyPitchUpload[] = [];
  for (const [uploadId, status] of uploads) {
    if (status.state !== "ready") continue;
    const context = contexts.get(uploadId);
    if (!context || context.kind !== "pitch" || !context.projectKey) continue;
    results.push({
      uploadId,
      projectKey: context.projectKey,
      assetId: status.assetId,
      playbackId: status.playbackId,
      durationSeconds: status.durationSeconds,
      readyAt: readyAt.get(uploadId) ?? Date.now(),
    });
  }
  return results;
}

/**
 * Pure accept/reject decision for a `video.asset.ready` webhook —
 * split out from app/api/mux/webhook/route.ts so it's testable without
 * mocking Mux's webhook-signature verification. This is where the
 * 2:30 cap is actually enforced (see docs/decisions.md); a client-side
 * pre-check is a UX nicety, not the real gate.
 */
export function decideReadyStatus(input: {
  assetId: string;
  durationSeconds: number;
  playbackId: string | undefined;
}): UploadStatus {
  if (input.durationSeconds > MAX_PITCH_SECONDS) {
    return {
      state: "rejected",
      reason: `Pitch is ${Math.ceil(input.durationSeconds)}s, over the ${MAX_PITCH_SECONDS}s (2:30) cap.`,
      durationSeconds: input.durationSeconds,
    };
  }
  if (!input.playbackId) {
    // Ready without a playback ID yet is unexpected but not an error we
    // should surface as one — leave it waiting rather than silently
    // drop the result.
    return { state: "waiting" };
  }
  return {
    state: "ready",
    assetId: input.assetId,
    playbackId: input.playbackId,
    durationSeconds: input.durationSeconds,
  };
}
