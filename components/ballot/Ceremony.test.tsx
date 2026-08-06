import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { Ceremony } from "./Ceremony";

describe("Ceremony", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders nothing for phase 'idle'", () => {
    const { container } = render(
      <Ceremony phase="idle" projectName="LEDGERBOY" onComplete={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the sign panel during 'signing'", () => {
    render(<Ceremony phase="signing" projectName="LEDGERBOY" onComplete={vi.fn()} />);
    expect(screen.getByText("SIGN TO SEAL YOUR BALLOT")).toBeInTheDocument();
    expect(screen.getByText("LEDGERBOY")).toBeInTheDocument();
  });

  it("shows the stamp card with SEALING status during 'pending'", () => {
    render(<Ceremony phase="pending" projectName="LEDGERBOY" onComplete={vi.fn()} />);
    expect(screen.getByText("SEALING")).toBeInTheDocument();
    expect(screen.getByText("SEALED", { selector: ".w-\\[156px\\]" })).toBeInTheDocument();
  });

  it("does not call onComplete while pending, even after a long wait", () => {
    const onComplete = vi.fn();
    render(<Ceremony phase="pending" projectName="LEDGERBOY" onComplete={onComplete} />);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("calls onComplete exactly once, 900ms after reaching 'confirmed', not before", () => {
    const onComplete = vi.fn();
    render(<Ceremony phase="confirmed" projectName="LEDGERBOY" onComplete={onComplete} />);

    act(() => {
      vi.advanceTimersByTime(899);
    });
    expect(onComplete).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
