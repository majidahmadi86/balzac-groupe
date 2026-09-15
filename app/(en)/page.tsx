import type { Metadata } from "next";
import { HomePlaceholder } from "@/components/HomePlaceholder";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata("en", "home");

export default function Page() {
  return <HomePlaceholder locale="en" />;
}
