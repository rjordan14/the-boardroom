import { beforeEach, describe, expect, it } from "vitest";
import { getRoomProgress, getSubmittedQuestions, useBoardroomStore } from "./useBoardroomStore";

const initialState = useBoardroomStore.getState();

beforeEach(() => {
  useBoardroomStore.setState(initialState, true);
});

describe("getRoomProgress", () => {
  it("returns the exact same object reference for a room with no entry, across calls", () => {
    // This is the actual bug that caused an infinite render loop: a
    // fresh `{ pA: 0, pB: 0 }` literal on every call breaks
    // useSyncExternalStore's reference-equality check.
    const a = getRoomProgress(useBoardroomStore.getState().watchProgress, "99");
    const b = getRoomProgress(useBoardroomStore.getState().watchProgress, "99");
    expect(a).toBe(b);
    expect(a).toEqual({ pA: 0, pB: 0 });
  });

  it("returns the stored entry once one exists", () => {
    useBoardroomStore.getState().setWatchProgress("01", "pA", 42);
    expect(getRoomProgress(useBoardroomStore.getState().watchProgress, "01")).toEqual({ pA: 42, pB: 0 });
  });
});

describe("setWatchProgress", () => {
  it("preserves the untouched key when only one is set", () => {
    useBoardroomStore.getState().setWatchProgress("01", "pA", 50);
    useBoardroomStore.getState().setWatchProgress("01", "pB", 30);
    expect(useBoardroomStore.getState().watchProgress["01"]).toEqual({ pA: 50, pB: 30 });
  });

  it("only affects the targeted room", () => {
    useBoardroomStore.getState().setWatchProgress("01", "pA", 100);
    useBoardroomStore.getState().setWatchProgress("02", "pA", 10);
    expect(useBoardroomStore.getState().watchProgress["01"].pA).toBe(100);
    expect(useBoardroomStore.getState().watchProgress["02"].pA).toBe(10);
  });
});

describe("ballotChoice", () => {
  it("round-trips a set choice per room", () => {
    useBoardroomStore.getState().setBallotChoice("01", "A");
    expect(useBoardroomStore.getState().ballotChoice["01"]).toBe("A");
  });
});

describe("backing", () => {
  it("setBackingAmount defaults escrowed to false and preserves it once set", () => {
    useBoardroomStore.getState().setBackingAmount("01", 2500);
    expect(useBoardroomStore.getState().backing["01"]).toEqual({ amount: 2500, escrowed: false });

    useBoardroomStore.getState().setBackingEscrowed("01", true);
    expect(useBoardroomStore.getState().backing["01"]).toEqual({ amount: 2500, escrowed: true });
  });

  it("setBackingEscrowed defaults amount to 888 if none was set yet", () => {
    useBoardroomStore.getState().setBackingEscrowed("02", true);
    expect(useBoardroomStore.getState().backing["02"]).toEqual({ amount: 888, escrowed: true });
  });
});

describe("qaUpvotes", () => {
  it("toggles independently per question id", () => {
    useBoardroomStore.getState().toggleQaUpvote("A-1");
    expect(useBoardroomStore.getState().qaUpvotes["A-1"]).toBe(true);
    useBoardroomStore.getState().toggleQaUpvote("A-1");
    expect(useBoardroomStore.getState().qaUpvotes["A-1"]).toBe(false);
    expect(useBoardroomStore.getState().qaUpvotes["A-2"]).toBeUndefined();
  });
});

describe("submitQuestion / getSubmittedQuestions", () => {
  it("returns a stable empty-array reference for a project with no submissions", () => {
    const a = getSubmittedQuestions(useBoardroomStore.getState().submittedQuestions, "A");
    const b = getSubmittedQuestions(useBoardroomStore.getState().submittedQuestions, "A");
    expect(a).toBe(b);
    expect(a).toEqual([]);
  });

  it("appends a question with a unique id and timestamp", () => {
    useBoardroomStore.getState().submitQuestion("A", "Will you support Solana?");
    const list = getSubmittedQuestions(useBoardroomStore.getState().submittedQuestions, "A");
    expect(list).toHaveLength(1);
    expect(list[0].question).toBe("Will you support Solana?");
    expect(list[0].id).toMatch(/^local-/);
  });

  it("keeps per-project lists separate", () => {
    useBoardroomStore.getState().submitQuestion("A", "Question for A");
    useBoardroomStore.getState().submitQuestion("B", "Question for B");
    expect(getSubmittedQuestions(useBoardroomStore.getState().submittedQuestions, "A")).toHaveLength(1);
    expect(getSubmittedQuestions(useBoardroomStore.getState().submittedQuestions, "B")).toHaveLength(1);
  });
});
