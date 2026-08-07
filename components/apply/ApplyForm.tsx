"use client";

import { useState } from "react";
import Link from "next/link";

interface FormState {
  name: string;
  line: string;
  traction: string;
  site: string;
  x: string;
  founder: string;
  founderX: string;
  email: string;
  wallet: string;
  why: string;
}

const EMPTY: FormState = {
  name: "",
  line: "",
  traction: "",
  site: "",
  x: "",
  founder: "",
  founderX: "",
  email: "",
  wallet: "",
  why: "",
};

export function ApplyForm() {
  const [f, setF] = useState<FormState>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = () => {
    if (!f.name || !f.line || !f.email) {
      setError(true);
      return;
    }
    setError(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-[560px] px-[clamp(14px,4vw,48px)] py-20 text-center">
        <div className="font-mono text-[22px] font-extrabold text-board-lime">
          YOU&apos;RE ON THE WAITLIST
        </div>
        <div className="mt-3.5 font-mono text-[12px] leading-[1.8] text-board-secondary">
          {f.name} is in for review. If there&apos;s a fit for a future season, we&apos;ll reach
          out at {f.email} — no need to follow up.
        </div>
        <Link
          href="/"
          className="mt-6.5 inline-block border border-board-border px-4.5 py-3 font-mono text-[10px] font-bold tracking-[0.1em] text-board-secondary transition hover:border-board-lime hover:text-board-lime"
        >
          ← BACK TO THE LOBBY
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1180px] px-[clamp(14px,4vw,48px)] py-10">
      <div className="font-mono text-[9px] font-bold tracking-[0.16em] text-board-secondary-alt">
        SEASON 02 WAITLIST
      </div>
      <div className="mt-3 font-mono text-[26px] font-extrabold leading-[1.2] text-board-heading">
        Get your project considered
      </div>
      <div className="mt-3 max-w-[640px] text-pretty font-mono text-[12px] leading-[1.8] text-board-secondary">
        Season 01 is full. Tell us about your project and we&apos;ll reach out if there&apos;s a
        fit for a future season — no commitment, and we don&apos;t share this with anyone outside
        the review team.
      </div>

      <div className="mt-7.5 grid items-start gap-[clamp(24px,3vw,52px)] lg:grid-cols-[minmax(0,640px)_minmax(260px,360px)]">
        <div className="flex flex-col gap-4.5">
          <Field label="PROJECT NAME" value={f.name} onChange={set("name")} placeholder="What should we call it?" bold />
          <Field label="ONE-LINER" value={f.line} onChange={set("line")} placeholder="What does it do, in one sentence?" />
          <Field
            label="CURRENT TRACTION"
            value={f.traction}
            onChange={set("traction")}
            placeholder="Wallets, TVL, users, revenue — whatever's real right now"
            textarea
          />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
            <Field label="WEBSITE" value={f.site} onChange={set("site")} placeholder="yourproject.xyz" />
            <Field label="PROJECT X PROFILE" value={f.x} onChange={set("x")} placeholder="@yourproject" />
            <Field label="FOUNDER NAME" value={f.founder} onChange={set("founder")} />
            <Field
              label="FOUNDER X (OPTIONAL — DOXX)"
              value={f.founderX}
              onChange={set("founderX")}
              placeholder="@handle, leave blank to stay anon"
            />
            <Field label="CONTACT EMAIL" value={f.email} onChange={set("email")} />
            <Field label="WALLET ADDRESS" value={f.wallet} onChange={set("wallet")} placeholder="0x…" />
          </div>
          <Field
            label="WHY THE BOARDROOM, WHY NOW"
            value={f.why}
            onChange={set("why")}
            placeholder="What are you hoping a launch here does for you?"
            textarea
            rows={3}
          />

          <button
            type="button"
            onClick={submit}
            className="mt-2 border-2 border-board-lime bg-[#141A06] py-4 text-center font-mono text-[11px] font-extrabold tracking-[0.12em] text-board-lime transition hover:bg-[#1A2208]"
          >
            JOIN THE WAITLIST
          </button>
          {error && (
            <div className="font-mono text-[10px] leading-[1.6] text-board-error">
              Project name, one-liner and contact email are required.
            </div>
          )}
        </div>

        <WhatHappensNext />
      </div>
    </div>
  );
}

const NEXT_STEPS = [
  {
    n: "01",
    title: "REVIEWED",
    body: "Every application goes to a person on the team — no automated filter decides.",
  },
  {
    n: "02",
    title: "FIT CHECK",
    body: "We check whether there's room in an upcoming season and if the timing lines up.",
  },
  {
    n: "03",
    title: "WE REACH OUT",
    body: "Only if there's a fit. No response isn't a rejection — you stay on the list.",
  },
];

function WhatHappensNext() {
  return (
    <div className="border border-board-border-alt bg-board-card-alt p-5">
      <div className="font-mono text-[10px] font-extrabold tracking-[0.18em] text-board-lime">
        WHAT HAPPENS NEXT
      </div>
      <div className="mt-4 flex flex-col gap-4">
        {NEXT_STEPS.map((step) => (
          <div key={step.n} className="flex gap-3">
            <div className="flex-none font-mono text-[10px] font-extrabold text-board-tertiary">
              {step.n}
            </div>
            <div>
              <div className="font-mono text-[11px] font-bold tracking-[0.08em] text-board-heading">
                {step.title}
              </div>
              <div className="mt-1 font-mono text-[11px] leading-[1.7] text-board-secondary">
                {step.body}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4.5 border-t border-[#1A1E16] pt-4 font-mono text-[10px] leading-[1.7] text-board-tertiary">
        No project in The Boardroom has a token during review. We never ask for funds or wallet
        signatures to apply.
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
  rows,
  bold,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
  bold?: boolean;
}) {
  const inputClass =
    "mt-2 w-full box-border border border-board-border-alt bg-board-card-alt px-3.5 py-3 font-mono text-[12px] text-board-heading placeholder:text-board-disabled focus:border-board-lime focus:outline-none " +
    (bold ? "font-bold" : "font-normal");
  return (
    <div>
      <label className="font-mono text-[9px] font-bold tracking-[0.14em] text-board-tertiary">
        {label}
      </label>
      {textarea ? (
        <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows ?? 2} className={inputClass + " resize-y"} />
      ) : (
        <input type="text" value={value} onChange={onChange} placeholder={placeholder} className={inputClass} />
      )}
    </div>
  );
}
