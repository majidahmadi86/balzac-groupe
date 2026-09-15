import type { Metadata } from "next";
import { HousesPage } from "@/components/pages/HousesPage";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata("en", "houses", getDictionary("en").housesPage.hero.intro);

export default function Page() {
  return <HousesPage locale="en" />;
}
