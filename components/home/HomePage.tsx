import { getDictionary, type Locale } from "@/lib/i18n";
import { pathFor, SHOW_IMMOBILIER } from "@/lib/routes";
import { CtaLink } from "./CtaLink";
import { Reveal } from "./Reveal";
import { StorefrontHero } from "./StorefrontHero";
import { MotionScope } from "./MotionScope";
import { SplitBand } from "./SplitBand";
import { Vision } from "./Vision";

const ANTIQUES_URL = "https://balzacantiques.ch";

/** Signage in the full storefront photograph (1122x1402): the two BALZAC bands, the window
 * lettering, the door plaque, the terrace sign and the A-board. The homepage hero uses a crop of the
 * same photograph starting 246px lower, and declares the same zones shifted by that much. */
export const STOREFRONT_TEXT_ZONES = "30,95,1105,235;110,280,1080,385;345,630,695,695;395,785,560,825;760,660,930,805;390,925,605,970;850,1010,1115,1360";

/** Titles printed in the Antiques photograph (book covers, trunk plate), in its own 1374px pixels. */
export const ANTIQUES_TEXT_ZONES = "70,470,480,860;735,985,1335,1145;1150,800,1295,840";

export function HomePage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const { cafe, antiques, immobilier } = t.home.bands;
  const franchise = t.home.franchise;
  const about = pathFor(locale, "about");
  // With two houses, Café and Antiques carry the page as taller feature bands.
  const houseBandSize = SHOW_IMMOBILIER ? "default" : "feature";

  return (
    <MotionScope>
      <StorefrontHero
        titleLines={t.motto.split(", ").map((line, idx, all) => (idx < all.length - 1 ? `${line},` : line))}
        tagline={t.tagline}
        imageAlt={t.home.hero.imageAlt}
        cta={
          <CtaLink href={pathFor(locale, "vision")} variant="hero">
            {t.home.hero.cta}
          </CtaLink>
        }
      />

      {/* The group's three activities, introduced once and then taken one band at a time */}
      <section aria-labelledby="activities-title" className="bg-cream pb-2 pt-16 text-navy sm:pb-4 sm:pt-20 lg:pb-6 lg:pt-24">
        <Reveal className="site-gutter mx-auto max-w-4xl text-center">
          <p className="label-caps tracking-caps-lg text-navy/80 lg:text-xs">{t.home.activities.label}</p>
          <h2
            id="activities-title"
            className="mt-4 text-balance font-display text-[1.875rem] font-semibold leading-[1.12] sm:text-[2.25rem] lg:mt-5 lg:text-[2.75rem]"
          >
            {t.home.activities.title}
          </h2>
          <span aria-hidden="true" className="mx-auto mt-8 block h-px w-14 bg-gold lg:mt-10" />
        </Reveal>
      </section>

      <SplitBand
        id="cafe"
        label={cafe.field}
        title={cafe.title}
        body={cafe.body}
        imageSide="right"
        size={houseBandSize}
        aspect="aspect-[3/4] sm:aspect-[4/5]"
        // The photograph is portrait (2:3). A band pinned at 36rem cropped it to 54% of its height at
        // 1440 and 40% at 1920, so on desktop its column keeps a 4:5 box and the band grows with it.
        // From 1536px the box stops growing at 60rem tall rather than outgrowing the screen, while still
        // filling its column's width (a max-height on the aspect box would narrow it and open a gap).
        desktopAspect="md:aspect-[4/5] 2xl:aspect-auto 2xl:h-[60rem]"
        imagePosition="object-[50%_66%] md:object-[50%_45%]"
        image={{ src: "/images/balzacgroupe-cafe-interior.jpg", alt: cafe.imageAlt }}
        cta={<CtaLink href={`${about}#cafe`}>{cafe.cta}</CtaLink>}
      />

      <SplitBand
        id="antiques"
        label={antiques.field}
        title={antiques.title}
        body={antiques.body}
        imageSide="left"
        size={houseBandSize}
        // Close to the source crop (1374x1145), so the table of objects is never cut.
        aspect="aspect-[4/3]"
        image={{ src: "/images/balzacgroupe-antiques.jpg", alt: antiques.imageAlt, textZones: ANTIQUES_TEXT_ZONES, zonesWidth: 1374 }}
        cta={
          <CtaLink href={ANTIQUES_URL} external newTabLabel={t.home.newTab}>
            {antiques.cta}
          </CtaLink>
        }
      />

      {SHOW_IMMOBILIER && (
        <SplitBand
          id="immobilier"
          label={immobilier.field}
          title={immobilier.title}
          body={immobilier.body}
          imageSide="right"
          // The source is 3:2; keeping it holds the house, the firs and the sunset together.
          aspect="aspect-[3/2]"
          imagePosition="object-[55%_50%]"
          image={{ src: "/images/balzacgroupe-immobilier.jpg", alt: immobilier.imageAlt }}
          cta={<CtaLink href={`${about}#immobilier`}>{immobilier.cta}</CtaLink>}
        />
      )}

      <SplitBand
        id="franchise"
        tone="forest"
        label={franchise.label}
        title={franchise.title}
        body={franchise.body}
        // Image sides keep alternating whether or not the Immobilier band is shown.
        imageSide={SHOW_IMMOBILIER ? "left" : "right"}
        size="compact"
        // The house itself, at the photograph's own 4:5, with the terrace and the person in frame.
        aspect="aspect-[4/5]"
        imagePosition="object-[42%_58%]"
        image={{
          src: "/images/balzacgroupe-storefront-welcome.jpg",
          alt: franchise.imageAlt,
          textZones: STOREFRONT_TEXT_ZONES,
          zonesWidth: 1122,
        }}
        cta={
          <CtaLink href={pathFor(locale, "franchise")} variant="cream">
            {franchise.cta}
          </CtaLink>
        }
      />

      <Vision locale={locale} />
    </MotionScope>
  );
}
