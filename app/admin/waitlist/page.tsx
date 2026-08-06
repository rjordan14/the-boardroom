import { listWaitlist } from "@/lib/api/waitlist";
import { WaitlistTab } from "@/components/admin/WaitlistTab";

export default async function AdminWaitlistPage() {
  const applicants = await listWaitlist();
  return <WaitlistTab applicants={applicants} />;
}
