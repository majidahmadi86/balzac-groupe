import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { MotionScope } from "@/components/home/MotionScope";
import { Reveal } from "@/components/home/Reveal";
import type { Locale } from "@/lib/i18n";
import type { Inline, LegalDoc } from "@/lib/legal-content";
import { pathFor } from "@/lib/routes";

const pendingLabel: Record<Locale, string> = { en: "To be confirmed", fr: "À compléter" };

function InlineParts({ parts, locale, standalone = false }: { parts: Inline[]; locale: Locale; standalone?: boolean }) {
  return (
    <>
      {parts.map((part, idx) => {
        if (typeof part === "string") return <span key={idx}>{part}</span>;
        if ("pending" in part) {
          return (
            <span
              key={idx}
              data-pending={part.pending}
              className="border-b border-dotted border-gold-dark italic text-navy/60"
            >
              {pendingLabel[locale]}
            </span>
          );
        }
        return (
          <Link
            key={idx}
            href={pathFor(locale, part.link)}
            className={`text-navy underline decoration-navy/30 underline-offset-4 transition-colors duration-300 hover:decoration-navy ${standalone ? "-my-3 inline-flex min-h-[44px] items-center" : ""}`}
          >
            {part.text}
          </Link>
        );
      })}
    </>
  );
}

// Legal and privacy pages: the /vision page hero, then typeset sections.
export function LegalPage({ locale, doc }: { locale: Locale; doc: LegalDoc }) {
  return (
    <MotionScope>
      <Hero
        compact
        label={doc.hero.label}
        titleLines={[doc.hero.title]}
        intro={doc.hero.intro}
        // TEMP mockup crop, replace with client photography.
        image={{
          src: "/images/temp/temp-vision-interior.jpg",
          alt: doc.hero.imageAlt,
          position: "object-[18%_50%] lg:object-[50%_60%]",
        }}
      />

      <div className="bg-cream py-14 text-navy sm:py-20 lg:py-24">
        <div className="site-gutter">
          <div className="mx-auto max-w-3xl">
            {doc.sections.map((section, idx) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-title`}
                className={`scroll-mt-[96px] lg:scroll-mt-[128px] ${idx > 0 ? "mt-12 border-t border-navy/10 pt-12 lg:mt-14 lg:pt-14" : ""}`}
              >
                <Reveal>
                  <p className="label-caps leading-normal tracking-caps-lg text-navy/60 lg:text-xs">{String(idx + 1).padStart(2, "0")}</p>
                  <h2
                    id={`${section.id}-title`}
                    className="mt-3 text-balance font-display text-[1.75rem] font-semibold leading-[1.1] sm:text-[2rem] lg:text-[2.375rem]"
                  >
                    {section.title}
                  </h2>
                  <div className="mt-5 space-y-4 text-[1.0625rem] leading-[1.7] text-navy/85 lg:text-[1.125rem]">
                    {section.blocks.map((block, bIdx) =>
                      block.type === "p" ? (
                        <p key={bIdx} className="text-pretty">
                          <InlineParts parts={block.parts} locale={locale} />
                        </p>
                      ) : (
                        <dl key={bIdx} className="border-t border-navy/15">
                          {block.items.map((item) => (
                            <div
                              key={item.label}
                              className="grid gap-1 border-b border-navy/15 py-3.5 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-6"
                            >
                              <dt className="label-caps self-center leading-[1.5] tracking-caps-sm text-navy/70">{item.label}</dt>
                              <dd className="text-navy">
                                <InlineParts parts={item.value} locale={locale} standalone />
                              </dd>
                            </div>
                          ))}
                        </dl>
                      ),
                    )}
                  </div>
                </Reveal>
              </section>
            ))}
          </div>
        </div>
      </div>
    </MotionScope>
  );
}
