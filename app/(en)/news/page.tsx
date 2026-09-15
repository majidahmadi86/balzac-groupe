import type { Metadata } from "next";
import { StubPage } from "@/components/StubPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata("en", "news");

export default function Page() {
  return <StubPage locale="en" page="news" />;
}
