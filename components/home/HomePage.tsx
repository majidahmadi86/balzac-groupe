import { getDictionary, type Locale } from "@/lib/i18n";
import { pathFor } from "@/lib/routes";
import { CtaLink } from "./CtaLink";
import { Hero } from "./Hero";
import { MotionScope } from "./MotionScope";
import { SplitBand } from "./SplitBand";
import { Vision } from "./Vision";

const ANTIQUES_URL = "https://balzacantiques.ch";

export function HomePage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const { cafe, antiques, immobilier } = t.home.houses;
  const franchise = t.home.franchise;
  const houses = pathFor(locale, "houses");

  return (
    <MotionScope>
      <Hero
        titleLines={t.motto.split(", ").map((line, idx, all) => (idx < all.length - 1 ? `${line},` : line))}
        tagline={t.tagline}
        // TEMP mockup crop, replace with client photography.
        image={{
          src: "/images/temp/temp-hero-storefront.jpg",
          alt: t.home.hero.imageAlt,
          position: "object-[56%_50%] lg:object-[50%_12%]",
        }}
        cta={
          <CtaLink href={pathFor(locale, "vision")} variant="hero">
            {t.home.hero.cta}
          </CtaLink>
        }
      />

      <SplitBand
        id="cafe"
        label={cafe.label}
        title={cafe.title}
        body={cafe.body}
        imageSide="right"
        // TEMP mockup crop, replace with client photography.
        image={{ src: "/images/temp/temp-cafe.jpg", alt: cafe.imageAlt }}
        cta={<CtaLink href={`${houses}#cafe`}>{cafe.cta}</CtaLink>}
      />

      <SplitBand
        id="antiques"
        label={antiques.label}
        title={antiques.title}
        body={antiques.body}
        imageSide="left"
        aspect="aspect-[3/2]"
        // TEMP mockup crop, replace with client photography.
        image={{ src: "/images/temp/temp-antiques.jpg", alt: antiques.imageAlt }}
        cta={
          <CtaLink href={ANTIQUES_URL} external newTabLabel={t.home.newTab}>
            {antiques.cta}
          </CtaLink>
        }
      />

      <SplitBand
        id="immobilier"
        label={immobilier.label}
        title={immobilier.title}
        body={immobilier.body}
        imageSide="right"
        aspect="aspect-[4/3]"
        imagePosition="object-[50%_30%]"
        // TEMP mockup crop, replace with client photography.
        image={{ src: "/images/temp/temp-immobilier.jpg", alt: immobilier.imageAlt }}
        cta={<CtaLink href={`${houses}#immobilier`}>{immobilier.cta}</CtaLink>}
      />

      <SplitBand
        id="franchise"
        tone="forest"
        label={franchise.label}
        title={franchise.title}
        body={franchise.body}
        imageSide="right"
        compact
        aspect="aspect-[16/10]"
        imagePosition="object-right"
        // TEMP mockup crop, replace with client photography.
        image={{ src: "/images/temp/temp-franchise-globe.jpg", alt: franchise.imageAlt }}
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
