import Image from "next/image";
import { getDictionary, type Locale } from "@/lib/i18n";
import { pathFor } from "@/lib/routes";
import { CtaLink } from "./CtaLink";

export function Hero({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const lines = t.motto.split(", ");

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-navy-950 text-cream">
      <div className="relative h-[calc(100svh-76px)] min-h-[32rem] lg:h-[85vh] lg:min-h-[40rem] lg:max-h-[64rem]">
        {/* TEMP mockup crop, replace with client photography. */}
        <Image
          src="/images/temp/temp-hero-storefront.jpg"
          alt={t.home.hero.imageAlt}
          fill
          priority
          sizes="100vw"
          className="hero-settle object-cover object-[56%_50%] lg:object-[50%_12%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/45 to-navy-950/10 lg:bg-gradient-to-r lg:from-navy-950/85 lg:via-navy-950/45 lg:to-navy-950/0"
        />

        <div className="site-gutter relative flex h-full flex-col justify-end pb-14 sm:pb-20 lg:justify-center lg:pb-0">
          <div className="max-w-2xl">
            <h1
              id="hero-title"
              className="rise-in font-display text-[clamp(2.6rem,13vw,4.5rem)] font-semibold leading-[0.98] text-cream-50 lg:text-[5.5rem] xl:text-[6.25rem]"
            >
              {lines.map((line, idx) => (
                <span key={line} className="block">
                  {idx < lines.length - 1 ? `${line},` : line}
                </span>
              ))}
            </h1>
            <span
              aria-hidden="true"
              style={{ animationDelay: "180ms" }}
              className="rise-in mt-7 block h-px w-14 bg-cream/80 lg:mt-9"
            />
            <p
              style={{ animationDelay: "260ms" }}
              className="rise-in label-caps mt-6 text-[clamp(0.625rem,2.8vw,0.75rem)] tracking-caps-sm text-cream sm:tracking-caps-lg lg:mt-8"
            >
              {t.tagline}
            </p>
            <div style={{ animationDelay: "380ms" }} className="rise-in mt-8 lg:mt-10">
              <CtaLink href={pathFor(locale, "vision")} variant="hero">
                {t.home.hero.cta}
              </CtaLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
