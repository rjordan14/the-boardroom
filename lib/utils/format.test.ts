import { describe, expect, it } from "vitest";
import { formatClock, formatCountdown } from "./format";

describe("formatCountdown", () => {
  it("formats days/hours/minutes/seconds with zero-padding", () => {
    const ms = 2 * 86400_000 + 7 * 3600_000 + 3 * 60_000 + 18_000;
    expect(formatCountdown(ms)).toBe("2d 07:03:18");
  });

  it("clamps negative remaining time to zero rather than going negative", () => {
    expect(formatCountdown(-5000)).toBe("0d 00:00:00");
  });

  it("renders exactly zero the same way", () => {
    expect(formatCountdown(0)).toBe("0d 00:00:00");
  });

  it("rolls hours/minutes/seconds over correctly at day boundaries", () => {
    // 1 day and 1 second
    expect(formatCountdown(86401_000)).toBe("1d 00:00:01");
  });
});

describe("formatClock", () => {
  it("formats minutes:seconds with zero-padded seconds", () => {
    expect(formatClock(167)).toBe("2:47");
  });

  it("clamps negative seconds to zero", () => {
    expect(formatClock(-3)).toBe("0:00");
  });

  it("floors fractional seconds", () => {
    expect(formatClock(59.9)).toBe("0:59");
  });
});
