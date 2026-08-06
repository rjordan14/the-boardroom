import { FLOOR_QUESTIONS, type FloorQuestion } from "@/lib/mock/floor";

export async function listFloorPreview(): Promise<FloorQuestion[]> {
  return FLOOR_QUESTIONS;
}
