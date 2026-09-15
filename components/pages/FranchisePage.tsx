import { InquiryForm } from "@/components/forms/InquiryForm";
import { CtaLink } from "@/components/home/CtaLink";
import { Hero } from "@/components/home/Hero";
import { MotionScope } from "@/components/home/MotionScope";
import { Reveal } from "@/components/home/Reveal";
import { SplitBand } from "@/components/home/SplitBand";
import { getDictionary, type Locale } from "@/lib/i18n";
import { GROUP_EMAIL } from "@/lib/legal";
import { pathFor } from "@/lib/routes";

export function FranchisePage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const page = t.franchisePage;

  return (
    <MotionScope>
      <Hero
        compact
        label={page.hero.label}
        titleLines={[page.hero.title]}
        intro={page.hero.intro}
        // TEMP mockup crop, replace with client photography.
        image={{ src: "/images/temp/temp-franchise-globe.jpg", alt: page.hero.imageAlt, position: "object-[70%_50%] lg:object-center" }}
      />

      {/* Proposition */}
      <section aria-labelledby="proposition-title" className="bg-cream py-16 text-navy sm:py-20 lg:py-28">
        <div className="site-gutter grid gap-8 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <p className="label-caps tracking-caps-lg text-navy/80 lg:text-xs">{page.proposition.label}</p>
            <h2
              id="proposition-title"
              className="mt-4 text-balance font-display text-[2.25rem] font-semibold leading-[1.04] sm:text-[2.75rem] lg:mt-5 lg:text-[3.5rem]"
            >
              {t.home.franchise.title}
            </h2>
            <span aria-hidden="true" className="mt-7 block h-px w-14 bg-gold lg:mt-9" />
          </Reveal>
          <Reveal delay={120} className="lg:col-span-6 lg:col-start-7 lg:pt-10">
            <div className="space-y-5 text-[1.0625rem] leading-[1.65] text-navy/85 lg:text-[1.1875rem]">
              {page.proposition.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-pretty">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Concept */}
      <SplitBand
        id="concept"
        label={page.concept.label}
        title={t.home.houses.cafe.title}
        body={page.concept.paragraphs}
        bodyStyle="paragraphs"
        details={t.housesPage.cafe.details}
        imageSide="right"
        // TEMP mockup crop, replace with client photography.
        image={{ src: "/images/temp/temp-cafe.jpg", alt: t.home.houses.cafe.imageAlt }}
        cta={<CtaLink href={`${pathFor(locale, "franchise")}#form`}>{page.form.label}</CtaLink>}
      />

      {/* Partner profile */}
      <section aria-labelledby="profile-title" className="border-t border-navy/10 bg-cream-50 py-16 text-navy sm:py-20 lg:py-28">
        <div className="site-gutter">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="label-caps tracking-caps-lg text-navy/80 lg:text-xs">{page.profile.label}</p>
            <h2
              id="profile-title"
              className="mt-4 text-balance font-display text-[2rem] font-semibold leading-[1.08] sm:text-[2.5rem] lg:mt-5 lg:text-[3.25rem]"
            >
              {page.profile.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-[1.0625rem] leading-[1.5] text-navy/85 lg:mt-6 lg:text-[1.1875rem]">
              {page.profile.intro}
            </p>
          </Reveal>
          <ul className="mx-auto mt-12 grid max-w-6xl gap-x-10 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {page.profile.traits.map((trait, idx) => (
              <li key={trait.title}>
                <Reveal delay={idx * 90} className="border-t border-gold/60 pt-6">
                  <h3 className="font-display text-[1.5rem] font-semibold leading-[1.15] text-navy">{trait.title}</h3>
                  <p className="mt-3 text-pretty text-[1rem] leading-[1.6] text-navy/80">{trait.body}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Path to opening */}
      <section aria-labelledby="steps-title" className="bg-forest-900 py-16 text-cream sm:py-20 lg:py-28">
        <div className="site-gutter">
          <Reveal className="max-w-3xl">
            <p className="label-caps tracking-caps-lg text-gold-light lg:text-xs">{page.steps.label}</p>
            <h2
              id="steps-title"
              className="mt-4 text-balance font-display text-[2rem] font-semibold leading-[1.08] text-cream-50 sm:text-[2.5rem] lg:mt-5 lg:text-[3.25rem]"
            >
              {page.steps.title}
            </h2>
          </Reveal>
          <ol className="mt-12 grid gap-y-10 sm:grid-cols-2 sm:gap-x-10 lg:mt-16 lg:grid-cols-4">
            {page.steps.items.map((step, idx) => (
              <li key={step.title}>
                <Reveal delay={idx * 90} className="border-t border-cream/20 pt-6">
                  <span className="font-display text-[2.5rem] font-semibold leading-none text-gold-light">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-display text-[1.5rem] font-semibold leading-[1.15] text-cream-50">{step.title}</h3>
                  <p className="mt-3 text-pretty text-[1rem] leading-[1.6] text-cream/80">{step.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Interest form */}
      <section
        id="form"
        aria-labelledby="form-title"
        className="scroll-mt-[76px] bg-cream py-16 text-navy sm:py-20 lg:scroll-mt-[104px] lg:py-28"
      >
        <div className="site-gutter grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-4">
            <p className="label-caps tracking-caps-lg text-navy/80 lg:text-xs">{page.form.label}</p>
            <h2
              id="form-title"
              className="mt-4 text-balance font-display text-[2rem] font-semibold leading-[1.08] sm:text-[2.5rem] lg:mt-5 lg:text-[3rem]"
            >
              {page.form.title}
            </h2>
            <p className="mt-4 text-pretty text-[1.0625rem] leading-[1.6] text-navy/85 lg:mt-6">{page.form.intro}</p>
          </Reveal>
          <div className="lg:col-span-7 lg:col-start-6">
            <InquiryForm kind="franchise" locale={locale} groupEmail={GROUP_EMAIL} />
          </div>
        </div>
      </section>
    </MotionScope>
  );
}
