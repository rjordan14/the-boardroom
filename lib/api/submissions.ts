import { listSubmissions as listMockSubmissions, type Submission } from "@/lib/mock/submissions";

export async function listSubmissions(): Promise<Submission[]> {
  return listMockSubmissions();
}
