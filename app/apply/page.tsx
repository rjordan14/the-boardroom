import { Header, BackLink } from "@/components/ui/Header";
import { ApplyForm } from "@/components/apply/ApplyForm";

export default function ApplyPage() {
  return (
    <div data-screen="apply">
      <Header left={<BackLink href="/" label="BACK TO LOBBY" />} />
      <ApplyForm />
    </div>
  );
}
