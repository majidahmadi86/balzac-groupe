import { getDictionary, type Locale } from "@/lib/i18n";
import { Plaque } from "./Plaque";

// Temporary home. The editorial homepage lands in Commit 2.
export function HomePlaceholder({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="flex flex-1 items-center">
      <div className="site-gutter flex flex-col items-center py-24 text-center lg:py-32">
        <Plaque className="block h-auto w-[260px] sm:w-[320px] lg:w-[380px]" label={t.siteName} />
        <h1 className="mt-12 font-display text-[2.5rem] font-semibold leading-[1.05] text-navy sm:text-5xl lg:text-6xl">
          {t.motto}
        </h1>
        <span aria-hidden="true" className="mt-8 block h-px w-14 bg-gold" />
        <p className="label-caps mt-8 tracking-caps-lg text-navy/80">{t.tagline}</p>
      </div>
    </section>
  );
}
