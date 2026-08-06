import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockAdapter } from "./mockAdapter";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("getEligibility", () => {
  it("returns a connected, eligible snapshot", async () => {
    const snapshot = await mockAdapter.getEligibility();
    expect(snapshot).toEqual({
      connected: true,
      address: "0x25…1A50",
      eligible: true,
      stonkbrokerBalance: 48200,
    });
  });
});

describe("castVote", () => {
  it("reports phases in order: signing -> pending -> confirmed, never out of order", async () => {
    const phases: string[] = [];
    const promise = mockAdapter.castVote("01", "A", (p) => phases.push(p));

    expect(phases).toEqual(["signing"]);

    await vi.advanceTimersByTimeAsync(1100);
    expect(phases).toEqual(["signing", "pending"]);

    await vi.advanceTimersByTimeAsync(900);
    expect(phases).toEqual(["signing", "pending", "confirmed"]);

    await promise;
  });

  it("does not report pending before the first delay elapses", async () => {
    const phases: string[] = [];
    const promise = mockAdapter.castVote("01", "A", (p) => phases.push(p));

    await vi.advanceTimersByTimeAsync(1099);
    expect(phases).toEqual(["signing"]);

    await vi.advanceTimersByTimeAsync(1);
    expect(phases).toEqual(["signing", "pending"]);

    await vi.advanceTimersByTimeAsync(900);
    await promise;
  });
});

describe("escrowBacking", () => {
  it("reports phases in order: escrowing -> escrowed", async () => {
    const phases: string[] = [];
    const promise = mockAdapter.escrowBacking("01", "A", 888, (p) => phases.push(p));

    expect(phases).toEqual(["escrowing"]);
    await vi.advanceTimersByTimeAsync(400);
    expect(phases).toEqual(["escrowing", "escrowed"]);

    await promise;
  });
});
