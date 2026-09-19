import { InquiryForm } from "@/components/forms/InquiryForm";
import { CtaLink } from "@/components/home/CtaLink";
import { STOREFRONT_TEXT_ZONES, WELCOME_FIGURE_ZONES } from "@/components/home/HomePage";
import { Hero } from "@/components/home/Hero";
import { MotionScope } from "@/components/home/MotionScope";
import { Reveal } from "@/components/home/Reveal";
import { SplitBand } from "@/components/home/SplitBand";
import { getDictionary, type Locale } from "@/lib/i18n";
import { pathFor } from "@/lib/routes";

/**
 * Where the split hero's frame starts in the storefront-welcome photograph (1122x1402), as object-position.
 * The hero's height follows the window, so the visible slice of the photo changes shape with it, and no
 * single percentage keeps the signs whole: somewhere in between it always cuts the awning lettering
 * (source y 288 to 358). The start y is chosen by how much of the photo can show above its bottom edge:
 * - 370 or more: from y 370, awning out, or lower when the window is short, so the A-board heading
 *   (down to y 1085) stays in: max(370, 1100 - visible height);
 * - 235 to 370: from y 284 or the bottom edge, below the upper sign band and above the awning;
 * - under 235: from y 95 or less, the upper sign band whole with the rest.
 * The jumps between those are clamp() steps saturated by a factor of 1000. Lengths are source pixels
 * times 50vw/1122, the column width; in object-position, -100% is the room left above the photo's
 * bottom edge. The responsive gate resolves this in the browser and checks every zone at every width.
 */
const WELCOME_SPLIT_POSITION =
  "lg:object-[50%_calc(-1_*_max(0px,_min(max(min(-100%,_12.66vw)_+_clamp(0px,_(-100%_-_16.49vw)_*_1000,_3.83vw)_-_clamp(0px,_(10.47vw_+_100%)_*_1000,_6.24vw),_-100%_-_13.46vw),_-100%)))]";

export function FranchisePage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const page = t.franchisePage;

  return (
    <MotionScope>
      <Hero
        compact
        layout="split"
        splitHeight="lg:h-[55vh] lg:min-h-[28rem] lg:max-h-[40rem] 2xl:h-[59vh] 2xl:max-h-[52rem]"
        label={page.hero.label}
        titleLines={[page.hero.title]}
        // The type sits on navy beside the photograph, never on it. A portrait storefront covered in signage
        // with a visitor at its heart left no clear band for type over it: at 1024px the gap between the
        // awning and her head is shorter than any hero, and at 1920 the band was a sliver. Split, the photo
        // shows the whole storefront and her head to toe at every width.
        // From 1536px it is taller (59vh, so the form still starts in a 768px-tall window). From 1024px
        // the frame is placed by WELCOME_SPLIT_POSITION.
        image={{
          src: "/images/balzacgroupe-storefront-welcome.jpg",
          alt: page.hero.imageAlt,
          position: `object-[50%_88%] ${WELCOME_SPLIT_POSITION}`,
          textZones: STOREFRONT_TEXT_ZONES,
          subjectZones: WELCOME_FIGURE_ZONES,
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
        // Stacked until 1280px: a half-width column there is narrower than the BALZAC CAFÉ sign, so any
        // crop would slice it. Stacked, the photograph shows whole under the text.
        splitFrom="xl"
        imageSide="right"
        // Landscape (1322x809): the crop starts at x=620 of the client's file, which carried an English
        // headline set into the image. The sign is declared so no HTML text is ever laid on it.
        aspect="aspect-[16/10]"
        imagePosition="object-[56%_50%]"
        image={{
          src: "/images/balzacgroupe-cafe-night.jpg",
          alt: page.concept.imageAlt,
          textZones: "415,100,1000,205",
          zonesWidth: 1322,
        }}
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
