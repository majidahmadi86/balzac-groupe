import { getDictionary, type Locale, type PageKey } from "@/lib/i18n";
import { TitleBand } from "./TitleBand";

export function StubPage({ locale, page }: { locale: Locale; page: Exclude<PageKey, "home"> }) {
  const t = getDictionary(locale);
  const { eyebrow, title } = t.pages[page];

  return <TitleBand locale={locale} eyebrow={eyebrow} title={title} body={t.stub.placeholder} />;
}
