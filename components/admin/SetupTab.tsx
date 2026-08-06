"use client";

import { useState } from "react";

export function SetupTab() {
  const [description, setDescription] = useState("");
  const [projectCount, setProjectCount] = useState("8");
  const [duration, setDuration] = useState("72 hours");
  const [minVote, setMinVote] = useState("1,000");
  const [minBack, setMinBack] = useState("888");
  const [start, setStart] = useState("2026-09-01");
  const [end, setEnd] = useState("2026-09-22");

  return (
    <div className="max-w-[900px] px-[clamp(14px,4vw,48px)] py-7.5 pb-[70px]">
      <div className="font-mono text-[20px] font-extrabold text-board-heading">SEASON 02 SETUP</div>
      <div className="mt-2 font-mono text-[11px] leading-[1.7] text-board-secondary">
        Configure the next tournament before it opens. Season 01 stays live until you start
        Season 02.
      </div>

      <div className="mt-6.5 flex flex-col gap-5">
        <FieldBlock label="TOURNAMENT DESCRIPTION">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="A short description shown on the lobby hero…"
            className="mt-2 w-full resize-y border border-board-border-alt bg-board-card-alt px-3.5 py-3 font-mono text-[12px] leading-[1.6] text-board-heading placeholder:text-board-disabled focus:border-board-lime focus:outline-none"
          />
        </FieldBlock>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          <FieldBlock label="NUMBER OF PROJECTS">
            <select
              value={projectCount}
              onChange={(e) => setProjectCount(e.target.value)}
              className="mt-2 w-full border border-board-border-alt bg-board-card-alt px-3.5 py-3 font-mono text-[12px] font-bold text-board-heading"
            >
              <option>8</option>
              <option>16</option>
              <option>32</option>
            </select>
          </FieldBlock>
          <FieldBlock label="VOTING ROUND DURATION">
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-2 w-full border border-board-border-alt bg-board-card-alt px-3.5 py-3 font-mono text-[12px] font-bold text-board-heading"
            >
              {["24 hours", "48 hours", "72 hours", "5 days", "7 days"].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </FieldBlock>
          <FieldBlock label="MIN $STONKBROKER TO VOTE">
            <input
              value={minVote}
              onChange={(e) => setMinVote(e.target.value)}
              className="mt-2 w-full border border-board-border-alt bg-board-card-alt px-3.5 py-3 font-mono text-[12px] font-bold text-board-heading"
            />
          </FieldBlock>
          <FieldBlock label="MIN $STONKBROKER TO BACK">
            <input
              value={minBack}
              onChange={(e) => setMinBack(e.target.value)}
              className="mt-2 w-full border border-board-border-amber bg-board-card-amber px-3.5 py-3 font-mono text-[12px] font-bold text-board-amber"
            />
          </FieldBlock>
          <FieldBlock label="START DATE">
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="mt-2 w-full border border-board-border-alt bg-board-card-alt px-3.5 py-3 font-mono text-[12px] font-bold text-board-heading"
            />
          </FieldBlock>
          <FieldBlock label="END DATE">
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="mt-2 w-full border border-board-border-alt bg-board-card-alt px-3.5 py-3 font-mono text-[12px] font-bold text-board-heading"
            />
          </FieldBlock>
        </div>

        <div className="mt-1.5 flex flex-wrap gap-2.5">
          <button type="button" className="border border-board-border-alt px-4.5 py-3 font-mono text-[10px] font-bold tracking-[0.1em] text-board-secondary">
            SAVE DRAFT
          </button>
          <button type="button" className="border-2 border-board-lime bg-[#141A06] px-4.5 py-3 font-mono text-[10px] font-extrabold tracking-[0.1em] text-board-lime">
            START SEASON 02
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-mono text-[9px] font-bold tracking-[0.14em] text-board-tertiary">{label}</label>
      {children}
    </div>
  );
}
