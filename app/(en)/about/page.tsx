import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/AboutPage";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata("en", "about", getDictionary("en").aboutPage.hero.intro);

export default function Page() {
  return <AboutPage locale="en" />;
}
