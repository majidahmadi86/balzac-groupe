import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/ContactPage";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata("en", "contact", getDictionary("en").contactPage.hero.intro);

export default function Page() {
  return <ContactPage locale="en" />;
}
