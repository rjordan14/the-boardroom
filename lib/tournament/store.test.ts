import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  closeRound,
  fabricateResult,
  getClosedRound,
  getPublishedResult,
  isRoomClosed,
  reopenRound,
} from "./store";

// Single global closedRound value (not a map keyed by id, unlike
// lib/video/store.ts) — every test resets it so state can't leak
// between tests regardless of order.
beforeEach(() => {
  reopenRound();
});

describe("closeRound / getClosedRound / reopenRound", () => {
  it("starts with no closed round", () => {
    expect(getClosedRound()).toBeNull();
  });

  it("closeRound records the round label and results", () => {
    const results = [fabricateResult("01", "A", "B")];
    closeRound("Quarterfinal", results);
    const closed = getClosedRound();
    expect(closed?.roundLabel).toBe("Quarterfinal");
    expect(closed?.results).toEqual(results);
  });

  it("reopenRound clears it back to null", () => {
    closeRound("Quarterfinal", [fabricateResult("01", "A", "B")]);
    reopenRound();
    expect(getClosedRound()).toBeNull();
  });

  it("closing again overwrites the previous close, not merges with it", () => {
    closeRound("Quarterfinal", [fabricateResult("01", "A", "B")]);
    closeRound("Quarterfinal", [fabricateResult("02", "C", "D")]);
    const closed = getClosedRound();
    expect(closed?.results).toHaveLength(1);
    expect(closed?.results[0].roomId).toBe("02");
  });
});

describe("isRoomClosed / getPublishedResult", () => {
  it("reports false/undefined when no round is closed", () => {
    expect(isRoomClosed("01")).toBe(false);
    expect(getPublishedResult("01")).toBeUndefined();
  });

  it("reports true/defined only for rooms in the closed round's results", () => {
    closeRound("Quarterfinal", [
      fabricateResult("01", "A", "B"),
      fabricateResult("02", "C", "D"),
    ]);
    expect(isRoomClosed("01")).toBe(true);
    expect(isRoomClosed("02")).toBe(true);
    expect(isRoomClosed("03")).toBe(false);
    expect(getPublishedResult("01")?.winnerKey).toBe("A");
    expect(getPublishedResult("03")).toBeUndefined();
  });
});

describe("fabricateResult", () => {
  it("gives the declared winner the larger share and a matching vote count", () => {
    const result = fabricateResult("01", "A", "B");
    expect(result.roomId).toBe("01");
    expect(result.winnerKey).toBe("A");
    const winnerTally = result.tallies.A!;
    const loserTally = result.tallies.B!;
    expect(winnerTally.pct).toBeGreaterThan(loserTally.pct);
    expect(winnerTally.pct + loserTally.pct).toBe(100);
    expect(winnerTally.votes + loserTally.votes).toBe(result.totalValid);
  });

  it("stays within its documented winner-share and total-vote ranges", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    let result = fabricateResult("01", "A", "B");
    expect(result.tallies.A!.pct).toBe(54);
    expect(result.totalValid).toBe(180);
    expect(result.quarantinedCount).toBe(0);

    vi.spyOn(Math, "random").mockReturnValue(0.999999);
    result = fabricateResult("01", "A", "B");
    expect(result.tallies.A!.pct).toBe(76);
    expect(result.totalValid).toBe(360);
    vi.restoreAllMocks();
  });
});
