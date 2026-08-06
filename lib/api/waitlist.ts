import { listWaitlist as listMockWaitlist, type WaitlistApplicant } from "@/lib/mock/waitlist";

export async function listWaitlist(): Promise<WaitlistApplicant[]> {
  return listMockWaitlist();
}
