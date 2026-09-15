import Link from "next/link";
import { CtaLink } from "@/components/home/CtaLink";
import { Hero } from "@/components/home/Hero";
import { MotionScope } from "@/components/home/MotionScope";
import { Reveal } from "@/components/home/Reveal";
import { pillarIcons, pillarOrder } from "@/components/home/Vision";
import { getDictionary, type Locale } from "@/lib/i18n";
import { pathFor } from "@/lib/routes";

export function VisionPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const page = t.visionPage;
  const home = t.home.vision;

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

      {/* Anchor statement */}
      <section aria-labelledby="statement-title" className="bg-cream py-16 text-navy sm:py-20 lg:py-28">
        <div className="site-gutter grid gap-8 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <p className="label-caps tracking-caps-lg text-navy/80 lg:text-xs">{page.statement.label}</p>
            <h2
              id="statement-title"
              className="mt-4 text-balance font-display text-[2.25rem] font-semibold leading-[1.04] sm:text-[2.75rem] lg:mt-5 lg:text-[3.5rem] xl:text-[4rem]"
            >
              {home.title}
            </h2>
            <span aria-hidden="true" className="mt-7 block h-px w-14 bg-gold lg:mt-9" />
          </Reveal>
          <Reveal delay={120} className="lg:col-span-6 lg:col-start-7 lg:pt-10">
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

      {/* The four pillars, fuller than the homepage row */}
      <section aria-labelledby="pillars-title" className="border-t border-navy/10 bg-cream py-16 text-navy sm:py-20 lg:py-28">
        <div className="site-gutter">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="label-caps tracking-caps-lg text-navy/80 lg:text-xs">{page.pillars.label}</p>
            <h2
              id="pillars-title"
              className="mt-4 text-balance font-display text-[2rem] font-semibold leading-[1.08] sm:text-[2.5rem] lg:mt-5 lg:text-[3.25rem]"
            >
              {page.pillars.title}
            </h2>
          </Reveal>

          <ul data-contrast="" className="mx-auto mt-12 grid max-w-6xl sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {pillarOrder.map((key, idx) => {
              const pillar = home.pillars[key];
              const borders = [
                idx > 0 ? "border-t sm:border-t-0" : "",
                idx % 2 === 1 ? "sm:border-l" : "",
                idx >= 2 ? "sm:border-t lg:border-t-0" : "",
                idx === 2 ? "lg:border-l" : "",
              ].join(" ");
              return (
                <li key={key} className={`border-navy/15 px-2 py-10 text-center sm:px-6 lg:px-7 lg:py-4 ${borders}`}>
                  <Reveal delay={idx * 90}>
                    <span className="block text-navy">{pillarIcons[key]}</span>
                    <h3 className="label-caps mt-6 tracking-caps-lg text-navy lg:text-xs">{pillar.title}</h3>
                    <p className="mt-4 font-display text-[1.375rem] italic leading-[1.2] text-navy">
                      {pillar.caption.join(" ")}
                    </p>
                    <p className="mx-auto mt-4 max-w-xs text-pretty text-[1rem] leading-[1.6] text-navy/80">
                      {page.pillars.body[key]}
                    </p>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Quiet closing band */}
      <section aria-labelledby="closing-title" className="border-t border-navy/10 bg-cream-50 py-16 text-navy sm:py-20 lg:py-24">
        <Reveal className="site-gutter text-center">
          <p className="label-caps tracking-caps-lg text-navy/80 lg:text-xs">{page.closing.label}</p>
          <h2
            id="closing-title"
            className="mt-4 text-balance font-display text-[2rem] font-semibold leading-[1.08] sm:text-[2.5rem] lg:mt-5 lg:text-[3rem]"
          >
            {page.closing.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-[1.0625rem] leading-[1.5] text-navy/85 lg:mt-5 lg:text-[1.1875rem]">
            {page.closing.body}
          </p>
          <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10 lg:mt-10">
            <CtaLink href={pathFor(locale, "franchise")}>{page.closing.franchiseCta}</CtaLink>
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
