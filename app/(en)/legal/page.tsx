import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/LegalPage";
import { legalNotice } from "@/lib/legal-content";
import { pageMetadata } from "@/lib/metadata";

const doc = legalNotice("en");

export const metadata: Metadata = pageMetadata("en", "legal", doc.hero.intro);

export default function Page() {
  return <LegalPage locale="en" doc={doc} />;
}
