import Image from "next/image";
import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/** Band photographs are large but secondary; 65 is indistinguishable from the default 75 and lighter. */
const BAND_IMAGE_QUALITY = 65;

type SplitBandProps = {
  id: string;
  label: string;
  title: string;
  body: string[];
  cta?: ReactNode;
  /**
   * textZones: baked-in text as "x1,y1,x2,y2;..." in the source file's own pixels (zonesWidth).
   * subjectZones: faces and figures, same format. The responsive gate keeps HTML text off both and
   * fails any crop that slices through one.
   */
  image: { src: string; alt: string; textZones?: string; subjectZones?: string; zonesWidth?: number };
  imageSide: "left" | "right";
  tone?: "cream" | "forest";
  /** Aspect ratio class while the band is stacked, close to the source crop so nothing important is cut. */
  aspect?: string;
  /**
   * From the split the image normally fills the band's height, which suits landscape photographs. A
   * portrait photograph in that box loses most of its height once the column turns wider than it is
   * tall, so it can set its own aspect here instead: the band then grows with the column. md bands only.
   */
  desktopAspect?: string;
  /**
   * Where the band splits into two columns. "md" by default. "xl" keeps a text-heavy band stacked
   * through tablet and small-laptop widths, where half a screen is too narrow a column for its photo
   * (the photo shows whole, full width, under the text).
   */
  splitFrom?: "md" | "xl";
  /** object-position utilities for the image. */
  imagePosition?: string;
  /** Band height: compact for secondary bands, feature when a band carries more of the page. */
  size?: "compact" | "default" | "feature";
  /** "lines" keeps the mockup's short stacked lines; "paragraphs" is for longer page copy. */
  bodyStyle?: "lines" | "paragraphs";
  details?: { title: string; items: string[] };
};

// Class sets per split breakpoint, each written out whole (no interpolation) so Tailwind can see every
// one of them. The bracketed value is the header gutter, so text lines up with the logo.
const LAYOUT = {
  md: {
    grid: "md:grid md:grid-cols-2",
    minH: {
      compact: "md:min-h-[22rem] lg:min-h-[28rem] xl:min-h-[31rem]",
      default: "md:min-h-[26rem] lg:min-h-[32rem] xl:min-h-[36rem]",
      feature: "md:min-h-[30rem] lg:min-h-[38rem] xl:min-h-[42rem]",
    },
    textAfterImage: "md:order-2",
    textInSecondColumn: "md:col-start-2",
    padding: "px-5 py-14 sm:px-8 sm:py-16 md:py-16 lg:py-24",
    padImageRight: "md:pl-8 md:pr-10 lg:pl-[max(3rem,calc((100vw-90rem)/2+3rem))] lg:pr-16 xl:pr-20",
    padImageLeft: "md:pl-10 md:pr-8 lg:pl-16 xl:pl-20 lg:pr-[max(3rem,calc((100vw-90rem)/2+3rem))]",
    imageFirst: "md:order-1",
    imageCover: "md:absolute md:inset-y-0 md:w-1/2 md:aspect-auto",
    imageCoverLeft: "md:left-0",
    imageCoverRight: "md:right-0",
    seam: "md:inset-y-0 md:h-full md:w-2/5",
    seamImageRight: "md:left-0 md:right-auto md:bg-gradient-to-r",
    seamImageLeft: "md:left-auto md:right-0 md:bg-gradient-to-l",
    sizes: "(min-width: 768px) 50vw, 100vw",
  },
  xl: {
    grid: "xl:grid xl:grid-cols-2",
    minH: { compact: "xl:min-h-[31rem]", default: "xl:min-h-[36rem]", feature: "xl:min-h-[42rem]" },
    textAfterImage: "xl:order-2",
    textInSecondColumn: "xl:col-start-2",
    padding: "px-5 py-14 sm:px-8 sm:py-16 md:px-10 lg:px-[max(3rem,calc((100vw-90rem)/2+3rem))] lg:py-20 xl:py-24",
    padImageRight: "xl:pl-[max(3rem,calc((100vw-90rem)/2+3rem))] xl:pr-20",
    padImageLeft: "xl:pl-20 xl:pr-[max(3rem,calc((100vw-90rem)/2+3rem))]",
    imageFirst: "xl:order-1",
    imageCover: "xl:absolute xl:inset-y-0 xl:w-1/2 xl:aspect-auto",
    imageCoverLeft: "xl:left-0",
    imageCoverRight: "xl:right-0",
    seam: "xl:inset-y-0 xl:h-full xl:w-2/5",
    seamImageRight: "xl:left-0 xl:right-auto xl:bg-gradient-to-r",
    seamImageLeft: "xl:left-auto xl:right-0 xl:bg-gradient-to-l",
    sizes: "(min-width: 1280px) 50vw, 100vw",
  },
} as const;

// Full-width editorial band. Stacked: text then image. From the split: 50/50, the image bleeding to the
// viewport edge on its side.
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
  desktopAspect,
  splitFrom = "md",
  imagePosition = "object-center",
  size = "default",
  bodyStyle = "lines",
  details,
}: SplitBandProps) {
  const forest = tone === "forest";
  const L = LAYOUT[splitFrom];
  // From the split the photograph either sets the band's height (a portrait photo given its own desktop
  // aspect) or simply covers its half of whatever height the text needs. The second case used to be a
  // grid item with min-height: 100%, a percentage of a row whose height is not known while the row is
  // being sized; engines resolve that differently, and a band could end up shorter than its text, the
  // text cut off and the photo running over the next section. Now that photo is positioned against
  // the section itself, so the section's height comes from its text alone and the photo matches it.
  const imageSetsHeight = Boolean(desktopAspect);
  const titleId = `${id}-title`;
  const textPadding = imageSide === "right" ? L.padImageRight : L.padImageLeft;
  const textPlacement = imageSide === "left" ? (imageSetsHeight ? L.textAfterImage : L.textInSecondColumn) : "";

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={`group/band relative scroll-mt-[76px] overflow-hidden lg:scroll-mt-[104px] ${L.grid} ${L.minH[size]} ${
        forest ? "bg-forest-900 text-cream" : "bg-cream text-navy"
      }`}
    >
      <div className={`flex items-center ${textPlacement}`}>
        <Reveal className={`w-full ${L.padding} ${textPadding}`}>
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
        className={`relative overflow-hidden ${aspect} ${
          imageSetsHeight
            ? `${desktopAspect} ${imageSide === "left" ? L.imageFirst : ""}`
            : `${L.imageCover} ${imageSide === "left" ? L.imageCoverLeft : L.imageCoverRight}`
        }`}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          quality={BAND_IMAGE_QUALITY}
          sizes={L.sizes}
          data-text-zones={image.textZones}
          data-subject-zones={image.subjectZones}
          data-zones-width={image.textZones || image.subjectZones ? image.zonesWidth : undefined}
          className={`object-cover transition-transform duration-[1800ms] ease-editorial lg:group-hover/band:scale-[1.04] ${imagePosition}`}
        />
        {forest && (
          <div
            aria-hidden="true"
            className={`absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-forest-900 to-forest-900/0 ${L.seam} ${
              imageSide === "right" ? L.seamImageRight : L.seamImageLeft
            }`}
          />
        )}
      </div>
    </section>
  );
}
