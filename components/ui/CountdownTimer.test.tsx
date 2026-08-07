import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { CountdownTimer } from "./CountdownTimer";

// The pre-mount placeholder (see the component's own comment: computing
// from Date.now() during SSR would bake a stale timestamp into the HTML
// and risk a hydration mismatch) isn't independently observable through
// RTL without a real SSR pass — render() flushes the mount effect before
// returning. What's testable and worth locking in here is the behavior
// that placeholder exists to protect: the displayed value is always
// derived from the *current* clock, and it updates as time passes.

describe("CountdownTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-06T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the countdown to the target relative to the current clock", () => {
    render(<CountdownTimer target="2026-08-08T07:03:18.000Z" />);
    expect(screen.getByText("2d 07:03:18")).toBeInTheDocument();
  });

  it("ticks down as time advances", () => {
    render(<CountdownTimer target="2026-08-06T00:00:10.000Z" />);
    expect(screen.getByText("1d 00:00:10")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByText("1d 00:00:07")).toBeInTheDocument();
  });

  it("floors at zero once the target has passed rather than going negative", () => {
    render(<CountdownTimer target="2026-08-06T00:00:01.000Z" />);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText("0d 00:00:00")).toBeInTheDocument();
  });
});
