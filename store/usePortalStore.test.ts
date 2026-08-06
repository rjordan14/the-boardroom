import { beforeEach, describe, expect, it } from "vitest";
import { usePortalStore } from "./usePortalStore";

const initialState = usePortalStore.getState();

beforeEach(() => {
  usePortalStore.setState(initialState, true);
});

describe("gate / onboarding", () => {
  it("starts locked with onboarded unknown", () => {
    const s = usePortalStore.getState();
    expect(s.gate).toBe("locked");
    expect(s.onboarded).toBeNull();
  });

  it("connectProject opens the gate without changing onboarded", () => {
    usePortalStore.getState().connectProject();
    expect(usePortalStore.getState().gate).toBe("open");
    expect(usePortalStore.getState().onboarded).toBeNull();
  });

  it("finishOnboard marks onboarding complete", () => {
    usePortalStore.getState().setOnboarded(false);
    usePortalStore.getState().finishOnboard();
    expect(usePortalStore.getState().onboarded).toBe(true);
  });
});

describe("team roster", () => {
  it("starts with the seeded team", () => {
    expect(usePortalStore.getState().team).toHaveLength(4);
  });

  it("addMember treats a blank handle as pseudonymous (null), not empty string", () => {
    usePortalStore.getState().addMember("New Person", "Ops", "");
    const added = usePortalStore.getState().team.at(-1)!;
    expect(added.name).toBe("New Person");
    expect(added.handle).toBeNull();
  });

  it("addMember keeps a real handle", () => {
    usePortalStore.getState().addMember("New Person", "Ops", "@newperson");
    const added = usePortalStore.getState().team.at(-1)!;
    expect(added.handle).toBe("@newperson");
  });

  it("removeMember removes only the targeted id", () => {
    usePortalStore.getState().removeMember(2);
    const team = usePortalStore.getState().team;
    expect(team.find((m) => m.id === 2)).toBeUndefined();
    expect(team).toHaveLength(3);
  });
});

describe("Q&A answer flow", () => {
  it("postAnswer is a no-op if there is no draft text", () => {
    usePortalStore.getState().postAnswer("A-3");
    expect(usePortalStore.getState().answers["A-3"]).toBeUndefined();
  });

  it("startAnswer -> setDraft -> postAnswer moves the draft into answers and clears answeringId", () => {
    usePortalStore.getState().startAnswer("A-3");
    expect(usePortalStore.getState().answeringId).toBe("A-3");

    usePortalStore.getState().setDraft("A-3", "EVM only for now.");
    usePortalStore.getState().postAnswer("A-3");

    const s = usePortalStore.getState();
    expect(s.answers["A-3"]).toBe("EVM only for now.");
    expect(s.answeringId).toBeNull();
  });

  it("cancelAnswer clears answeringId without posting", () => {
    usePortalStore.getState().startAnswer("A-3");
    usePortalStore.getState().setDraft("A-3", "draft text");
    usePortalStore.getState().cancelAnswer();
    expect(usePortalStore.getState().answeringId).toBeNull();
    expect(usePortalStore.getState().answers["A-3"]).toBeUndefined();
  });
});

describe("notifications", () => {
  it("all four toggles start on", () => {
    expect(usePortalStore.getState().notif).toEqual({ q: true, b: true, a: true, r: true });
  });

  it("toggleNotif flips only the targeted key", () => {
    usePortalStore.getState().toggleNotif("b");
    const notif = usePortalStore.getState().notif;
    expect(notif.b).toBe(false);
    expect(notif.q).toBe(true);
    expect(notif.a).toBe(true);
    expect(notif.r).toBe(true);
  });
});
