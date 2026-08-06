import { getProject as getMockProject, listProjects as listMockProjects } from "@/lib/mock/projects";
import type { Project } from "@/lib/types";

/**
 * Typed data-access layer. Mock-backed today; swapping in a real
 * indexer later means changing these implementations, not call sites.
 */
export async function getProject(key: string): Promise<Project | undefined> {
  return getMockProject(key);
}

export async function listProjects(): Promise<Project[]> {
  return listMockProjects();
}
