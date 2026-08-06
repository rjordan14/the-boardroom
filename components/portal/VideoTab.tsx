"use client";

import { useRef } from "react";
import { createUpload } from "@mux/upchunk";
import { usePortalStore } from "@/store/usePortalStore";

const POLL_INTERVAL_MS = 2000;
const POLL_MAX_ATTEMPTS = 30; // ~60s of polling after upload finishes

export function VideoTab() {
  const uploadedNotice = usePortalStore((s) => s.uploadedNotice);
  const triggerUpload = usePortalStore((s) => s.triggerUpload);
  const videoUploadState = usePortalStore((s) => s.videoUploadState);
  const videoUploadProgress = usePortalStore((s) => s.videoUploadProgress);
  const videoStatusMessage = usePortalStore((s) => s.videoStatusMessage);
  const setVideoUpload = usePortalStore((s) => s.setVideoUpload);
  const resetVideoUpload = usePortalStore((s) => s.resetVideoUpload);
  const inputRef = useRef<HTMLInputElement>(null);

  const pollStatus = async (uploadId: string, attempt = 0) => {
    if (attempt >= POLL_MAX_ATTEMPTS) {
      setVideoUpload({
        state: "errored",
        message: "Still processing after a minute — check back shortly.",
      });
      return;
    }

    const res = await fetch(`/api/mux/upload-status?uploadId=${uploadId}`);
    const status = await res.json();

    if (status.state === "ready") {
      setVideoUpload({ state: "ready", playbackId: status.playbackId, message: null });
      return;
    }
    if (status.state === "rejected") {
      setVideoUpload({ state: "rejected", message: status.reason });
      return;
    }
    if (status.state === "errored") {
      setVideoUpload({ state: "errored", message: status.message });
      return;
    }
    setTimeout(() => pollStatus(uploadId, attempt + 1), POLL_INTERVAL_MS);
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setVideoUpload({ state: "errored", message: "Please choose a video file." });
      return;
    }

    const res = await fetch("/api/mux/upload", { method: "POST" });
    const data = await res.json();

    if (!data.configured) {
      // Mux credentials aren't set yet — fall back to the existing mock
      // notice rather than a dead-end upload button. See docs/decisions.md.
      triggerUpload();
      return;
    }

    setVideoUpload({ state: "uploading", progress: 0, message: null, playbackId: null });

    const upload = createUpload({ endpoint: data.uploadUrl, file });
    upload.on("progress", (e) => setVideoUpload({ progress: Math.round(e.detail ?? 0) }));
    upload.on("error", (e) =>
      setVideoUpload({ state: "errored", message: e.detail?.message || "Upload failed." })
    );
    upload.on("success", () => {
      setVideoUpload({ state: "processing", progress: 100 });
      pollStatus(data.uploadId);
    });
  };

  const busy = videoUploadState === "uploading" || videoUploadState === "processing";

  return (
    <div className="max-w-[800px] px-[clamp(14px,4vw,48px)] py-7.5 pb-[70px]">
      <div className="font-mono text-[20px] font-extrabold text-board-heading">PITCH VIDEO</div>
      <div className="mt-2 font-mono text-[11px] leading-[1.7] text-board-secondary">
        Under 2:30, unscripted, on camera. One take — no editing. Re-uploading sends it back for
        admin review before it replaces the live pitch.
      </div>

      <div className="relative mt-5.5 flex aspect-video items-center justify-center border border-board-border-alt bg-board-bg-media">
        <div className="text-center">
          <div className="font-mono text-[22px] text-board-lime">▶</div>
          <div className="mt-2 font-mono text-[10px] text-board-tertiary">CURRENT PITCH · 2:28</div>
        </div>
        <div className="absolute right-3 top-3 border border-board-border-voting bg-board-card-success px-2.5 py-1.5 font-mono text-[9px] font-bold tracking-[0.08em] text-board-success">
          LIVE
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {!busy && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className="mt-3.5 w-full border border-dashed border-[#3D4536] p-5.5 text-center font-mono text-[11px] leading-[1.7] text-board-secondary transition hover:border-board-lime hover:text-board-lime"
        >
          Drop a new take here, or click to browse. MP4, under 2:30.
        </button>
      )}

      {videoUploadState === "uploading" && (
        <div className="mt-3.5 border border-board-border-alt bg-board-card-alt p-4.5">
          <div className="mb-2 flex justify-between font-mono text-[10px] text-board-secondary">
            <span>UPLOADING</span>
            <span>{videoUploadProgress}%</span>
          </div>
          <div className="h-1.5 bg-board-border">
            <div
              className="h-full bg-board-lime transition-[width]"
              style={{ width: `${videoUploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {videoUploadState === "processing" && (
        <div className="mt-3.5 border border-board-border-alt bg-board-card-alt p-4.5 font-mono text-[10px] text-board-secondary">
          Uploaded — Mux is processing the take now. This page updates automatically.
        </div>
      )}

      {videoUploadState === "ready" && (
        <div className="mt-3 border border-board-border-voting bg-board-card-success px-4 py-2.5 font-mono text-[10px] leading-[1.6] text-board-success">
          New take processed and queued for admin review.
        </div>
      )}

      {(videoUploadState === "rejected" || videoUploadState === "errored") && (
        <div className="mt-3 flex items-center justify-between gap-3 border border-board-border-error bg-board-card-error px-4 py-2.5 font-mono text-[10px] leading-[1.6] text-board-error">
          <span>{videoStatusMessage}</span>
          <button type="button" onClick={resetVideoUpload} className="flex-none font-bold underline">
            TRY AGAIN
          </button>
        </div>
      )}

      {uploadedNotice && videoUploadState === "idle" && (
        <div className="mt-3 border border-board-border-voting bg-board-card-success px-4 py-2.5 font-mono text-[10px] leading-[1.6] text-board-success">
          New take received — queued for admin review.
        </div>
      )}
    </div>
  );
}
