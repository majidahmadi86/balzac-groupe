import { CtaLink } from "@/components/home/CtaLink";
import { Hero } from "@/components/home/Hero";
import { MotionScope } from "@/components/home/MotionScope";
import { SplitBand } from "@/components/home/SplitBand";
import { getDictionary, type Locale } from "@/lib/i18n";
import { pathFor } from "@/lib/routes";

const ANTIQUES_URL = "https://balzacantiques.ch";

export function HousesPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const page = t.housesPage;
  const { cafe, antiques, immobilier } = t.home.houses;
  const contact = pathFor(locale, "contact");

  return (
    <MotionScope>
      <Hero
        compact
        label={page.hero.label}
        titleLines={[page.hero.title]}
        intro={page.hero.intro}
        // TEMP mockup crop, replace with client photography.
        image={{ src: "/images/temp/temp-houses-triptych.jpg", alt: page.hero.imageAlt, position: "object-center" }}
      />

      <SplitBand
        id="cafe"
        label={cafe.label}
        title={cafe.title}
        body={page.cafe.paragraphs}
        bodyStyle="paragraphs"
        details={page.cafe.details}
        imageSide="right"
        // TEMP mockup crop, replace with client photography.
        image={{ src: "/images/temp/temp-cafe.jpg", alt: cafe.imageAlt }}
        cta={<CtaLink href={contact}>{page.contactCta}</CtaLink>}
      />

      <SplitBand
        id="antiques"
        label={antiques.label}
        title={antiques.title}
        body={page.antiques.paragraphs}
        bodyStyle="paragraphs"
        details={page.antiques.details}
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
        body={page.immobilier.paragraphs}
        bodyStyle="paragraphs"
        details={page.immobilier.details}
        imageSide="right"
        aspect="aspect-[4/3]"
        imagePosition="object-[50%_30%]"
        // TEMP mockup crop, replace with client photography.
        image={{ src: "/images/temp/temp-immobilier.jpg", alt: immobilier.imageAlt }}
        cta={<CtaLink href={contact}>{page.contactCta}</CtaLink>}
      />
    </MotionScope>
  );
}
