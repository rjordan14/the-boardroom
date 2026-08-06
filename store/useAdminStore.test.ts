import { beforeEach, describe, expect, it } from "vitest";
import { useAdminStore } from "./useAdminStore";

const initialState = useAdminStore.getState();

beforeEach(() => {
  useAdminStore.setState(initialState, true);
});

describe("gate", () => {
  it("starts locked", () => {
    expect(useAdminStore.getState().gate).toBe("locked");
  });

  it("connectAdmin opens the gate", () => {
    useAdminStore.getState().connectAdmin();
    expect(useAdminStore.getState().gate).toBe("open");
  });

  it("connectWrongWallet denies the gate", () => {
    useAdminStore.getState().connectWrongWallet();
    expect(useAdminStore.getState().gate).toBe("denied");
  });
});

describe("tournament status", () => {
  it("togglePause flips between live and paused", () => {
    expect(useAdminStore.getState().tourStatus).toBe("live");
    useAdminStore.getState().togglePause();
    expect(useAdminStore.getState().tourStatus).toBe("paused");
    useAdminStore.getState().togglePause();
    expect(useAdminStore.getState().tourStatus).toBe("live");
  });

  it("doCancel ends the tournament and closes the confirm panel", () => {
    useAdminStore.getState().toggleCancelConfirm();
    expect(useAdminStore.getState().cancelOpen).toBe(true);
    useAdminStore.getState().doCancel();
    expect(useAdminStore.getState().tourStatus).toBe("ended");
    expect(useAdminStore.getState().cancelOpen).toBe(false);
  });
});

describe("sendInvite", () => {
  it("is a no-op for an empty target", () => {
    useAdminStore.getState().sendInvite("");
    expect(useAdminStore.getState().lastInvite).toBeNull();
    expect(useAdminStore.getState().inviteToken).toBeNull();
  });

  it("records the target, clears the input, and mints a token", () => {
    useAdminStore.getState().setInviteVal("team@example.com");
    useAdminStore.getState().sendInvite("team@example.com");
    const s = useAdminStore.getState();
    expect(s.lastInvite).toBe("team@example.com");
    expect(s.inviteVal).toBe("");
    expect(s.inviteToken).toBeTruthy();
  });

  it("mints a different token on each call", () => {
    useAdminStore.getState().sendInvite("a@example.com");
    const first = useAdminStore.getState().inviteToken;
    useAdminStore.getState().sendInvite("b@example.com");
    const second = useAdminStore.getState().inviteToken;
    expect(first).not.toBe(second);
  });
});

describe("project detail / remove flow", () => {
  it("openDetail sets the key and resets any stale remove-confirm state", () => {
    useAdminStore.getState().toggleRemoveConfirm();
    useAdminStore.getState().openDetail("A");
    expect(useAdminStore.getState().detailKey).toBe("A");
    expect(useAdminStore.getState().removeConfirmOpen).toBe(false);
  });

  it("doRemove marks the currently open project as removed and closes the modal", () => {
    useAdminStore.getState().openDetail("H");
    useAdminStore.getState().doRemove();
    const s = useAdminStore.getState();
    expect(s.removedKeys.H).toBe(true);
    expect(s.detailKey).toBeNull();
  });

  it("doRemove with no detail open is a no-op on removedKeys", () => {
    useAdminStore.getState().doRemove();
    expect(useAdminStore.getState().removedKeys).toEqual({});
  });
});

describe("submissions / QA / waitlist decisions", () => {
  it("decideSubmission is keyed independently per submission id", () => {
    useAdminStore.getState().decideSubmission("s1", "approved");
    useAdminStore.getState().decideSubmission("s2", "rejected");
    const s = useAdminStore.getState();
    expect(s.subDecisions.s1).toBe("approved");
    expect(s.subDecisions.s2).toBe("rejected");
  });

  it("toggleQaHidden flips per question id", () => {
    useAdminStore.getState().toggleQaHidden("H-1");
    expect(useAdminStore.getState().qaHidden["H-1"]).toBe(true);
    useAdminStore.getState().toggleQaHidden("H-1");
    expect(useAdminStore.getState().qaHidden["H-1"]).toBe(false);
  });

  it("decideWaitlist records invited/declined per applicant", () => {
    useAdminStore.getState().decideWaitlist("w1", "invited");
    useAdminStore.getState().decideWaitlist("w2", "declined");
    const s = useAdminStore.getState();
    expect(s.waitlistDecisions.w1).toBe("invited");
    expect(s.waitlistDecisions.w2).toBe("declined");
  });
});
