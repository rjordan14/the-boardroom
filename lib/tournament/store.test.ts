import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  closeRound,
  fabricateResult,
  getChampion,
  getClosedRoundResult,
  getCurrentRoundLabel,
  getGeneratedRooms,
  getPublishedResult,
  isRoomClosed,
  isRoundClosed,
  reopenRound,
} from "./store";

// Single global tournament state (not a map keyed by id, unlike
// lib/video/store.ts) — every test resets it so state can't leak
// between tests regardless of order.
beforeEach(() => {
  while (getCurrentRoundLabel() !== "Quarterfinal") {
    reopenRound();
  }
});

function qfResults() {
  return [
    fabricateResult("01", "A", "B"),
    fabricateResult("02", "C", "D"),
    fabricateResult("03", "E", "F"),
    fabricateResult("04", "G", "H"),
  ];
}

describe("closeRound / getClosedRoundResult / isRoundClosed", () => {
  it("starts with no round closed and Quarterfinal live", () => {
    expect(getCurrentRoundLabel()).toBe("Quarterfinal");
    expect(isRoundClosed("Quarterfinal")).toBe(false);
    expect(getClosedRoundResult("Quarterfinal")).toBeUndefined();
  });

  it("closeRound records the round's results", () => {
    const results = qfResults();
    closeRound("Quarterfinal", results);
    expect(isRoundClosed("Quarterfinal")).toBe(true);
    expect(getClosedRoundResult("Quarterfinal")?.results).toEqual(results);
  });

  it("closing again overwrites the previous close, not merges with it", () => {
    closeRound("Quarterfinal", qfResults());
    closeRound("Quarterfinal", [fabricateResult("01", "B", "A")]);
    const closed = getClosedRoundResult("Quarterfinal");
    expect(closed?.results).toHaveLength(1);
    expect(closed?.results[0].winnerKey).toBe("B");
  });
});

describe("round progression: Quarterfinal -> Semifinal -> Final -> complete", () => {
  it("generates two Semifinal rooms pairing winners in bracket order once Quarterfinal closes", () => {
    closeRound("Quarterfinal", qfResults());
    expect(getCurrentRoundLabel()).toBe("Semifinal");
    const sf = getGeneratedRooms().filter((r) => r.roundLabel === "Semifinal");
    expect(sf).toHaveLength(2);
    // room 01+02's winners (A, C) face off; room 03+04's winners (E, G) face off
    expect(sf[0]).toMatchObject({ id: "05", projectA: "A", projectB: "C" });
    expect(sf[1]).toMatchObject({ id: "06", projectA: "E", projectB: "G" });
  });

  it("generates the Final room pairing the two Semifinal winners once Semifinal closes", () => {
    closeRound("Quarterfinal", qfResults());
    closeRound("Semifinal", [fabricateResult("05", "A", "C"), fabricateResult("06", "G", "E")]);
    expect(getCurrentRoundLabel()).toBe("Final");
    const final = getGeneratedRooms().filter((r) => r.roundLabel === "Final");
    expect(final).toHaveLength(1);
    expect(final[0]).toMatchObject({ id: "07", projectA: "A", projectB: "G" });
  });

  it("getCurrentRoundLabel is null once Final closes, and getChampion returns its winner", () => {
    closeRound("Quarterfinal", qfResults());
    closeRound("Semifinal", [fabricateResult("05", "A", "C"), fabricateResult("06", "G", "E")]);
    expect(getChampion()).toBeNull();
    closeRound("Final", [fabricateResult("07", "A", "G")]);
    expect(getCurrentRoundLabel()).toBeNull();
    expect(getChampion()).toBe("A");
  });

  it("does not regenerate Semifinal rooms if Quarterfinal is somehow closed twice", () => {
    closeRound("Quarterfinal", qfResults());
    const firstGen = getGeneratedRooms();
    closeRound("Quarterfinal", qfResults());
    expect(getGeneratedRooms()).toEqual(firstGen);
  });
});

describe("reopenRound (undo the most recently closed round)", () => {
  it("undoing Quarterfinal removes it and any Semifinal rooms generated from it", () => {
    closeRound("Quarterfinal", qfResults());
    expect(getGeneratedRooms()).toHaveLength(2);
    reopenRound();
    expect(getCurrentRoundLabel()).toBe("Quarterfinal");
    expect(isRoundClosed("Quarterfinal")).toBe(false);
    expect(getGeneratedRooms()).toHaveLength(0);
  });

  it("undoing Semifinal removes it and the Final room generated from it, but leaves Quarterfinal closed", () => {
    closeRound("Quarterfinal", qfResults());
    closeRound("Semifinal", [fabricateResult("05", "A", "C"), fabricateResult("06", "G", "E")]);
    reopenRound();
    expect(getCurrentRoundLabel()).toBe("Semifinal");
    expect(isRoundClosed("Quarterfinal")).toBe(true);
    expect(isRoundClosed("Semifinal")).toBe(false);
    expect(getGeneratedRooms().filter((r) => r.roundLabel === "Final")).toHaveLength(0);
    expect(getGeneratedRooms().filter((r) => r.roundLabel === "Semifinal")).toHaveLength(2);
  });

  it("is a no-op when nothing has been closed yet", () => {
    reopenRound();
    expect(getCurrentRoundLabel()).toBe("Quarterfinal");
    expect(getGeneratedRooms()).toHaveLength(0);
  });
});

describe("isRoomClosed / getPublishedResult across multiple closed rounds", () => {
  it("finds results in whichever round a room belongs to, not just the most recent close", () => {
    closeRound("Quarterfinal", qfResults());
    closeRound("Semifinal", [fabricateResult("05", "A", "C"), fabricateResult("06", "G", "E")]);
    expect(isRoomClosed("01")).toBe(true); // Quarterfinal room
    expect(isRoomClosed("05")).toBe(true); // Semifinal room
    expect(isRoomClosed("07")).toBe(false); // Final room, not generated/closed yet
    expect(getPublishedResult("01")?.winnerKey).toBe("A");
    expect(getPublishedResult("05")?.winnerKey).toBe("A");
  });

  it("reports false/undefined for an unknown room", () => {
    expect(isRoomClosed("99")).toBe(false);
    expect(getPublishedResult("99")).toBeUndefined();
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
