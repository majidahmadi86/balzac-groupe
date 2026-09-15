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
};

// Full-bleed photographic hero: image edge to edge, dark scrim, cream type.
// The image source comes from the caller (see the TEMP crop notes there).
export function Hero({ titleLines, image, label, intro, tagline, cta, compact = false }: HeroProps) {
  const height = compact
    ? "h-[45svh] min-h-[24rem] lg:h-[45vh] lg:min-h-[26rem] lg:max-h-[36rem]"
    : "h-[calc(100svh-76px)] min-h-[32rem] lg:h-[85vh] lg:min-h-[40rem] lg:max-h-[64rem]";
  const titleSize = compact
    ? "text-[clamp(2.25rem,10vw,3.5rem)] leading-[1.02] lg:text-[4rem] xl:text-[4.5rem]"
    : "text-[clamp(2.6rem,13vw,4.5rem)] leading-[0.98] lg:text-[5.5rem] xl:text-[6.25rem]";

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
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/45 to-navy-950/10 lg:bg-gradient-to-r lg:from-navy-950/85 lg:via-navy-950/45 lg:to-navy-950/0"
        />

        <div
          className={`site-gutter relative flex h-full flex-col justify-end lg:justify-center lg:pb-0 ${
            compact ? "pb-10 sm:pb-14" : "pb-14 sm:pb-20"
          }`}
        >
          <div className="max-w-2xl">
            {label && (
              <p className="rise-in label-caps mb-5 tracking-caps-lg text-gold-light lg:mb-6 lg:text-xs">{label}</p>
            )}
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
        </div>
      </div>
    </section>
  );
}
