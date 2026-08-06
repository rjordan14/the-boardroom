import { describe, expect, it } from "vitest";
import { decideReadyStatus, getUploadStatus, initUpload, MAX_PITCH_SECONDS, setUploadStatus } from "./store";

// Module-level Map with no reset hook (by design — it's a thin
// production wrapper, not worth adding test-only exports to). Each
// test uses its own uploadId so they can't collide.

describe("initUpload / setUploadStatus / getUploadStatus", () => {
  it("returns undefined for an unknown uploadId", () => {
    expect(getUploadStatus("never-seen")).toBeUndefined();
  });

  it("initUpload seeds a waiting state", () => {
    initUpload("u1");
    expect(getUploadStatus("u1")).toEqual({ state: "waiting" });
  });

  it("setUploadStatus overwrites the tracked state for that id only", () => {
    initUpload("u2");
    initUpload("u3");
    setUploadStatus("u2", { state: "errored", message: "boom" });
    expect(getUploadStatus("u2")).toEqual({ state: "errored", message: "boom" });
    expect(getUploadStatus("u3")).toEqual({ state: "waiting" });
  });
});

describe("decideReadyStatus", () => {
  it("accepts a video at exactly the cap", () => {
    const result = decideReadyStatus({
      assetId: "asset-1",
      durationSeconds: MAX_PITCH_SECONDS,
      playbackId: "pb-1",
    });
    expect(result).toEqual({
      state: "ready",
      assetId: "asset-1",
      playbackId: "pb-1",
      durationSeconds: MAX_PITCH_SECONDS,
    });
  });

  it("rejects a video one second over the cap", () => {
    const result = decideReadyStatus({
      assetId: "asset-2",
      durationSeconds: MAX_PITCH_SECONDS + 1,
      playbackId: "pb-2",
    });
    expect(result.state).toBe("rejected");
    if (result.state === "rejected") {
      expect(result.reason).toContain("151");
      expect(result.reason).toContain("2:30");
    }
  });

  it("accepts a well-under-cap video", () => {
    const result = decideReadyStatus({ assetId: "asset-3", durationSeconds: 90, playbackId: "pb-3" });
    expect(result.state).toBe("ready");
  });

  it("rounds up fractional over-cap durations in the rejection message", () => {
    const result = decideReadyStatus({
      assetId: "asset-4",
      durationSeconds: 150.2,
      playbackId: "pb-4",
    });
    expect(result.state).toBe("rejected");
    if (result.state === "rejected") {
      expect(result.reason).toContain("151s");
    }
  });

  it("treats a ready event with no playback id yet as still waiting, not an error", () => {
    const result = decideReadyStatus({ assetId: "asset-5", durationSeconds: 60, playbackId: undefined });
    expect(result).toEqual({ state: "waiting" });
  });
});
