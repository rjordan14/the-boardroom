import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MatchupRow } from "./MatchupRow";
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

describe("MatchupRow", () => {
  it("renders a VoteCta linking to /room/[id] for an open room", () => {
    render(<MatchupRow room={makeRoom("open")} projectA={projectA} projectB={projectB} />);
    const votes = screen.getAllByText("CLOCK IN TO VOTE");
    expect(votes.length).toBeGreaterThan(0);
    for (const el of votes) {
      const link = el.closest("a");
      expect(link).toHaveAttribute("href", "/room/01");
    }
    expect(screen.queryByText("VIEW RESULT →")).not.toBeInTheDocument();
  });

  it("renders a ResultCta linking to /room/[id]/result for a closed room", () => {
    render(<MatchupRow room={makeRoom("closed")} projectA={projectA} projectB={projectB} />);
    const results = screen.getAllByText("VIEW RESULT →");
    expect(results.length).toBeGreaterThan(0);
    for (const el of results) {
      const link = el.closest("a");
      expect(link).toHaveAttribute("href", "/room/01/result");
    }
    expect(screen.queryByText("CLOCK IN TO VOTE")).not.toBeInTheDocument();
  });

  it("links each project name to its profile", () => {
    render(<MatchupRow room={makeRoom("open")} projectA={projectA} projectB={projectB} />);
    const ledgerboyLinks = screen.getAllByText("LEDGERBOY").map((el) => el.closest("a"));
    for (const link of ledgerboyLinks) {
      expect(link).toHaveAttribute("href", "/profile/A");
    }
  });
});
