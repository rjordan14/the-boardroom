import type { ProjectKey } from "@/lib/types";
import type { RoomResult } from "@/lib/mock/results";

/**
 * Server-side-only, in-memory tournament-progression state — same
 * ephemeral-by-design tradeoff as lib/video/store.ts (resets on server
 * restart, no real database behind it). There's no real backend
 * aggregating votes across wallets (ballots live in each browser's own
 * Zustand store, per store/useBoardroomStore.ts's own comment on that),
 * so a round doesn't "tally" real votes when it closes — an admin
 * declares the winner per room, and this generates a plausible published
 * tally to match the shape the rest of the app already expects from
 * lib/mock/results.ts. Closing is scoped to a whole round at once, never
 * a single room — see lib/mock/rooms.ts on why every room in a round
 * shares one voting window.
 *
 * Held on globalThis rather than a plain module-level variable: Next.js
 * dev (Turbopack) compiles page Server Components and API Route
 * Handlers as separate module graphs, so a `let` here gets a distinct
 * copy per graph — an admin's close via the API route would silently
 * never show up on the page. globalThis is the one thing actually
 * shared across those graphs within a single running server process.
 */

interface ClosedRound {
  roundLabel: string;
  closedAt: number;
  results: RoomResult[];
}

const globalForTournament = globalThis as unknown as { __boardroomClosedRound?: ClosedRound | null };

function getState(): ClosedRound | null {
  return globalForTournament.__boardroomClosedRound ?? null;
}

function setState(next: ClosedRound | null): void {
  globalForTournament.__boardroomClosedRound = next;
}

export function closeRound(roundLabel: string, results: RoomResult[]): void {
  setState({ roundLabel, closedAt: Date.now(), results });
}

/** Undoes a close — a demo/v1 platform gets re-shown a lot, and there's
 *  no real ballot data underneath to lose by resetting. */
export function reopenRound(): void {
  setState(null);
}

export function getClosedRound(): ClosedRound | null {
  return getState();
}

export function isRoomClosed(roomId: string): boolean {
  return !!getState()?.results.some((r) => r.roomId === roomId);
}

export function getPublishedResult(roomId: string): RoomResult | undefined {
  return getState()?.results.find((r) => r.roomId === roomId);
}

/** Builds a plausible-looking published tally for a declared winner —
 *  there's no real vote count to report (see module comment), so this
 *  fabricates one in the same range as the app's other flavor numbers
 *  rather than leaving the result screen with a fake-looking 100/0. */
export function fabricateResult(roomId: string, winnerKey: ProjectKey, loserKey: ProjectKey): RoomResult {
  const winnerPct = 54 + Math.round(Math.random() * 22); // 54–76%
  const totalValid = 180 + Math.round(Math.random() * 180); // 180–360
  const winnerVotes = Math.round((totalValid * winnerPct) / 100);
  const loserVotes = totalValid - winnerVotes;
  const quarantinedCount = Math.round(Math.random() * 3);
  return {
    roomId,
    winnerKey,
    tallies: {
      [winnerKey]: { pct: winnerPct, votes: winnerVotes },
      [loserKey]: { pct: 100 - winnerPct, votes: loserVotes },
    },
    totalValid,
    quarantinedCount,
  };
}
