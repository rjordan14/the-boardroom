import { describe, expect, it } from "vitest";
import {
  decideReadyStatus,
  getUploadStatus,
  initUpload,
  listReadyPitchUploads,
  MAX_PITCH_SECONDS,
  setUploadStatus,
} from "./store";

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

describe("listReadyPitchUploads", () => {
  it("includes a ready pitch upload with its project context", () => {
    initUpload("p1", { kind: "pitch", projectKey: "B" });
    setUploadStatus("p1", { state: "ready", assetId: "asset-p1", playbackId: "pb-p1", durationSeconds: 45 });

    const found = listReadyPitchUploads().find((u) => u.uploadId === "p1");
    expect(found).toMatchObject({
      uploadId: "p1",
      projectKey: "B",
      assetId: "asset-p1",
      playbackId: "pb-p1",
      durationSeconds: 45,
    });
    expect(typeof found?.readyAt).toBe("number");
  });

  it("excludes a qa-answer upload even once ready — it's a reply, not a new pitch", () => {
    initUpload("p2", { kind: "qa-answer", questionId: "A-1" });
    setUploadStatus("p2", { state: "ready", assetId: "asset-p2", playbackId: "pb-p2", durationSeconds: 20 });

    expect(listReadyPitchUploads().find((u) => u.uploadId === "p2")).toBeUndefined();
  });

  it("excludes a pitch upload that isn't ready yet", () => {
    initUpload("p3", { kind: "pitch", projectKey: "C" });

    expect(listReadyPitchUploads().find((u) => u.uploadId === "p3")).toBeUndefined();
  });

  it("excludes an upload with no recorded context (defensive — shouldn't happen via initUpload)", () => {
    setUploadStatus("p4-untracked", { state: "ready", assetId: "asset-p4", playbackId: "pb-p4", durationSeconds: 30 });

    expect(listReadyPitchUploads().find((u) => u.uploadId === "p4-untracked")).toBeUndefined();
  });
});
