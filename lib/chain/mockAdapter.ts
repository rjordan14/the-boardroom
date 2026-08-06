import type { ChainAdapter, EligibilitySnapshot } from "@/lib/chain/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock implementation of ChainAdapter. Timings mirror the prototype's
 * own castBallot() setTimeout sequence (sign at 0ms, stamp at 1100ms,
 * eject at 2000ms, done at 2900ms) so the ceremony reads the same as
 * the design even though nothing here talks to a chain yet.
 */
export const mockAdapter: ChainAdapter = {
  async getEligibility(): Promise<EligibilitySnapshot> {
    return {
      connected: true,
      address: "0x25…1A50",
      eligible: true,
      stonkbrokerBalance: 48200,
    };
  },

  async castVote(_roomId, _projectKey, onPhase) {
    onPhase("signing");
    await delay(1100);
    onPhase("pending");
    await delay(900);
    onPhase("confirmed");
  },

  async escrowBacking(_roomId, _projectKey, _amount, onPhase) {
    onPhase("escrowing");
    await delay(400);
    onPhase("escrowed");
  },
};
