import type { Metadata } from "next";
import { FranchisePage } from "@/components/pages/FranchisePage";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata("fr", "franchise", getDictionary("fr").franchisePage.hero.intro);

export default function Page() {
  return <FranchisePage locale="fr" />;
}
