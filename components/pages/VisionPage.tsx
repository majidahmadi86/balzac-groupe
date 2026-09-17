import Link from "next/link";
import { CtaLink } from "@/components/home/CtaLink";
import { Hero } from "@/components/home/Hero";
import { MotionScope } from "@/components/home/MotionScope";
import { Reveal } from "@/components/home/Reveal";
import { getDictionary, type Locale } from "@/lib/i18n";
import { pathFor } from "@/lib/routes";

const FIELD_ORDER = ["hospitality", "heritage", "realEstate"] as const;

export function VisionPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const page = t.visionPage;

  return (
    <MotionScope>
      <Hero
        compact
        label={page.hero.label}
        titleLines={[page.hero.title]}
        intro={page.hero.intro}
        scrim="light"
        // TEMP mockup crop, replace with client photography.
        image={{
          src: "/images/temp/temp-vision-interior.jpg",
          alt: page.hero.imageAlt,
          position: "object-[18%_50%] lg:object-[50%_60%]",
        }}
      />

      {/* What the three activities share. The page heading is the hero's, so no second one is invented here. */}
      <section aria-label={page.statement.label} className="bg-cream py-14 text-navy sm:py-16 lg:py-20">
        <div className="site-gutter grid gap-8 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-4">
            <p className="label-caps tracking-caps-lg text-navy/80 lg:text-xs">{page.statement.label}</p>
            <span aria-hidden="true" className="mt-7 block h-px w-14 bg-gold lg:mt-9" />
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7 lg:col-start-6">
            <div className="space-y-5 text-[1.0625rem] leading-[1.65] text-navy/85 lg:text-[1.1875rem]">
              {page.statement.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-pretty">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* One block per field, in the same two-column rhythm as the rest of the page */}
      {FIELD_ORDER.map((key, idx) => {
        const field = page.fields[key];
        const id = key === "realEstate" ? "real-estate" : key;
        return (
          <section
            key={key}
            id={id}
            aria-labelledby={`${id}-title`}
            className={`scroll-mt-[76px] border-t border-navy/10 py-14 text-navy sm:py-16 lg:scroll-mt-[104px] lg:py-20 ${
              idx % 2 === 0 ? "bg-cream-50" : "bg-cream"
            }`}
          >
            <div className="site-gutter grid gap-8 lg:grid-cols-12 lg:gap-12">
              <Reveal className="lg:col-span-5">
                <p className="label-caps tracking-caps-lg text-navy/80 lg:text-xs">{field.label}</p>
                <h2
                  id={`${id}-title`}
                  className="mt-4 text-balance font-display text-[1.875rem] font-semibold leading-[1.08] sm:text-[2.25rem] lg:mt-5 lg:text-[2.75rem]"
                >
                  {field.title}
                </h2>
                <span aria-hidden="true" className="mt-7 block h-px w-14 bg-gold lg:mt-9" />
              </Reveal>
              <Reveal delay={120} className="lg:col-span-6 lg:col-start-7 lg:pt-4">
                <div className="space-y-5 text-[1.0625rem] leading-[1.65] text-navy/85 lg:text-[1.1875rem]">
                  {field.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-pretty">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
        );
      })}

      {/* Our horizons: the longest block on the site, so it runs as a single measured column */}
      <section aria-labelledby="horizons-title" className="bg-forest-900 py-16 text-cream sm:py-20 lg:py-28">
        <div className="site-gutter">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="label-caps tracking-caps-lg text-gold-light lg:text-xs">{page.horizons.label}</p>
            <h2
              id="horizons-title"
              className="mt-4 text-balance font-display text-[2rem] font-semibold leading-[1.08] text-cream-50 sm:text-[2.5rem] lg:mt-5 lg:text-[3.25rem]"
            >
              {page.horizons.title}
            </h2>
            <span aria-hidden="true" className="mx-auto mt-8 block h-px w-14 bg-gold-light/70 lg:mt-10" />
          </Reveal>
          <Reveal delay={120} className="mx-auto mt-10 max-w-2xl lg:mt-12">
            <div data-contrast="" className="space-y-5 text-[1.0625rem] leading-[1.7] text-cream/90 lg:text-[1.1875rem]">
              {page.horizons.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-pretty">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* The standard held across the three activities */}
      <section aria-labelledby="commitment-title" className="bg-cream py-16 text-navy sm:py-20 lg:py-24">
        <div className="site-gutter grid gap-8 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <p className="label-caps tracking-caps-lg text-navy/80 lg:text-xs">{page.commitment.label}</p>
            <h2
              id="commitment-title"
              className="mt-4 text-balance font-display text-[2rem] font-semibold leading-[1.08] sm:text-[2.5rem] lg:mt-5 lg:text-[3rem]"
            >
              {page.commitment.title}
            </h2>
            <span aria-hidden="true" className="mt-7 block h-px w-14 bg-gold lg:mt-9" />
          </Reveal>
          <Reveal delay={120} className="lg:col-span-6 lg:col-start-7 lg:pt-4">
            <div className="space-y-5 text-[1.0625rem] leading-[1.65] text-navy/85 lg:text-[1.1875rem]">
              {page.commitment.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-pretty">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Quiet closing band */}
      <section aria-labelledby="closing-title" className="border-t border-navy/10 bg-cream-50 py-16 text-navy sm:py-20 lg:py-24">
        <Reveal className="site-gutter text-center">
          <h2
            id="closing-title"
            className="text-balance font-display text-[2rem] font-semibold leading-[1.08] sm:text-[2.5rem] lg:text-[3rem]"
          >
            {page.closing.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-[1.0625rem] leading-[1.5] text-navy/85 lg:mt-5 lg:text-[1.1875rem]">
            {page.closing.body}
          </p>
          <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10 lg:mt-10">
            <CtaLink href={pathFor(locale, "about")}>{page.closing.activitiesCta}</CtaLink>
            <Link
              href={pathFor(locale, "contact")}
              className="label-caps inline-flex min-h-[44px] items-center text-navy underline decoration-navy/30 underline-offset-[6px] transition-colors duration-300 hover:decoration-navy"
            >
              {page.closing.contactCta}
            </Link>
          </div>
        </Reveal>
      </section>
    </MotionScope>
  );
}
