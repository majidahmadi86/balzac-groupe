import Image from "next/image";
import type { ReactNode } from "react";
import { HERO_IMAGE_QUALITY } from "./Hero";

type StorefrontHeroProps = {
  titleLines: string[];
  tagline: string;
  imageAlt: string;
  cta: ReactNode;
};

/**
 * Homepage hero: one full-bleed storefront photo with the type laid over it (docs/mockup-Mobile.jpg).
 *
 * The photo file is a crop of the client storefront that starts below the upper Thai/BALZAC band,
 * so only the awning reads BALZAC. Its baked-in signage is declared in `data-text-zones` (pixels of
 * the 1122x1156 file) and the responsive gate fails if any HTML text lands on one, at any width.
 *
 * Two framings, both art-directed against those zones:
 * - below 1024px the photo fits the height and anchors left (olive tree, window, terrace), type bottom-left;
 * - from 1024px it fits the width and anchors to the awning, and the type is pinned in vw to the olive
 *   tree column: headline between the awning and the window lettering, tagline and CTA below it.
 */
export function StorefrontHero({ titleLines, tagline, imageAlt, cta }: StorefrontHeroProps) {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate h-[max(calc(100svh-76px),110vw)] min-h-[32rem] overflow-hidden bg-navy-950 text-cream lg:h-[min(max(85vh,52vw),96vw)]"
    >
      <Image
        src="/images/balzacgroupe-hero-storefront.jpg"
        alt={imageAlt}
        fill
        priority
        quality={HERO_IMAGE_QUALITY}
        sizes="100vw"
        data-crop="art-directed"
        data-text-zones="110,34,1080,139;345,384,695,449;395,539,560,579;760,414,930,559;390,679,605,724;850,764,1115,1114"
        className="hero-settle object-cover object-[0%_50%] lg:object-[50%_0%]"
      />

      {/* Scrim: navy where the type sits, clearing to nothing over the storefront so it keeps its warmth. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-navy-950/95 from-10% via-navy-950/75 via-40% to-navy-950/0 to-65% lg:bg-gradient-to-r lg:from-navy-950/90 lg:from-0% lg:via-navy-950/65 lg:via-30% lg:to-navy-950/0 lg:to-55%"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-navy-950/45 to-navy-950/0 to-70% lg:hidden"
      />

      <div
        data-contrast=""
        className="absolute inset-x-0 bottom-0 px-5 pb-10 sm:px-8 sm:pb-14 lg:bottom-auto lg:left-[max(3rem,calc((100vw-90rem)/2+3rem))] lg:right-auto lg:top-[15vw] lg:px-0 lg:pb-0"
      >
        <h1
          id="hero-title"
          className="rise-in font-display text-[clamp(2.6rem,10vw,3.25rem)] font-semibold leading-[0.98] text-cream-50 lg:text-[clamp(3.5rem,5.6vw,6.25rem)]"
        >
          {titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <span
          aria-hidden="true"
          style={{ animationDelay: "180ms" }}
          className="rise-in mt-6 block h-px w-14 bg-cream/80 lg:mt-[2vw]"
        />
        <div className="lg:absolute lg:left-0 lg:top-[25.5vw] lg:w-max">
          <p
            style={{ animationDelay: "260ms" }}
            className="rise-in label-caps mt-6 text-[clamp(0.625rem,2.8vw,0.75rem)] tracking-caps-sm text-cream sm:tracking-caps-lg lg:mt-0"
          >
            {tagline}
          </p>
          <div style={{ animationDelay: "380ms" }} className="rise-in mt-7 lg:mt-[1.6vw]">
            {cta}
          </div>
        </div>
      </div>
    </section>
  );
}
