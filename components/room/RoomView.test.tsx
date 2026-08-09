import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { RoomView } from "./RoomView";
import { useBoardroomStore } from "@/store/useBoardroomStore";
import type { Project, Room } from "@/lib/types";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

const projectA: Project = {
  key: "A",
  name: "LEDGERBOY",
  line: "Onchain receipts for people who lose them",
  mark: "/marks/ledgerboy.png",
  pitchSeconds: 6,
  team: "",
  shipped: "",
  tokenPlan: "",
  risksDisclosed: "",
  x: "@ledgerboy",
  site: "ledgerboy.xyz",
  thesis: "",
  people: [],
};
const projectB: Project = { ...projectA, key: "B", name: "VAULTMOUSE" };

const room: Room = {
  id: "test-room",
  roundLabel: "Quarterfinal",
  n: 1,
  projectA: "A",
  projectB: "B",
  status: "open",
  closesAt: "2026-08-09T22:00:00.000Z",
};

const qaByProject = { A: [], B: [] };

const initialStoreState = useBoardroomStore.getState();

beforeEach(() => {
  useBoardroomStore.setState(initialStoreState, true);
  push.mockClear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("RoomView", () => {
  it("keeps the B tab disabled until A reaches 100%, then enables it", () => {
    render(<RoomView room={room} projectA={projectA} projectB={projectB} qaByProject={qaByProject} />);

    // "VAULTMOUSE" also appears in the ballot-progress panel below the
    // tab bar — find the one that's actually inside the tab button.
    const bTab = screen
      .getAllByText("VAULTMOUSE")
      .map((el) => el.closest("button"))
      .find((btn): btn is HTMLButtonElement => btn !== null)!;
    expect(bTab).toBeDisabled();
    expect(screen.getByText("LOCKED UNTIL A IS WATCHED")).toBeInTheDocument();

    act(() => {
      useBoardroomStore.getState().setWatchProgress(room.id, "pA", 100);
    });

    expect(bTab).not.toBeDisabled();
  });

  it("routes to /room/[id]/compare once both pitches are fully watched", () => {
    // Pre-seed both as watched — this test targets the routing decision,
    // not the timer mechanics that get you there (see the fake-timer
    // test below for that).
    useBoardroomStore.getState().setWatchProgress(room.id, "pA", 100);
    useBoardroomStore.getState().setWatchProgress(room.id, "pB", 100);

    render(<RoomView room={room} projectA={projectA} projectB={projectB} qaByProject={qaByProject} />);

    // Initial phase is derived from pA on mount (>=100 -> "done"), so the
    // completion button is present immediately without waiting on timers.
    const cta = screen.getByText("COMPARE & VOTE →");
    cta.click();

    expect(push).toHaveBeenCalledWith(`/room/${room.id}/compare`);
  });

  it("simulated playback advances progress over time and reaches 100 without overshooting logic breaking", () => {
    vi.useFakeTimers();
    render(<RoomView room={room} projectA={projectA} projectB={projectB} qaByProject={qaByProject} />);

    // door phase holds for 3820ms before playback starts — matches the
    // door+walker sequence's own timing (1320ms delay + 2500ms walk).
    act(() => {
      vi.advanceTimersByTime(3820);
    });
    // Exact text, not a substring regex — the door chip's lingering exit
    // animation ("NOW ENTERING · LEDGERBOY") also contains "ENTERING" as
    // a substring and framer-motion's AnimatePresence doesn't finish
    // that exit synchronously under fake timers, so it can still be
    // in the DOM at this point.
    expect(screen.getByText("PLAYING")).toBeInTheDocument();

    // Playback runs over a fixed 6000ms regardless of pitchSeconds, in
    // 80ms steps of 100/75 each. Floating-point accumulation of a
    // repeating decimal step doesn't land on exactly 100 at tick 75
    // (it's off by ~1e-13) — clamped up to 100 on the following tick
    // instead, so completion takes one tick longer than the nominal
    // duration. Real, harmless (~80ms, imperceptible), not worth adding
    // step-rounding complexity to the app to avoid — advance one extra
    // tick here to match actual behavior rather than the nominal one.
    act(() => {
      vi.advanceTimersByTime(6080);
    });

    expect(useBoardroomStore.getState().watchProgress[room.id].pA).toBe(100);
    expect(screen.getByText(/PITCH COMPLETE/)).toBeInTheDocument();
  });
});
