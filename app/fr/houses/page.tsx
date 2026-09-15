import type { Metadata } from "next";
import { StubPage } from "@/components/StubPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata("fr", "houses");

export default function Page() {
  return <StubPage locale="fr" page="houses" />;
}
