/**
 * Chain adapter contract. UI/components call these hooks, never wagmi
 * directly — swapping the mock implementation for real contract calls
 * later is an implementation change here, not a rewrite of the screens.
 */

export interface EligibilitySnapshot {
  connected: boolean;
  address: string | null;
  /** Per README Decisions Locked #2: live balance, not a snapshot. */
  eligible: boolean;
  stonkbrokerBalance: number;
}

export type VoteTxPhase =
  | "idle"
  | "signing"
  | "pending"
  | "confirmed"
  | "rejected"
  | "reverted";

export type BackTxPhase = "idle" | "escrowing" | "escrowed";

export interface ChainAdapter {
  getEligibility(): Promise<EligibilitySnapshot>;
  /**
   * Casts a ballot. Reports phase transitions via onPhase so callers
   * (the ballot ceremony UI) can drive the sign → stamp → eject
   * animation off real state instead of its own timers once this is
   * backed by a real signer/tx.
   */
  castVote(
    roomId: string,
    projectKey: string,
    onPhase: (phase: VoteTxPhase) => void
  ): Promise<void>;
  escrowBacking(
    roomId: string,
    projectKey: string,
    amount: number,
    onPhase: (phase: BackTxPhase) => void
  ): Promise<void>;
}
