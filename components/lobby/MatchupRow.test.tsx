import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MatchupRow } from "./MatchupRow";
import { useBoardroomStore } from "@/store/useBoardroomStore";
import type { Project, Room } from "@/lib/types";

const projectA: Project = {
  key: "A",
  name: "LEDGERBOY",
  line: "Onchain receipts for people who lose them",
  mark: "/marks/ledgerboy.png",
  pitchSeconds: 167,
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

function makeRoom(status: Room["status"]): Room {
  return {
    id: "01",
    roundLabel: "Quarterfinal",
    n: 1,
    projectA: "A",
    projectB: "B",
    status,
    closesAt: "2026-08-09T22:00:00.000Z",
  };
}

// The store is a module singleton — reset the per-wallet slices this
// component reads so state from one test can't leak into the next.
beforeEach(() => {
  useBoardroomStore.setState({
    watchProgress: {},
    watchStartedAt: {},
    ballotChoice: {},
    ballotSealedAt: {},
  });
});

describe("MatchupRow", () => {
  it("renders a VoteCta linking to /room/[id] for an open room", () => {
    render(
      <MatchupRow room={makeRoom("open")} projectA={projectA} projectB={projectB} roundComplete={false} />
    );
    const votes = screen.getAllByText("CLOCK IN TO VOTE");
    expect(votes.length).toBeGreaterThan(0);
    for (const el of votes) {
      const link = el.closest("a");
      expect(link).toHaveAttribute("href", "/room/01");
    }
    expect(screen.queryByText("VIEW RESULT →")).not.toBeInTheDocument();
  });

  it("renders a ResultCta linking to /room/[id]/result for a closed room once the whole round is complete, and no progress sub-panel", () => {
    render(
      <MatchupRow room={makeRoom("closed")} projectA={projectA} projectB={projectB} roundComplete={true} />
    );
    const results = screen.getAllByText("VIEW RESULT →");
    expect(results.length).toBeGreaterThan(0);
    for (const el of results) {
      const link = el.closest("a");
      expect(link).toHaveAttribute("href", "/room/01/result");
    }
    expect(screen.queryByText("CLOCK IN TO VOTE")).not.toBeInTheDocument();
    expect(screen.queryByText("BALLOT UNLOCKS AFTER BOTH PITCHES")).not.toBeInTheDocument();
  });

  it("withholds the result and shows a neutral notice for a closed room while sibling rooms in the round are still open", () => {
    render(
      <MatchupRow room={makeRoom("closed")} projectA={projectA} projectB={projectB} roundComplete={false} />
    );
    expect(screen.getAllByText("RESULT AFTER ROUND CLOSES").length).toBeGreaterThan(0);
    expect(screen.queryByText("VIEW RESULT →")).not.toBeInTheDocument();
  });

  it("links each project name to its profile", () => {
    render(
      <MatchupRow room={makeRoom("open")} projectA={projectA} projectB={projectB} roundComplete={false} />
    );
    const ledgerboyLinks = screen.getAllByText("LEDGERBOY").map((el) => el.closest("a"));
    for (const link of ledgerboyLinks) {
      expect(link).toHaveAttribute("href", "/profile/A");
    }
  });

  it("shows the not-started progress sub-panel with 0% bars when an open room has no watch activity yet", () => {
    render(
      <MatchupRow room={makeRoom("open")} projectA={projectA} projectB={projectB} roundComplete={false} />
    );
    expect(screen.getAllByText("BALLOT UNLOCKS AFTER BOTH PITCHES").length).toBeGreaterThan(0);
    expect(screen.getAllByText("0 OF 2 WATCHED").length).toBeGreaterThan(0);
  });

  it("shows the watching state once progress exists, with the CTA still linking into the room", () => {
    useBoardroomStore.getState().setWatchProgress("01", "pA", 40);
    render(
      <MatchupRow room={makeRoom("open")} projectA={projectA} projectB={projectB} roundComplete={false} />
    );
    expect(screen.getAllByText(/WATCHING NOW/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/PITCH A PLAYING/).length).toBeGreaterThan(0);
    const votes = screen.getAllByText("CLOCK IN TO VOTE");
    for (const el of votes) {
      expect(el.closest("a")).toHaveAttribute("href", "/room/01");
    }
  });

  it("shows a compare CTA once both pitches are fully watched but no ballot is cast yet", () => {
    useBoardroomStore.getState().setWatchProgress("01", "pA", 100);
    useBoardroomStore.getState().setWatchProgress("01", "pB", 100);
    render(
      <MatchupRow room={makeRoom("open")} projectA={projectA} projectB={projectB} roundComplete={false} />
    );
    expect(screen.getAllByText(/BOTH PITCHES WATCHED/).length).toBeGreaterThan(0);
    const compare = screen.getAllByText("COMPARE & VOTE");
    expect(compare.length).toBeGreaterThan(0);
    for (const el of compare) {
      expect(el.closest("a")).toHaveAttribute("href", "/room/01/compare");
    }
  });

  it("shows the sealed-ballot receipt and a review CTA once a wallet has voted, even in a closed room", () => {
    useBoardroomStore.getState().setBallotChoice("01", "A");
    render(
      <MatchupRow room={makeRoom("closed")} projectA={projectA} projectB={projectB} roundComplete={false} />
    );
    expect(screen.getAllByText("✓ YOU VOTED · BALLOT SEALED").length).toBeGreaterThan(0);
    const review = screen.getAllByText("VIEW MY BALLOT →");
    expect(review.length).toBeGreaterThan(0);
    for (const el of review) {
      expect(el.closest("a")).toHaveAttribute("href", "/my-activity");
    }
    expect(screen.queryByText("VIEW RESULT →")).not.toBeInTheDocument();
  });
});
