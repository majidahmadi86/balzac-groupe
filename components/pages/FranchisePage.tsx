import { InquiryForm } from "@/components/forms/InquiryForm";
import { CtaLink } from "@/components/home/CtaLink";
import { STOREFRONT_TEXT_ZONES } from "@/components/home/HomePage";
import { Hero } from "@/components/home/Hero";
import { MotionScope } from "@/components/home/MotionScope";
import { Reveal } from "@/components/home/Reveal";
import { SplitBand } from "@/components/home/SplitBand";
import { getDictionary, type Locale } from "@/lib/i18n";
import { pathFor } from "@/lib/routes";

export function FranchisePage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const page = t.franchisePage;

  return (
    <MotionScope>
      <Hero
        tight
        // A tight hero fills with type, so the scrim must hold from the label down.
        scrim="light"
        label={page.hero.label}
        titleLines={[page.hero.title]}
        // Below 1024px the whole shopfront reads and the type sits on navy under it: at phone width a
        // tight crop of this photograph is all signage, and any type over it would land on a sign.
        // From 1024px the hero shows the band between the awning and the window lettering, which
        // carries neither signage nor the figure, and the type sits over the olive tree.
        stackBelowLg="aspect-[1122/1402]"
        image={{
          src: "/images/balzacgroupe-storefront-welcome.jpg",
          alt: page.hero.imageAlt,
          position: "lg:object-[50%_34%]",
          textZones: STOREFRONT_TEXT_ZONES,
          zonesWidth: 1122,
        }}
      />

      {/* Proposition beside the interest form: the form's first field shows without scrolling from 1024px. */}
      <section
        id="form"
        aria-labelledby="proposition-title"
        className="scroll-mt-[76px] bg-cream pb-16 pt-8 text-navy sm:pb-20 sm:pt-10 lg:scroll-mt-[104px] lg:pb-24 lg:pt-12"
      >
        <div className="site-gutter grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div data-contrast="" className="lg:col-span-5 lg:pt-2">
            <p className="label-caps tracking-caps-lg text-navy lg:text-xs">{page.proposition.label}</p>
            <h2
              id="proposition-title"
              className="mt-3 text-balance font-display text-[2rem] font-semibold leading-[1.06] sm:text-[2.5rem] lg:mt-4 lg:text-[3rem]"
            >
              {t.home.franchise.title}
            </h2>
            <div className="mt-4 space-y-4 text-[1.0625rem] leading-[1.6] text-navy lg:mt-6 lg:text-[1.125rem]">
              <p className="text-pretty">{page.proposition.paragraphs[0]}</p>
              <p className="hidden text-pretty lg:block">{page.proposition.paragraphs[1]}</p>
              <p className="hidden text-pretty lg:block">{page.form.intro}</p>
            </div>
          </div>
          <div className="lg:col-span-7">
            <InquiryForm kind="franchise" locale={locale} label={page.form.label} />
          </div>
        </div>
      </section>

      {/* Concept */}
      <SplitBand
        id="concept"
        label={page.concept.label}
        title={page.concept.title}
        body={page.concept.paragraphs}
        bodyStyle="paragraphs"
        details={page.concept.details}
        imageSide="right"
        aspect="aspect-[3/4] sm:aspect-[4/5]"
        imagePosition="object-[50%_66%]"
        image={{ src: "/images/balzacgroupe-cafe-interior.jpg", alt: t.home.bands.cafe.imageAlt }}
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

    </MotionScope>
  );
}
