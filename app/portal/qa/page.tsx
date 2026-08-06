import { getQaForProject } from "@/lib/api/qa";
import { PortalQaTab } from "@/components/portal/PortalQaTab";

export default async function PortalQaPage() {
  const qa = await getQaForProject("A");
  return <PortalQaTab qa={qa} />;
}
