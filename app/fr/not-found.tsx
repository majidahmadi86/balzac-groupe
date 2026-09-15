import { TitleBand } from "@/components/TitleBand";
import { getDictionary } from "@/lib/i18n";

export default function NotFound() {
  const t = getDictionary("fr");
  return <TitleBand locale="fr" eyebrow={t.notFound.eyebrow} title={t.notFound.title} body={t.notFound.body} />;
}
