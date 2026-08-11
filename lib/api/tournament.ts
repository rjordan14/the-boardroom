import {
  getChampion as getChampionSync,
  getCurrentRoundLabel as getCurrentRoundLabelSync,
  type RoundName,
} from "@/lib/tournament/store";
import type { ProjectKey } from "@/lib/types";

/** Null once every round through Final has closed — nothing left to vote on. */
export async function getCurrentRoundLabel(): Promise<RoundName | null> {
  return getCurrentRoundLabelSync();
}

export async function getChampion(): Promise<ProjectKey | null> {
  return getChampionSync();
}

export type { RoundName };
