import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/LegalPage";
import { legalNotice } from "@/lib/legal-content";
import { pageMetadata } from "@/lib/metadata";

const doc = legalNotice("fr");

export const metadata: Metadata = pageMetadata("fr", "legal", doc.hero.intro);

export default function Page() {
  return <LegalPage locale="fr" doc={doc} />;
}
