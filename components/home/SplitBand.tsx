import Image from "next/image";
import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type SplitBandProps = {
  id: string;
  label: string;
  title: string;
  body: string[];
  cta: ReactNode;
  image: { src: string; alt: string };
  imageSide: "left" | "right";
  tone?: "cream" | "forest";
  /** Mobile aspect ratio class, close to the source crop so nothing important is cut. */
  aspect?: string;
  /** object-position utilities for the image. */
  imagePosition?: string;
  compact?: boolean;
};

// Full-width editorial band. Mobile: text then image. From md: 50/50 split,
// the image bleeding to the viewport edge on its side.
export function SplitBand({
  id,
  label,
  title,
  body,
  cta,
  image,
  imageSide,
  tone = "cream",
  aspect = "aspect-[5/4] sm:aspect-[16/10]",
  imagePosition = "object-center",
  compact = false,
}: SplitBandProps) {
  const forest = tone === "forest";
  const titleId = `${id}-title`;

  // Text column aligns with the header gutter on its outer edge.
  const outerGutter = "lg:pl-[max(3rem,calc((100vw-90rem)/2+3rem))]";
  const outerGutterRight = "lg:pr-[max(3rem,calc((100vw-90rem)/2+3rem))]";
  const textPadding =
    imageSide === "right"
      ? `md:pl-8 md:pr-10 ${outerGutter} lg:pr-16 xl:pr-20`
      : `md:pl-10 md:pr-8 lg:pl-16 xl:pl-20 ${outerGutterRight}`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={`group/band relative overflow-hidden md:grid md:grid-cols-2 ${
        compact ? "md:min-h-[22rem] lg:min-h-[28rem] xl:min-h-[31rem]" : "md:min-h-[26rem] lg:min-h-[32rem] xl:min-h-[36rem]"
      } ${
        forest ? "bg-forest-900 text-cream" : "bg-cream text-navy"
      }`}
    >
      <div className={`flex items-center ${imageSide === "left" ? "md:order-2" : ""}`}>
        <Reveal className={`w-full px-5 py-14 sm:px-8 sm:py-16 md:py-16 lg:py-24 ${textPadding}`}>
          <div className="max-w-[34rem]">
            <p className={`label-caps tracking-caps-lg lg:text-xs ${forest ? "text-gold-light" : "text-navy/80"}`}>{label}</p>
            <h2
              id={titleId}
              className={`mt-4 text-balance font-display text-[2.125rem] font-semibold leading-[1.04] sm:text-[2.5rem] md:text-[2.25rem] lg:mt-5 lg:text-[3rem] xl:text-[3.5rem] ${
                forest ? "text-cream-50" : "text-navy"
              }`}
            >
              {title}
            </h2>
            <p
              className={`mt-5 text-[1.0625rem] leading-[1.5] lg:mt-6 lg:text-[1.1875rem] ${
                forest ? "text-cream/85" : "text-navy/85"
              }`}
            >
              {body.map((sentence) => (
                <span key={sentence} className="block text-pretty">
                  {sentence}
                </span>
              ))}
            </p>
            <div className="mt-8 lg:mt-10">{cta}</div>
          </div>
        </Reveal>
      </div>

      <div
        className={`relative overflow-hidden md:aspect-auto md:min-h-full ${aspect} ${
          imageSide === "left" ? "md:order-1" : ""
        }`}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className={`object-cover transition-transform duration-[1800ms] ease-editorial lg:group-hover/band:scale-[1.04] ${imagePosition}`}
        />
        {forest && (
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-forest-900 to-forest-900/0 md:inset-y-0 md:left-0 md:right-auto md:h-full md:w-2/5 md:bg-gradient-to-r"
          />
        )}
      </div>
    </section>
  );
}
