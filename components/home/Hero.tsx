import Image from "next/image";
import type { ReactNode } from "react";

type HeroProps = {
  titleLines: string[];
  image: { src: string; alt: string; position?: string };
  label?: string;
  intro?: string;
  tagline?: string;
  cta?: ReactNode;
  /** Page hero for inner pages (~45vh). The homepage uses the full-height hero. */
  compact?: boolean;
  /** Shortest page hero, for pages whose content (a form) should start near the top. Implies compact type. */
  tight?: boolean;
  /**
   * overlay: type set on the photo behind a scrim (photos with a quiet area for text).
   * split: type on navy beside the photo, stacked on mobile (photos with signage or text baked in).
   */
  layout?: "overlay" | "split";
  /**
   * Overlay scrim, tuned per photo. dark: dim evenly (dark photos). light: an opaque navy field
   * behind the type that clears quickly, so pale photos keep their colour instead of washing grey.
   */
  scrim?: "dark" | "light";
};

const SCRIMS = {
  dark: "bg-gradient-to-t from-navy-950/90 via-navy-950/45 to-navy-950/10 lg:bg-gradient-to-r lg:from-navy-950/85 lg:via-navy-950/45 lg:to-navy-950/0",
  light:
    "bg-gradient-to-t from-navy-950 from-15% via-navy-950/80 via-45% to-navy-950/0 to-80% lg:bg-gradient-to-r lg:from-navy-950 lg:from-10% lg:via-navy-950/85 lg:via-40% lg:to-navy-950/0 lg:to-70%",
};

// Scrim tied to the type block itself: whatever the title length or hero height, the navy backing reaches
// 6rem beyond the text (above it on mobile, to its right on desktop) before fading, so every line holds 4.5:1.
const TEXT_SCRIM =
  "relative z-0 before:pointer-events-none before:absolute before:-bottom-24 before:-left-[50vw] before:-right-[50vw] before:-top-24 before:-z-10 before:bg-[linear-gradient(to_top,rgba(0,15,23,0.9)_0%,rgba(0,15,23,0.8)_78%,rgba(0,15,23,0)_100%)] lg:before:-bottom-[50vh] lg:before:-right-40 lg:before:-top-[50vh] lg:before:bg-[linear-gradient(to_right,rgba(0,15,23,0.9)_0%,rgba(0,15,23,0.8)_75%,rgba(0,15,23,0)_100%)]";

function HeroText({
  titleLines,
  label,
  intro,
  tagline,
  cta,
  compact,
  overlay = false,
}: Omit<HeroProps, "image" | "layout" | "scrim"> & { overlay?: boolean }) {
  const titleSize = compact
    ? "text-[clamp(2.25rem,10vw,3.5rem)] leading-[1.02] lg:text-[4rem] xl:text-[4.5rem]"
    : "text-[clamp(2.6rem,13vw,4.5rem)] leading-[0.98] lg:text-[5.5rem] xl:text-[6.25rem]";

  return (
    <div data-contrast="" className={`max-w-2xl ${overlay ? TEXT_SCRIM : ""}`}>
      {label && <p className="rise-in label-caps mb-5 tracking-caps-lg text-gold-light lg:mb-6 lg:text-xs">{label}</p>}
      <h1
        id="hero-title"
        style={label ? { animationDelay: "80ms" } : undefined}
        className={`rise-in text-balance font-display font-semibold text-cream-50 ${titleSize}`}
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
        className={`rise-in block h-px w-14 bg-cream/80 ${compact ? "mt-6 lg:mt-7" : "mt-7 lg:mt-9"}`}
      />
      {intro && (
        <p
          style={{ animationDelay: "260ms" }}
          className="rise-in mt-5 max-w-xl text-pretty text-[1.0625rem] leading-[1.5] text-cream/90 lg:mt-6 lg:text-[1.1875rem]"
        >
          {intro}
        </p>
      )}
      {tagline && (
        <p
          style={{ animationDelay: "260ms" }}
          className="rise-in label-caps mt-6 text-[clamp(0.625rem,2.8vw,0.75rem)] tracking-caps-sm text-cream sm:tracking-caps-lg lg:mt-8"
        >
          {tagline}
        </p>
      )}
      {cta && (
        <div style={{ animationDelay: "380ms" }} className="rise-in mt-8 lg:mt-10">
          {cta}
        </div>
      )}
    </div>
  );
}

/**
 * Hero photos are the largest paint of their page. Quality 60 is visually indistinguishable from
 * the default 75 on these photographs and markedly lighter. (AVIF was tried: a third smaller again,
 * but a cold encode of a large variant takes seconds, which the first visitor would wait for.)
 */
export const HERO_IMAGE_QUALITY = 60;

// Photographic hero. The image source and its art direction come from the caller.
export function Hero({ image, compact = false, tight = false, layout = "overlay", scrim = "dark", ...text }: HeroProps) {
  if (tight) compact = true;
  if (layout === "split") {
    const height = compact ? "lg:h-[55vh] lg:min-h-[28rem] lg:max-h-[40rem]" : "lg:h-[85vh] lg:min-h-[40rem] lg:max-h-[64rem]";
    return (
      <section aria-labelledby="hero-title" className={`relative isolate overflow-hidden bg-navy-950 text-cream lg:grid lg:grid-cols-2 ${height}`}>
        <div className={`relative overflow-hidden lg:order-2 lg:h-full ${compact ? "aspect-[4/3]" : "aspect-square"} sm:aspect-[16/11] lg:aspect-auto`}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            quality={HERO_IMAGE_QUALITY}
            sizes="(min-width: 1024px) 50vw, 100vw"
            data-crop="art-directed"
            className={`hero-settle object-cover ${image.position ?? "object-center"}`}
          />
          {/* Soft seam into the navy text field: below the photo on mobile, to its left on desktop. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-navy-950 to-navy-950/0 lg:inset-y-0 lg:left-0 lg:right-auto lg:h-full lg:w-24 lg:bg-gradient-to-r"
          />
        </div>
        <div className="flex items-center">
          <div
            className={`w-full px-5 sm:px-8 lg:pl-[max(3rem,calc((100vw-90rem)/2+3rem))] lg:pr-12 ${
              compact ? "pb-12 pt-6 sm:pb-14 lg:py-12" : "pb-14 pt-6 sm:pb-16 lg:py-16"
            }`}
          >
            <HeroText compact={compact} {...text} />
          </div>
        </div>
      </section>
    );
  }

  const height = tight
    ? "h-[34svh] min-h-[15rem] lg:h-[30vh] lg:min-h-[15rem] lg:max-h-[19rem]"
    : compact
    ? "h-[45svh] min-h-[24rem] lg:h-[45vh] lg:min-h-[26rem] lg:max-h-[36rem]"
    : "h-[calc(100svh-76px)] min-h-[32rem] lg:h-[85vh] lg:min-h-[40rem] lg:max-h-[64rem]";

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-navy-950 text-cream">
      <div className={`relative ${height}`}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          quality={HERO_IMAGE_QUALITY}
          sizes="100vw"
          data-crop="art-directed"
          className={`hero-settle object-cover ${image.position ?? "object-center"}`}
        />
        <div aria-hidden="true" className={`absolute inset-0 ${SCRIMS[scrim]}`} />

        <div
          className={`site-gutter relative flex h-full flex-col justify-end lg:justify-center lg:pb-0 ${
            tight ? "pb-7 sm:pb-9" : compact ? "pb-10 sm:pb-14" : "pb-14 sm:pb-20"
          }`}
        >
          <HeroText compact={compact} overlay {...text} />
        </div>
      </div>
    </section>
  );
}
