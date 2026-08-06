"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { VoteTxPhase } from "@/lib/chain/types";

/** Sign → stamp → eject, choreographed off real tx-lifecycle phases
 *  (see lib/chain/mockAdapter.ts) rather than the ceremony's own
 *  timers — swapping in a real signer later changes only what feeds
 *  `phase` in, not this component. */
export function Ceremony({
  phase,
  projectName,
  onComplete,
}: {
  phase: VoteTxPhase;
  projectName: string;
  onComplete: () => void;
}) {
  const ejecting = phase === "confirmed";

  useEffect(() => {
    if (!ejecting) return;
    const t = setTimeout(onComplete, 900);
    return () => clearTimeout(t);
  }, [ejecting, onComplete]);

  if (phase === "idle") return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-[rgba(4,6,10,0.94)]">
      <AnimatePresence mode="wait">
        {phase === "signing" && (
          <motion.div
            key="sign"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex w-full max-w-[420px] flex-col items-center gap-4.5 border-2 border-dashed border-board-lime bg-board-card-alt px-[clamp(14px,4vw,48px)] py-10"
          >
            <div className="font-mono text-[11px] font-bold tracking-[0.2em] text-board-secondary-alt">
              SIGN TO SEAL YOUR BALLOT
            </div>
            <div className="font-mono text-[20px] font-extrabold text-board-lime">{projectName}</div>
            <div className="max-w-[320px] text-center font-mono text-[11px] leading-[1.8] text-board-secondary">
              Confirm the signature request in your wallet.
            </div>
            <div className="mt-1.5 flex gap-1.5">
              {[0, 0.15, 0.3].map((delay) => (
                <span
                  key={delay}
                  className="h-2 w-2 animate-[board-pulse_1s_infinite] bg-board-lime"
                  style={{ animationDelay: `${delay}s` }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {(phase === "pending" || phase === "confirmed") && (
          <motion.div
            key="stamp"
            initial={{ x: 0 }}
            animate={
              phase === "pending"
                ? { x: [0, -9, 8, -5, 4, 0], y: [0, 4, -3, 2, -1, 0] }
                : { y: 0 }
            }
            transition={{ duration: 0.42 }}
            className="relative"
          >
            <motion.div
              initial={{ opacity: 1 }}
              animate={ejecting ? { y: -8, opacity: 1 } : { opacity: 1 }}
              className="flex w-full max-w-[340px] flex-col items-center gap-4 bg-[#E8E4D4] px-6 py-5.5 text-[#15170F] shadow-[0_6px_0_#9A9784]"
            >
              <div className="flex w-full justify-between font-mono text-[9px] font-bold tracking-[0.14em] text-[#6A6752]">
                <span>TIME CARD</span>
                <span>{phase === "pending" ? "SEALING" : "SEALED"}</span>
              </div>
              <div className="-mt-2 w-full border-t border-dashed border-[#A8A48F]" />
              <div className="flex w-full justify-between font-mono text-[11px] leading-[1.4]">
                <span>VOTE</span>
                <span className="font-extrabold">{projectName}</span>
              </div>
              {/* Normal-flow, not absolute-overlapping the rows above — a
                  fixed offset there collided with card content once this
                  card carried more than the prototype's original two
                  lines. */}
              <motion.div
                initial={{ opacity: 0, scale: 2.4, rotate: -7 }}
                animate={{ opacity: 1, scale: 1, rotate: -7 }}
                transition={{ duration: 0.38, ease: [0.3, 1.5, 0.5, 1] }}
                className="w-[156px] border-[5px] border-[#B4453A] py-3 text-center font-mono text-[20px] font-extrabold tracking-[0.1em] text-[#B4453A]"
              >
                SEALED
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {ejecting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-[18%] font-mono text-[13px] font-extrabold tracking-[0.16em] text-board-lime"
        >
          BALLOT SEALED
        </motion.div>
      )}
    </div>
  );
}
