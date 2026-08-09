import { listSubmissions as listMockSubmissions, type Submission } from "@/lib/mock/submissions";
import { listReadyPitchUploads } from "@/lib/video/store";
import { formatClock, formatRelativeTime } from "@/lib/utils/format";
import type { ProjectKey } from "@/lib/types";

export async function listSubmissions(): Promise<Submission[]> {
  const real: Submission[] = listReadyPitchUploads().map((u) => ({
    id: u.uploadId,
    projectKey: u.projectKey as ProjectKey,
    when: formatRelativeTime(u.readyAt),
    length: formatClock(u.durationSeconds),
    assetId: u.assetId,
    playbackId: u.playbackId,
  }));
  // Real uploads first — a founder's fresh submission shouldn't get
  // buried under the season's seed data.
  return [...real, ...listMockSubmissions()];
}
