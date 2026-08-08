import { getCommentsForProject as getMockCommentsForProject, listAllComments as listMockAllComments } from "@/lib/mock/comments";
import type { Comment } from "@/lib/types";

export async function getCommentsForProject(projectKey: string): Promise<Comment[]> {
  return getMockCommentsForProject(projectKey);
}

export async function listAllComments(): Promise<Comment[]> {
  return listMockAllComments();
}
