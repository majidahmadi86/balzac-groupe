import type { Metadata } from "next";
import type { ReactNode } from "react";
import { siteUrl } from "@/lib/metadata";
import "./globals.css";

// Pass-through root. The <html> element (and its lang) is rendered by
// app/(en)/layout.tsx and app/fr/layout.tsx so each tree gets the right language.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
