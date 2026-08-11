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

export type RoundName = "Quarterfinal" | "Semifinal" | "Final";

/** Bracket order — also the pairing order the next round's matchups get
 *  generated in (see generateNextRoundIfNeeded below). */
const ROUND_ORDER: RoundName[] = ["Quarterfinal", "Semifinal", "Final"];

/** Where each round's generated room ids start counting from — the 4
 *  quarterfinal ids ("01"-"04") are the static seed data in
 *  lib/mock/rooms.ts, not generated, so Semifinal starts right after. */
const ROOM_ID_BASE: Record<RoundName, number> = { Quarterfinal: 0, Semifinal: 4, Final: 6 };

export interface GeneratedRoom {
  id: string;
  roundLabel: RoundName;
  n: number;
  projectA: ProjectKey;
  projectB: ProjectKey;
  closesInHours: number;
}

interface RoundRecord {
  closedAt: number;
  results: RoomResult[];
}

interface TournamentState {
  closedRounds: Partial<Record<RoundName, RoundRecord>>;
  /** Semifinal and Final room definitions — nonexistent until the prior
   *  round closes and produces the winners to pair up. */
  generatedRooms: GeneratedRoom[];
}

const globalForTournament = globalThis as unknown as { __boardroomTournament?: TournamentState };

function getState(): TournamentState {
  return (globalForTournament.__boardroomTournament ??= { closedRounds: {}, generatedRooms: [] });
}

/** Pairs winners in bracket order (room 1+2's winners face off, then
 *  room 3+4's) and creates that round's rooms — the same pairing the
 *  Bracket component's own left/right column split already assumes. */
function generateNextRoundIfNeeded(closedRoundLabel: RoundName, results: RoomResult[]): void {
  const idx = ROUND_ORDER.indexOf(closedRoundLabel);
  const nextRound = ROUND_ORDER[idx + 1];
  if (!nextRound) return; // Final just closed — nothing after it

  const state = getState();
  if (state.generatedRooms.some((r) => r.roundLabel === nextRound)) return; // already generated

  const winners = [...results].sort((a, b) => a.roomId.localeCompare(b.roomId)).map((r) => r.winnerKey);
  const base = ROOM_ID_BASE[nextRound];
  const newRooms: GeneratedRoom[] = [];
  for (let i = 0; i + 1 < winners.length; i += 2) {
    newRooms.push({
      id: String(base + newRooms.length + 1).padStart(2, "0"),
      roundLabel: nextRound,
      n: newRooms.length + 1,
      projectA: winners[i],
      projectB: winners[i + 1],
      closesInHours: 68,
    });
  }
  state.generatedRooms.push(...newRooms);
}

export function closeRound(roundLabel: RoundName, results: RoomResult[]): void {
  const state = getState();
  state.closedRounds[roundLabel] = { closedAt: Date.now(), results };
  generateNextRoundIfNeeded(roundLabel, results);
}

/** Undoes the most recently closed round — walks bracket order from the
 *  end so undoing Semifinal (say) also removes the Final room that was
 *  generated from it, rather than leaving an orphaned Final matchup
 *  behind whose inputs no longer exist. A demo/v1 platform gets
 *  re-shown a lot, and there's no real ballot data underneath to lose
 *  by resetting. */
export function reopenRound(): void {
  const state = getState();
  for (let i = ROUND_ORDER.length - 1; i >= 0; i--) {
    const label = ROUND_ORDER[i];
    if (state.closedRounds[label]) {
      delete state.closedRounds[label];
      const next = ROUND_ORDER[i + 1];
      if (next) state.generatedRooms = state.generatedRooms.filter((r) => r.roundLabel !== next);
      return;
    }
  }
}

export function isRoomClosed(roomId: string): boolean {
  return Object.values(getState().closedRounds).some((record) =>
    record?.results.some((r) => r.roomId === roomId)
  );
}

export function getPublishedResult(roomId: string): RoomResult | undefined {
  for (const record of Object.values(getState().closedRounds)) {
    const found = record?.results.find((r) => r.roomId === roomId);
    if (found) return found;
  }
  return undefined;
}

export function getGeneratedRooms(): GeneratedRoom[] {
  return getState().generatedRooms;
}

export function isRoundClosed(roundLabel: RoundName): boolean {
  return !!getState().closedRounds[roundLabel];
}

export function getClosedRoundResult(roundLabel: RoundName): RoundRecord | undefined {
  return getState().closedRounds[roundLabel];
}

/** The round currently open for voting — the first round in bracket
 *  order that hasn't closed yet. Null once Final has closed, meaning
 *  there's nothing left to vote on. */
export function getCurrentRoundLabel(): RoundName | null {
  const state = getState();
  for (const label of ROUND_ORDER) {
    if (!state.closedRounds[label]) return label;
  }
  return null;
}

export function getChampion(): ProjectKey | null {
  return getState().closedRounds.Final?.results[0]?.winnerKey ?? null;
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
