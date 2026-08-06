"use client";

import { useState } from "react";
import { usePortalStore } from "@/store/usePortalStore";

export function TeamTab() {
  const team = usePortalStore((s) => s.team);
  const addMember = usePortalStore((s) => s.addMember);
  const removeMember = usePortalStore((s) => s.removeMember);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [handle, setHandle] = useState("");

  const add = () => {
    if (!name || !role) return;
    addMember(name, role, handle);
    setName("");
    setRole("");
    setHandle("");
  };

  return (
    <div className="max-w-[800px] px-[clamp(14px,4vw,48px)] py-7.5 pb-[70px]">
      <div className="font-mono text-[20px] font-extrabold text-board-heading">TEAM</div>
      <div className="mt-2 font-mono text-[11px] leading-[1.7] text-board-secondary">
        Doxxed members show their X handle publicly, clickable, on your profile. Leave the handle
        blank to stay pseudonymous.
      </div>

      <div className="mt-5.5 flex flex-col gap-2.5">
        {team.map((m) => (
          <div key={m.id} className="flex flex-wrap items-center gap-3 border border-board-border-alt bg-board-card-alt p-3.5">
            <div className="min-w-[140px] flex-1 font-mono text-[12px] font-extrabold text-board-heading">{m.name}</div>
            <div className="w-[120px] font-mono text-[11px] text-board-secondary">{m.role}</div>
            <div className="w-[150px] font-mono text-[11px]" style={{ color: m.handle ? "#CCFF00" : "#4E5747" }}>
              {m.handle ?? "pseudonymous"}
            </div>
            <button
              type="button"
              onClick={() => removeMember(m.id)}
              className="font-mono text-[10px] font-bold tracking-[0.06em] text-board-error"
            >
              REMOVE
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4.5 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))_auto] items-end gap-2.5 border border-dashed border-[#3D4536] p-4.5">
        <div>
          <label className="font-mono text-[9px] font-bold tracking-[0.1em] text-board-tertiary">NAME</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full border border-board-border-alt bg-board-bg px-3 py-2.5 font-mono text-[11px] text-board-heading"
          />
        </div>
        <div>
          <label className="font-mono text-[9px] font-bold tracking-[0.1em] text-board-tertiary">ROLE</label>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1.5 w-full border border-board-border-alt bg-board-bg px-3 py-2.5 font-mono text-[11px] text-board-heading"
          />
        </div>
        <div>
          <label className="font-mono text-[9px] font-bold tracking-[0.1em] text-board-tertiary">X HANDLE (OPTIONAL)</label>
          <input
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="@handle"
            className="mt-1.5 w-full border border-board-border-alt bg-board-bg px-3 py-2.5 font-mono text-[11px] text-board-heading placeholder:text-board-disabled"
          />
        </div>
        <button
          type="button"
          onClick={add}
          className="border-2 border-board-lime bg-[#141A06] px-4 py-2.5 font-mono text-[10px] font-extrabold tracking-[0.08em] text-board-lime"
        >
          ADD
        </button>
      </div>
    </div>
  );
}
