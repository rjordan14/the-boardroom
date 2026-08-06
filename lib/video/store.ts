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

const uploads = new Map<string, UploadStatus>();

export function initUpload(uploadId: string): void {
  uploads.set(uploadId, { state: "waiting" });
}

export function setUploadStatus(uploadId: string, status: UploadStatus): void {
  uploads.set(uploadId, status);
}

export function getUploadStatus(uploadId: string): UploadStatus | undefined {
  return uploads.get(uploadId);
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
