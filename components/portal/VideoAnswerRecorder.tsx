"use client";

import { useRef } from "react";
import { createUpload } from "@mux/upchunk";
import { usePortalStore } from "@/store/usePortalStore";

const POLL_INTERVAL_MS = 2000;
const POLL_MAX_ATTEMPTS = 30; // ~60s of polling after upload finishes

/** Same upload → poll → ready state machine as VideoTab.tsx's pitch
 *  video, scoped to one Q&A question instead of the whole project —
 *  a founder can clap back at a hot question on camera instead of
 *  typing a reply. Falls back to the same mock "queued for review"
 *  notice VideoTab.tsx uses when Mux isn't configured. */
export function VideoAnswerRecorder({ questionId }: { questionId: string }) {
  const videoAnswer = usePortalStore((s) => s.videoAnswers[questionId]);
  const notice = usePortalStore((s) => s.videoAnswerNotices[questionId]);
  const setVideoAnswer = usePortalStore((s) => s.setVideoAnswer);
  const resetVideoAnswer = usePortalStore((s) => s.resetVideoAnswer);
  const triggerVideoAnswerUpload = usePortalStore((s) => s.triggerVideoAnswerUpload);
  const inputRef = useRef<HTMLInputElement>(null);

  const state = videoAnswer?.state ?? "idle";
  const busy = state === "uploading" || state === "processing";

  const pollStatus = async (uploadId: string, attempt = 0) => {
    if (attempt >= POLL_MAX_ATTEMPTS) {
      setVideoAnswer(questionId, { state: "errored", message: "Still processing after a minute — check back shortly." });
      return;
    }
    const res = await fetch(`/api/mux/upload-status?uploadId=${uploadId}`);
    const status = await res.json();
    if (status.state === "ready") {
      setVideoAnswer(questionId, { state: "ready", playbackId: status.playbackId, message: null });
      return;
    }
    if (status.state === "rejected") {
      setVideoAnswer(questionId, { state: "rejected", message: status.reason });
      return;
    }
    if (status.state === "errored") {
      setVideoAnswer(questionId, { state: "errored", message: status.message });
      return;
    }
    setTimeout(() => pollStatus(uploadId, attempt + 1), POLL_INTERVAL_MS);
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setVideoAnswer(questionId, { state: "errored", message: "Please choose a video file." });
      return;
    }

    const res = await fetch("/api/mux/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "qa-answer", questionId }),
    });
    const data = await res.json();

    if (!data.configured) {
      triggerVideoAnswerUpload(questionId);
      return;
    }

    setVideoAnswer(questionId, { state: "uploading", progress: 0, message: null, playbackId: null });
    const upload = createUpload({ endpoint: data.uploadUrl, file });
    upload.on("progress", (e) => setVideoAnswer(questionId, { progress: Math.round(e.detail ?? 0) }));
    upload.on("error", (e) =>
      setVideoAnswer(questionId, { state: "errored", message: e.detail?.message || "Upload failed." })
    );
    upload.on("success", () => {
      setVideoAnswer(questionId, { state: "processing", progress: 100 });
      pollStatus(data.uploadId);
    });
  };

  if (notice) {
    return (
      <div className="mt-2.5 flex items-center gap-2 border border-board-border-voting bg-board-card-success px-3 py-2 font-mono text-[10px] leading-[1.6] text-board-success">
        🎥 Video reply queued for admin review.
      </div>
    );
  }

  if (state === "ready") {
    return (
      <div className="mt-2.5 flex items-center gap-2 border border-board-border-voting bg-board-card-success px-3 py-2 font-mono text-[10px] leading-[1.6] text-board-success">
        🎥 Video reply processed and queued for admin review.
      </div>
    );
  }

  return (
    <div className="mt-2.5">
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {!busy && state !== "rejected" && state !== "errored" && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="font-mono text-[10px] font-bold tracking-[0.08em] text-board-lime transition hover:translate-x-0.5"
        >
          🎥 RECORD A VIDEO REPLY →
        </button>
      )}

      {state === "uploading" && (
        <div className="border border-board-border-alt bg-board-card-alt p-3">
          <div className="mb-1.5 flex justify-between font-mono text-[9px] text-board-secondary">
            <span>UPLOADING</span>
            <span>{videoAnswer?.progress ?? 0}%</span>
          </div>
          <div className="h-1 bg-board-border">
            <div
              className="h-full bg-board-lime transition-[width]"
              style={{ width: `${videoAnswer?.progress ?? 0}%` }}
            />
          </div>
        </div>
      )}

      {state === "processing" && (
        <div className="border border-board-border-alt bg-board-card-alt p-3 font-mono text-[9px] text-board-secondary">
          Uploaded — processing now.
        </div>
      )}

      {(state === "rejected" || state === "errored") && (
        <div className="flex items-center justify-between gap-3 border border-board-border-error bg-board-card-error px-3 py-2 font-mono text-[9px] leading-[1.6] text-board-error">
          <span>{videoAnswer?.message}</span>
          <button
            type="button"
            onClick={() => resetVideoAnswer(questionId)}
            className="flex-none font-bold underline"
          >
            TRY AGAIN
          </button>
        </div>
      )}
    </div>
  );
}
