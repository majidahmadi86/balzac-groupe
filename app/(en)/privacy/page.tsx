import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/LegalPage";
import { privacyPolicy } from "@/lib/legal-content";
import { pageMetadata } from "@/lib/metadata";

const doc = privacyPolicy("en");

export const metadata: Metadata = pageMetadata("en", "privacy", doc.hero.intro);

export default function Page() {
  return <LegalPage locale="en" doc={doc} />;
}
