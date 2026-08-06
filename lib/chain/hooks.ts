"use client";

import { useCallback, useEffect, useState } from "react";
import { mockAdapter } from "@/lib/chain/mockAdapter";
import type {
  BackTxPhase,
  EligibilitySnapshot,
  VoteTxPhase,
} from "@/lib/chain/types";

/** Swap point: point this at a real ChainAdapter once contracts exist. */
const adapter = mockAdapter;

export function useEligibility() {
  const [data, setData] = useState<EligibilitySnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    adapter.getEligibility().then((snapshot) => {
      if (!cancelled) {
        setData(snapshot);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading };
}

export function useCastVote(roomId: string) {
  const [phase, setPhase] = useState<VoteTxPhase>("idle");
  const [choice, setChoice] = useState<string | null>(null);

  const castVote = useCallback(
    async (projectKey: string) => {
      if (phase === "signing" || phase === "pending") return;
      setChoice(projectKey);
      try {
        await adapter.castVote(roomId, projectKey, setPhase);
      } catch {
        setPhase("reverted");
      }
    },
    [roomId, phase]
  );

  const reset = useCallback(() => setPhase("idle"), []);

  return { phase, choice, castVote, reset };
}

export function useEscrowBacking(roomId: string) {
  const [phase, setPhase] = useState<BackTxPhase>("idle");

  const escrow = useCallback(
    async (projectKey: string, amount: number) => {
      await adapter.escrowBacking(roomId, projectKey, amount, setPhase);
    },
    [roomId]
  );

  const reclaim = useCallback(() => setPhase("idle"), []);

  return { phase, escrow, reclaim };
}
