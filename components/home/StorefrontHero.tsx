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
 * Homepage hero: the client storefront, with the type over it (docs/mockup-Mobile.jpg).
 *
 * The photo file is a crop that starts below the upper Thai/BALZAC band, so only the awning reads
 * BALZAC. Its baked-in signage is declared in `data-text-zones` (pixels of the 1122x1156 file) and the
 * responsive gate fails if any HTML text lands on one, at any width.
 *
 * Two framings:
 * - below 1024px the photograph is shown whole, at its own 4:5, so the awning, the window, the olive
 *   tree, the terrace and the A-board all read on a phone; the type sits beneath it on navy, where it
 *   covers none of the shopfront and needs no scrim to stay legible;
 * - from 1024px it fills the section and anchors to the awning, and the type is pinned in vw to the
 *   olive tree column: headline between the awning and the window lettering, tagline and CTA below.
 */
export function StorefrontHero({ titleLines, tagline, imageAlt, cta }: StorefrontHeroProps) {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex flex-col overflow-hidden bg-navy-950 text-cream lg:block lg:h-[min(max(85vh,52vw),96vw)]"
    >
      <div className="relative aspect-[1122/1156] w-full lg:absolute lg:inset-0 lg:aspect-auto">
        <Image
          src="/images/balzacgroupe-hero-storefront.jpg"
          alt={imageAlt}
          fill
          priority
          quality={HERO_IMAGE_QUALITY}
          sizes="100vw"
          data-crop="art-directed"
          data-text-zones="110,34,1080,139;345,384,695,449;395,539,560,579;760,414,930,559;390,679,605,724;850,764,1115,1114"
          className="hero-settle object-cover object-center lg:object-[50%_0%]"
        />

        {/* Mobile: just a seam into the navy type block. Desktop: navy where the type sits, clearing
            to nothing over the storefront so it keeps its warmth. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy-950 to-navy-950/0 lg:inset-0 lg:h-full lg:bg-gradient-to-r lg:from-navy-950/90 lg:from-0% lg:via-navy-950/65 lg:via-30% lg:to-navy-950/0 lg:to-55%"
        />
      </div>

      <div
        data-contrast=""
        className="relative px-5 pb-12 pt-6 sm:px-8 sm:pb-16 sm:pt-8 lg:absolute lg:bottom-auto lg:left-[max(3rem,calc((100vw-90rem)/2+3rem))] lg:right-auto lg:top-[15vw] lg:px-0 lg:pb-0 lg:pt-0"
      >
        <h1
          id="hero-title"
          className="rise-in font-display text-[clamp(2.5rem,9vw,3.25rem)] font-semibold leading-[0.98] text-cream-50 lg:text-[clamp(3.5rem,5.6vw,6.25rem)]"
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
          className="rise-in mt-5 block h-px w-14 bg-cream/80 lg:mt-[2vw]"
        />
        <div className="lg:absolute lg:left-0 lg:top-[25.5vw] lg:w-max">
          <p
            style={{ animationDelay: "260ms" }}
            className="rise-in label-caps mt-5 text-[clamp(0.625rem,2.8vw,0.75rem)] tracking-caps-sm text-cream sm:tracking-caps-lg lg:mt-0"
          >
            {tagline}
          </p>
          <div style={{ animationDelay: "380ms" }} className="rise-in mt-6 lg:mt-[1.6vw]">
            {cta}
          </div>
        </div>
      </div>
    </section>
  );
}
