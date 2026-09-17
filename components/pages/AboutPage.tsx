import { CtaLink } from "@/components/home/CtaLink";
import { Hero } from "@/components/home/Hero";
import { MotionScope } from "@/components/home/MotionScope";
import { Reveal } from "@/components/home/Reveal";
import { SplitBand } from "@/components/home/SplitBand";
import { ANTIQUES_TEXT_ZONES, STOREFRONT_TEXT_ZONES } from "@/components/home/HomePage";
import { getDictionary, type Locale } from "@/lib/i18n";
import { pathFor, SHOW_IMMOBILIER } from "@/lib/routes";

const ANTIQUES_URL = "https://balzacantiques.ch";

export function AboutPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const page = t.aboutPage;
  const { cafe, antiques, immobilier } = page.chapters;

  return (
    <MotionScope>
      <Hero
        compact
        layout="split"
        label={page.hero.label}
        titleLines={[page.hero.title]}
        intro={page.hero.intro}
        // Busy interior with menus and signs: type beside the photo, focal point on the tables.
        image={{
          src: "/images/balzacgroupe-cafe-interior.jpg",
          alt: page.hero.imageAlt,
          position: "object-[50%_68%] lg:object-[50%_64%]",
        }}
      />

      {/* The group and who runs it. The page heading is the hero's, and the client's copy gives one
          title per block, so this block carries its label and no invented second heading. */}
      <section aria-label={page.identity.label} className="bg-cream py-16 text-navy sm:py-20 lg:py-28">
        <div className="site-gutter grid gap-8 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-4">
            <p className="label-caps tracking-caps-lg text-navy/80 lg:text-xs">{page.identity.label}</p>
            <span aria-hidden="true" className="mt-7 block h-px w-14 bg-gold lg:mt-9" />
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7 lg:col-start-6">
            <div className="space-y-5 text-[1.0625rem] leading-[1.65] text-navy/85 lg:text-[1.1875rem]">
              {page.identity.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-pretty">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* One chapter per activity. Old /houses#cafe, #antiques and #immobilier links land here. */}
      <SplitBand
        id="cafe"
        label={cafe.label}
        title={cafe.title}
        body={cafe.paragraphs}
        bodyStyle="paragraphs"
        imageSide="right"
        // The whole storefront, at its own 4:5. Nothing is laid over it here, so the signage reads
        // as part of the photograph; the homepage keeps the crop that excludes the upper band.
        aspect="aspect-[4/5]"
        image={{ src: "/images/balzacgroupe-hero.jpg", alt: cafe.imageAlt, textZones: STOREFRONT_TEXT_ZONES, zonesWidth: 1122 }}
      />

      <SplitBand
        id="antiques"
        label={antiques.label}
        title={antiques.title}
        body={antiques.paragraphs}
        bodyStyle="paragraphs"
        imageSide="left"
        aspect="aspect-[4/3]"
        image={{ src: "/images/balzacgroupe-antiques.jpg", alt: t.home.bands.antiques.imageAlt, textZones: ANTIQUES_TEXT_ZONES, zonesWidth: 1374 }}
        cta={
          <a
            href={ANTIQUES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="label-caps inline-flex min-h-[44px] items-center text-navy underline decoration-navy/30 underline-offset-[6px] transition-colors duration-300 hover:decoration-navy"
          >
            {antiques.link}
            <span className="sr-only"> {t.home.newTab}</span>
          </a>
        }
      />

      {SHOW_IMMOBILIER ? (
        <SplitBand
          id="immobilier"
          label={immobilier.label}
          title={immobilier.title}
          body={immobilier.paragraphs}
          bodyStyle="paragraphs"
          imageSide="right"
          aspect="aspect-[3/2]"
          imagePosition="object-[55%_50%]"
          image={{ src: "/images/balzacgroupe-immobilier.jpg", alt: t.home.bands.immobilier.imageAlt }}
        />
      ) : null}

      {/* How the group works, across all three activities */}
      <section
        id={SHOW_IMMOBILIER ? undefined : "immobilier"}
        aria-labelledby="approach-title"
        className="scroll-mt-[76px] border-t border-navy/10 bg-cream-50 py-16 text-navy sm:py-20 lg:scroll-mt-[104px] lg:py-28"
      >
        <div className="site-gutter grid gap-8 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <p className="label-caps tracking-caps-lg text-navy/80 lg:text-xs">{page.approach.label}</p>
            <h2
              id="approach-title"
              className="mt-4 text-balance font-display text-[2rem] font-semibold leading-[1.08] sm:text-[2.5rem] lg:mt-5 lg:text-[3.25rem]"
            >
              {page.approach.title}
            </h2>
            <span aria-hidden="true" className="mt-7 block h-px w-14 bg-gold lg:mt-9" />
          </Reveal>
          <Reveal delay={120} className="lg:col-span-6 lg:col-start-7 lg:pt-4">
            <div className="space-y-5 text-[1.0625rem] leading-[1.65] text-navy/85 lg:text-[1.1875rem]">
              {page.approach.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-pretty">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Closing on the vision */}
      <section aria-labelledby="about-closing-title" className="bg-forest-900 py-16 text-cream sm:py-20 lg:py-24">
        <Reveal className="site-gutter text-center">
          <p className="label-caps tracking-caps-lg text-gold-light lg:text-xs">{page.closing.label}</p>
          <h2
            id="about-closing-title"
            className="mt-4 text-balance font-display text-[2rem] font-semibold leading-[1.08] text-cream-50 sm:text-[2.5rem] lg:mt-5 lg:text-[3rem]"
          >
            {t.home.vision.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-[1.0625rem] leading-[1.5] text-cream/85 lg:mt-5 lg:text-[1.1875rem]">
            {t.home.vision.intro}
          </p>
          <div className="mt-8 lg:mt-10">
            <CtaLink href={pathFor(locale, "vision")} variant="cream">
              {page.closing.cta}
            </CtaLink>
          </div>
        </Reveal>
      </section>
    </MotionScope>
  );
}
