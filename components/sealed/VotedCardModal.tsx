"use client";

import { useEffect, useState } from "react";
import { renderVotedCard } from "@/lib/utils/votedCard";
import { VotedCardVisual } from "./VotedCardVisual";

/** The live preview (VotedCardVisual) and the downloadable/shareable
 *  file (rendered here) are two separate implementations on purpose —
 *  see VotedCardVisual's own comment for why. The PNG render happens
 *  in the background as soon as this opens, so it's usually ready by
 *  the time someone's looked at the animated preview and decided to
 *  share it. */
export function VotedCardModal({
  projectName,
  roomId,
  onClose,
}: {
  projectName: string;
  roomId: string;
  onClose: () => void;
}) {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let url: string | null = null;
    renderVotedCard({ projectName })
      .then((b) => {
        if (cancelled) return;
        url = URL.createObjectURL(b);
        setBlob(b);
        setImgUrl(url);
      })
      .catch(() => setError(true));
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [projectName]);

  const fileName = `boardroom-i-voted-${projectName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
  const caption = `🗳️ I just voted for ${projectName} in THE BOARDROOM. Ballot sealed, results hidden until the round closes.\n${
    typeof window !== "undefined" ? window.location.origin : ""
  }/room/${roomId}/sealed`;

  const handleDownload = () => {
    if (!imgUrl) return;
    const a = document.createElement("a");
    a.href = imgUrl;
    a.download = fileName;
    a.click();
  };

  const handleShare = async () => {
    if (!blob) return;
    const file = new File([blob], fileName, { type: "image/png" });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "I voted in The Boardroom", text: caption });
        setShared(true);
        setTimeout(() => setShared(false), 1800);
        return;
      } catch {
        // Cancelled or unsupported mid-flow — fall back to a download
        // so the tap still does *something* useful.
      }
    }
    handleDownload();
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard access can be denied by the browser — no fallback
      // worth building for a "nice to have" affordance.
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-auto bg-[rgba(4,6,10,0.86)] px-6 py-12"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[440px] border border-board-border bg-board-card shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
      >
        <div className="flex items-center gap-3.5 border-b border-[#1A1E17] px-5.5 py-4">
          <span className="font-mono text-[10px] font-bold tracking-[0.16em] text-board-secondary-alt">
            I VOTED CARD
          </span>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto flex items-center gap-2 border border-[#3D4536] px-3.5 py-2 font-mono text-[10px] font-bold tracking-[0.1em] text-board-body transition hover:border-board-lime hover:text-board-lime"
          >
            CLOSE ✕
          </button>
        </div>

        <div className="p-5.5">
          <VotedCardVisual projectName={projectName} />

          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleShare}
              disabled={!imgUrl}
              className="w-full bg-board-lime py-3.5 text-center font-mono text-[12px] font-extrabold tracking-[0.1em] text-board-bg transition hover:bg-board-lime-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {shared ? "SHARED ✓" : imgUrl ? "SHARE ↗" : "PREPARING…"}
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDownload}
                disabled={!imgUrl}
                className="flex-1 border border-[#3D4536] py-3 text-center font-mono text-[11px] font-bold tracking-[0.08em] text-board-body transition hover:border-board-lime hover:text-board-lime disabled:cursor-not-allowed disabled:opacity-50"
              >
                DOWNLOAD ⬇
              </button>
              <button
                type="button"
                onClick={handleCopyCaption}
                className="flex-1 border border-[#3D4536] py-3 text-center font-mono text-[11px] font-bold tracking-[0.08em] text-board-body transition hover:border-board-lime hover:text-board-lime"
              >
                {copied ? "COPIED ✓" : "COPY CAPTION"}
              </button>
            </div>
            {error && (
              <div className="text-center font-mono text-[10px] text-board-tertiary">
                Couldn&apos;t prepare a downloadable file — the card above still works for a screenshot.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
