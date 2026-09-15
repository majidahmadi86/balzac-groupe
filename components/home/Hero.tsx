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

function HeroText({ titleLines, label, intro, tagline, cta, compact }: Omit<HeroProps, "image" | "layout" | "scrim">) {
  const titleSize = compact
    ? "text-[clamp(2.25rem,10vw,3.5rem)] leading-[1.02] lg:text-[4rem] xl:text-[4.5rem]"
    : "text-[clamp(2.6rem,13vw,4.5rem)] leading-[0.98] lg:text-[5.5rem] xl:text-[6.25rem]";

  return (
    <div className="max-w-2xl">
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

// Photographic hero. The image source and its art direction come from the caller.
export function Hero({ image, compact = false, layout = "overlay", scrim = "dark", ...text }: HeroProps) {
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

  const height = compact
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
          sizes="100vw"
          data-crop="art-directed"
          className={`hero-settle object-cover ${image.position ?? "object-center"}`}
        />
        <div aria-hidden="true" className={`absolute inset-0 ${SCRIMS[scrim]}`} />

        <div
          className={`site-gutter relative flex h-full flex-col justify-end lg:justify-center lg:pb-0 ${
            compact ? "pb-10 sm:pb-14" : "pb-14 sm:pb-20"
          }`}
        >
          <HeroText compact={compact} {...text} />
        </div>
      </div>
    </section>
  );
}
