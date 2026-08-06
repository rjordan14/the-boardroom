import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("clamps percent into [0, 100] for width and aria-valuenow", () => {
    const { getByRole, rerender } = render(<ProgressBar percent={150} />);
    let bar = getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "100");

    rerender(<ProgressBar percent={-20} />);
    bar = getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "0");
  });

  it("defaults the fill to bg-board-lime when no fillClassName is given", () => {
    const { getByRole } = render(<ProgressBar percent={50} />);
    const fill = getByRole("progressbar").firstElementChild!;
    expect(fill).toHaveClass("bg-board-lime");
  });

  it("replaces the default fill color with fillClassName, not appends alongside it", () => {
    // Regression test: bg-board-lime and a caller's override both being
    // present in the class list previously meant the override could
    // silently lose (Tailwind class order in generated CSS, not JSX
    // order, decides which wins) — the Result screen's loser bar
    // rendered lime instead of the intended muted gray.
    const { getByRole } = render(<ProgressBar percent={41.7} fillClassName="bg-[#4A5540]" />);
    const fill = getByRole("progressbar").firstElementChild!;
    expect(fill).toHaveClass("bg-[#4A5540]");
    expect(fill).not.toHaveClass("bg-board-lime");
  });

  it("treats an empty-string fillClassName as 'no override', not as a class that clears the fill", () => {
    const { getByRole } = render(<ProgressBar percent={50} fillClassName="" />);
    const fill = getByRole("progressbar").firstElementChild!;
    expect(fill).toHaveClass("bg-board-lime");
  });
});
