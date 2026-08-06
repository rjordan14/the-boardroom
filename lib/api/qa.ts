import { getQaForProject as getMockQaForProject, listAllQa as listMockAllQa } from "@/lib/mock/qa";
import type { QaItem } from "@/lib/types";

export async function getQaForProject(projectKey: string): Promise<QaItem[]> {
  return getMockQaForProject(projectKey);
}

export async function listAllQa(): Promise<QaItem[]> {
  return listMockAllQa();
}
