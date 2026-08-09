"use client";

import { useEffect, useState } from "react";
import { renderVotedCard } from "@/lib/utils/votedCard";

/** The on-screen preview IS the exported file — rendered once to a PNG
 *  blob, shown as an <img> from that same blob, then reused for
 *  download/share. No separate CSS mockup to keep visually in sync
 *  with what actually gets shared. */
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
    renderVotedCard({ projectName, roomId })
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
  }, [projectName, roomId]);

  const fileName = `boardroom-i-voted-${projectName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
  const caption = `🗳️ I just voted for ${projectName} in THE BOARDROOM (Room ${roomId}). Ballot sealed, results hidden until the round closes.\n${
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
          <div className="flex aspect-[1000/1300] w-full items-center justify-center border border-board-border-alt bg-[#05070B]">
            {error ? (
              <div className="p-6 text-center font-mono text-[11px] leading-[1.7] text-board-tertiary">
                Couldn&apos;t build the card. Try again in a moment.
              </div>
            ) : imgUrl ? (
              <img src={imgUrl} alt={`I voted for ${projectName} in The Boardroom`} className="h-full w-full" />
            ) : (
              <div className="flex flex-col items-center gap-2 font-mono text-[11px] text-board-tertiary">
                <span className="block h-2 w-2 animate-[board-pulse_1s_ease-in-out_infinite] rounded-full bg-board-lime" />
                Building your card…
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleShare}
              disabled={!imgUrl}
              className="w-full bg-board-lime py-3.5 text-center font-mono text-[12px] font-extrabold tracking-[0.1em] text-board-bg transition hover:bg-board-lime-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {shared ? "SHARED ✓" : "SHARE ↗"}
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
          </div>
        </div>
      </div>
    </div>
  );
}
