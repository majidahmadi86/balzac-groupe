import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { LocaleDocument } from "@/components/LocaleDocument";
import { localeLayoutMetadata } from "@/lib/metadata";

export const metadata: Metadata = localeLayoutMetadata("fr");

export const viewport: Viewport = {
  themeColor: "#f4f0e9",
};

export default function FrLayout({ children }: { children: ReactNode }) {
  return <LocaleDocument locale="fr">{children}</LocaleDocument>;
}
