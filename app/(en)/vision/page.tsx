import type { Metadata } from "next";
import { VisionPage } from "@/components/pages/VisionPage";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata("en", "vision", getDictionary("en").visionPage.statement.paragraphs[0]);

export default function Page() {
  return <VisionPage locale="en" />;
}
