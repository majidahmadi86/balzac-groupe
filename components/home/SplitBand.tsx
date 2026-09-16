import Image from "next/image";
import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type SplitBandProps = {
  id: string;
  label: string;
  title: string;
  body: string[];
  cta?: ReactNode;
  /** textZones: baked-in sign text as "x1,y1,x2,y2;..." in the source file's own pixels (zonesWidth). */
  image: { src: string; alt: string; textZones?: string; zonesWidth?: number };
  imageSide: "left" | "right";
  tone?: "cream" | "forest";
  /** Mobile aspect ratio class, close to the source crop so nothing important is cut. */
  aspect?: string;
  /** object-position utilities for the image. */
  imagePosition?: string;
  /** Band height: compact for secondary bands, feature when a band carries more of the page. */
  size?: "compact" | "default" | "feature";
  /** "lines" keeps the mockup's short stacked lines; "paragraphs" is for longer page copy. */
  bodyStyle?: "lines" | "paragraphs";
  details?: { title: string; items: string[] };
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
  aspect = "aspect-[5/4]",
  imagePosition = "object-center",
  size = "default",
  bodyStyle = "lines",
  details,
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
      className={`group/band relative scroll-mt-[76px] overflow-hidden md:grid lg:scroll-mt-[104px] md:grid-cols-2 ${
        {
          compact: "md:min-h-[22rem] lg:min-h-[28rem] xl:min-h-[31rem]",
          default: "md:min-h-[26rem] lg:min-h-[32rem] xl:min-h-[36rem]",
          feature: "md:min-h-[30rem] lg:min-h-[38rem] xl:min-h-[42rem]",
        }[size]
      } ${
        forest ? "bg-forest-900 text-cream" : "bg-cream text-navy"
      }`}
    >
      <div className={`flex items-center ${imageSide === "left" ? "md:order-2" : ""}`}>
        <Reveal className={`w-full px-5 py-14 sm:px-8 sm:py-16 md:py-16 lg:py-24 ${textPadding}`}>
          <div data-contrast="" className="max-w-[34rem]">
            <p className={`label-caps tracking-caps-lg lg:text-xs ${forest ? "text-gold-light" : "text-navy/80"}`}>{label}</p>
            <h2
              id={titleId}
              className={`mt-4 text-balance font-display text-[2.125rem] font-semibold leading-[1.04] sm:text-[2.5rem] md:text-[2.25rem] lg:mt-5 lg:text-[3rem] xl:text-[3.5rem] ${
                forest ? "text-cream-50" : "text-navy"
              }`}
            >
              {title}
            </h2>
            {bodyStyle === "lines" ? (
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
            ) : (
              <div
                className={`mt-5 space-y-4 text-[1.0625rem] leading-[1.6] lg:mt-6 lg:text-[1.125rem] ${
                  forest ? "text-cream/85" : "text-navy/85"
                }`}
              >
                {body.map((paragraph) => (
                  <p key={paragraph} className="text-pretty">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
            {details && (
              <div className="mt-8 lg:mt-10">
                <p className={`label-caps tracking-caps-lg lg:text-xs ${forest ? "text-gold-light" : "text-navy/70"}`}>
                  {details.title}
                </p>
                <ul className="mt-4 grid grid-cols-2 gap-x-6 border-t border-navy/15">
                  {details.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 border-b border-navy/15 py-3 text-[0.9375rem] leading-snug lg:text-base"
                    >
                      <span aria-hidden="true" className="h-px w-3 shrink-0 bg-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {cta && <div className="mt-8 lg:mt-10">{cta}</div>}
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
          data-text-zones={image.textZones}
          data-zones-width={image.textZones ? image.zonesWidth : undefined}
          className={`object-cover transition-transform duration-[1800ms] ease-editorial lg:group-hover/band:scale-[1.04] ${imagePosition}`}
        />
        {forest && (
          <div
            aria-hidden="true"
            className={`absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-forest-900 to-forest-900/0 md:inset-y-0 md:h-full md:w-2/5 ${
              imageSide === "right" ? "md:left-0 md:right-auto md:bg-gradient-to-r" : "md:left-auto md:right-0 md:bg-gradient-to-l"
            }`}
          />
        )}
      </div>
    </section>
  );
}
