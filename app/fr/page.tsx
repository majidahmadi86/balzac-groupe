import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata("fr", "home");

export default function Page() {
  return <HomePage locale="fr" />;
}
