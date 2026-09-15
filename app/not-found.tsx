import type { Metadata } from "next";
import { LocaleDocument } from "@/components/LocaleDocument";
import { TitleBand } from "@/components/TitleBand";
import { getDictionary } from "@/lib/i18n";

const t = getDictionary("en");

export const metadata: Metadata = {
  title: `${t.notFound.title} · ${t.siteName}`,
  robots: { index: false },
};

export default function NotFound() {
  return (
    <LocaleDocument locale="en">
      <TitleBand locale="en" eyebrow={t.notFound.eyebrow} title={t.notFound.title} body={t.notFound.body} />
    </LocaleDocument>
  );
}
