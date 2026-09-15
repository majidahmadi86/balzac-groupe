import Link from "next/link";
import { getDictionary, type Locale } from "@/lib/i18n";
import { pathFor } from "@/lib/routes";

type TitleBandProps = {
  locale: Locale;
  eyebrow: string;
  title: string;
  body: string;
};

// Small-caps title band shared by routed stubs and the 404 page.
export function TitleBand({ locale, eyebrow, title, body }: TitleBandProps) {
  const t = getDictionary(locale);

  return (
    <section className="flex flex-1 items-center border-b border-navy/10">
      <div className="site-gutter py-20 text-center sm:py-24 lg:py-32">
        <p className="label-caps tracking-caps-lg text-forest">{eyebrow}</p>
        <h1 className="mx-auto mt-6 max-w-3xl font-display text-[2.75rem] font-semibold leading-[1.02] text-navy sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        <span aria-hidden="true" className="mx-auto mt-8 block h-px w-14 bg-gold" />
        <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-navy/75">{body}</p>
        <Link
          href={pathFor(locale, "home")}
          className="label-caps mt-8 inline-flex min-h-[44px] items-center text-navy underline decoration-navy/30 underline-offset-[6px] transition-colors duration-300 hover:decoration-navy"
        >
          {t.stub.back}
        </Link>
      </div>
    </section>
  );
}
