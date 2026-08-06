"use client";

import { useState } from "react";
import type { Project } from "@/lib/types";
import { usePortalStore } from "@/store/usePortalStore";

export function InfoTab({ project }: { project: Project }) {
  const infoSaved = usePortalStore((s) => s.infoSaved);
  const saveInfo = usePortalStore((s) => s.saveInfo);

  const [name, setName] = useState(project.name);
  const [line, setLine] = useState(project.line);
  const [thesis, setThesis] = useState(project.thesis);
  const [traction, setTraction] = useState(project.shipped);
  const [tokenPlan, setTokenPlan] = useState(project.tokenPlan);
  const [risks, setRisks] = useState(project.risksDisclosed);
  const [x, setX] = useState(project.x);
  const [site, setSite] = useState(project.site);

  return (
    <div className="max-w-[800px] px-[clamp(14px,4vw,48px)] py-7.5 pb-[70px]">
      <div className="font-mono text-[20px] font-extrabold text-board-heading">PROJECT INFO</div>
      <div className="mt-2 font-mono text-[11px] leading-[1.7] text-board-secondary">
        This is what the community sees on your compare card and profile. Keep it current —
        traction gets checked before approval.
      </div>

      <div className="mt-6.5 flex flex-col gap-5">
        <Field label="PROJECT NAME" value={name} onChange={setName} bold />
        <Field label="ONE-LINER" value={line} onChange={setLine} />
        <Field label="THESIS — IN YOUR OWN WORDS" value={thesis} onChange={setThesis} textarea rows={3} />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          <Field label="TRACTION" value={traction} onChange={setTraction} />
          <Field label="TOKEN PLAN" value={tokenPlan} onChange={setTokenPlan} />
          <Field label="DISCLOSED RISKS" value={risks} onChange={setRisks} />
          <Field label="X PROFILE" value={x} onChange={setX} />
          <Field label="WEBSITE" value={site} onChange={setSite} />
        </div>
        <div>
          <button
            type="button"
            onClick={saveInfo}
            className="border-2 border-board-lime bg-[#141A06] px-4.5 py-3 font-mono text-[10px] font-extrabold tracking-[0.1em] text-board-lime"
          >
            SAVE CHANGES
          </button>
        </div>
        {infoSaved && (
          <div className="border border-board-border-voting bg-board-card-success px-4 py-2.5 font-mono text-[10px] leading-[1.6] text-board-success">
            Saved — resubmitted for admin review since the round is already live.
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
  rows,
  bold,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  rows?: number;
  bold?: boolean;
}) {
  const cls =
    "mt-2 w-full box-border resize-y border border-board-border-alt bg-board-card-alt px-3.5 py-3 font-mono text-[12px] text-board-heading focus:border-board-lime focus:outline-none " +
    (bold ? "font-bold" : "font-normal");
  return (
    <div>
      <label className="font-mono text-[9px] font-bold tracking-[0.14em] text-board-tertiary">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows ?? 2} className={cls} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </div>
  );
}
