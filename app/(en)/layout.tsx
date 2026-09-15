import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { LocaleDocument } from "@/components/LocaleDocument";
import { localeLayoutMetadata } from "@/lib/metadata";

export const metadata: Metadata = localeLayoutMetadata("en");

export const viewport: Viewport = {
  themeColor: "#f4f0e9",
};

export default function EnLayout({ children }: { children: ReactNode }) {
  return <LocaleDocument locale="en">{children}</LocaleDocument>;
}
