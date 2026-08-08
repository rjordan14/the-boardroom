"use client";

import { useEffect, useState } from "react";
import { useBoardroomStore } from "@/store/useBoardroomStore";

const BATTLE_DURATION_MS = 45_000;

export interface BattleCandidate {
  id: string;
  question: string;
  asker: string;
  upvotes: number;
}

/** Two top-upvoted questions face off "king of the hill" style — the
 *  crowd's vote (seeded from existing upvotes, so it doesn't start at a
 *  suspicious 0-0) decides which one gets crowned. Resolves on a timer,
 *  then immediately queues the next pair from whatever's left in the
 *  pool. See store/useBoardroomStore.ts for the battle/crown state. */
export function QaBattle({ projectKey, candidates }: { projectKey: string; candidates: BattleCandidate[] }) {
  const battle = useBoardroomStore((s) => s.battles[projectKey]);
  const startBattle = useBoardroomStore((s) => s.startBattle);
  const battleVotes = useBoardroomStore((s) => s.battleVotes);
  const castBattleVote = useBoardroomStore((s) => s.castBattleVote);
  const resolveBattle = useBoardroomStore((s) => s.resolveBattle);
  const crown = useBoardroomStore((s) => s.crowns[projectKey]);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (battle) return;
    const pool = candidates
      .filter((c) => c.id !== crown?.questionId)
      .sort((a, b) => b.upvotes - a.upvotes);
    if (pool.length < 2) return;
    const [a, b] = pool;
    startBattle(projectKey, a.id, b.id, Math.round(a.upvotes * 0.6), Math.round(b.upvotes * 0.6));
  }, [battle, candidates, crown, projectKey, startBattle]);

  useEffect(() => {
    if (!battle) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [battle]);

  useEffect(() => {
    if (!battle) return;
    if (now - battle.startedAt < BATTLE_DURATION_MS) return;
    const qA = candidates.find((c) => c.id === battle.aId);
    const qB = candidates.find((c) => c.id === battle.bId);
    if (!qA || !qB) return;
    const winnerIsA = battle.votesA >= battle.votesB;
    const winner = winnerIsA ? qA : qB;
    const battleKey = `${projectKey}:${battle.aId}:${battle.bId}`;
    resolveBattle(
      projectKey,
      battleKey,
      { questionId: winner.id, question: winner.question, asker: winner.asker, wonAt: Date.now() },
      winnerIsA ? "A" : "B"
    );
  }, [battle, now, candidates, projectKey, resolveBattle]);

  if (!battle) return null;
  const qA = candidates.find((c) => c.id === battle.aId);
  const qB = candidates.find((c) => c.id === battle.bId);
  if (!qA || !qB) return null;

  const battleKey = `${projectKey}:${battle.aId}:${battle.bId}`;
  const userVote = battleVotes[battleKey];
  const remainingSec = Math.max(0, Math.ceil((BATTLE_DURATION_MS - (now - battle.startedAt)) / 1000));
  const total = battle.votesA + battle.votesB;
  const pctA = total > 0 ? Math.round((battle.votesA / total) * 100) : 50;

  return (
    <div className="mb-5.5 border-2 border-board-lime bg-[#0F1407] p-4.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-mono text-[10px] font-extrabold tracking-[0.14em] text-board-lime">
          <span className="block h-1.5 w-1.5 animate-[board-pulse_1.2s_ease-in-out_infinite] rounded-full bg-board-lime" />
          KING OF THE HILL · CROWD PICKS THE BEST QUESTION
        </div>
        <div className="font-mono text-[10px] font-bold text-board-secondary-alt">{remainingSec}s left</div>
      </div>

      <div className="mt-3.5 grid grid-cols-1 items-stretch gap-2.5 sm:grid-cols-[1fr_auto_1fr]">
        <BattleSide
          question={qA}
          votes={battle.votesA}
          picked={userVote === "A"}
          disabled={!!userVote}
          onPick={() => castBattleVote(projectKey, battleKey, "A")}
        />
        <div className="flex items-center justify-center font-mono text-[13px] font-extrabold text-board-lime">
          VS
        </div>
        <BattleSide
          question={qB}
          votes={battle.votesB}
          picked={userVote === "B"}
          disabled={!!userVote}
          onPick={() => castBattleVote(projectKey, battleKey, "B")}
          reverse
        />
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden bg-[#1E2419]">
        <div className="h-full bg-board-lime transition-all duration-500" style={{ width: `${pctA}%` }} />
      </div>
    </div>
  );
}

function BattleSide({
  question,
  votes,
  picked,
  disabled,
  onPick,
  reverse,
}: {
  question: BattleCandidate;
  votes: number;
  picked: boolean;
  disabled: boolean;
  onPick: () => void;
  reverse?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      disabled={disabled}
      className={`flex flex-col gap-1.5 border p-3 transition disabled:cursor-default ${reverse ? "text-left sm:text-right" : "text-left"} ${
        picked ? "border-board-lime bg-[#141A06]" : "border-[#2C3327] bg-[#0A0D07] hover:enabled:border-[#4A5A2C]"
      }`}
    >
      <div className="font-mono text-[9px] text-board-tertiary">{question.asker}</div>
      <div className="font-mono text-[11px] leading-[1.5] text-board-body">&quot;{question.question}&quot;</div>
      <div className="mt-1 font-mono text-[10px] font-bold text-board-lime">
        {votes} votes{picked ? " · YOUR PICK" : ""}
      </div>
    </button>
  );
}
