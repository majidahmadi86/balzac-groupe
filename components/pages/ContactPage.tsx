import Link from "next/link";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Hero } from "@/components/home/Hero";
import { MotionScope } from "@/components/home/MotionScope";
import { Reveal } from "@/components/home/Reveal";
import { getDictionary, type Locale } from "@/lib/i18n";
import { GROUP_EMAIL } from "@/lib/legal";
import { pathFor } from "@/lib/routes";

const ANTIQUES_URL = "https://balzacantiques.ch";

export function ContactPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const page = t.contactPage;
  const houses = pathFor(locale, "houses");
  const pendingLabel = locale === "fr" ? "À compléter" : "To be confirmed";

  const houseLinks = [
    { name: t.home.houses.cafe.label, note: page.aside.cafeNote, href: `${houses}#cafe`, external: false },
    { name: t.home.houses.antiques.label, note: page.aside.antiquesNote, href: ANTIQUES_URL, external: true },
    { name: t.home.houses.immobilier.label, note: page.aside.immobilierNote, href: `${houses}#immobilier`, external: false },
  ];

  return (
    <MotionScope>
      <Hero
        compact
        label={page.hero.label}
        titleLines={[page.hero.title]}
        intro={page.hero.intro}
        // TEMP mockup crop, replace with client photography.
        image={{ src: "/images/temp/temp-vision-interior.jpg", alt: page.hero.imageAlt, position: "object-[18%_50%] lg:object-[50%_60%]" }}
      />

      <section aria-labelledby="contact-form-title" className="bg-cream py-16 text-navy sm:py-20 lg:py-24">
        <div className="site-gutter grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="label-caps tracking-caps-lg text-navy/80 lg:text-xs">{page.form.label}</p>
              <h2
                id="contact-form-title"
                className="mt-4 font-display text-[2rem] font-semibold leading-[1.08] sm:text-[2.5rem] lg:mt-5 lg:text-[3rem]"
              >
                {page.form.title}
              </h2>
            </Reveal>
            <div className="mt-8 lg:mt-10">
              <InquiryForm kind="contact" locale={locale} groupEmail={GROUP_EMAIL} />
            </div>
          </div>

          <aside aria-label={page.aside.label} className="lg:col-span-4 lg:col-start-9 lg:pt-3">
            <Reveal delay={120} className="border-t border-navy/15 pt-8">
              <p className="label-caps tracking-caps-lg text-navy/70 lg:text-xs">{page.aside.label}</p>
              <h3 className="mt-4 font-display text-[1.5rem] font-semibold leading-[1.15]">{page.aside.emailTitle}</h3>
              <p className="mt-2 text-[1.0625rem]">
                {GROUP_EMAIL ? (
                  <a
                    href={`mailto:${GROUP_EMAIL}`}
                    className="inline-flex min-h-[44px] items-center text-navy underline decoration-navy/30 underline-offset-[6px] transition-colors duration-300 hover:decoration-navy"
                  >
                    {GROUP_EMAIL}
                  </a>
                ) : (
                  <span data-pending="GROUP_EMAIL" className="border-b border-dotted border-gold-dark italic text-navy/60">
                    {pendingLabel}
                  </span>
                )}
              </p>

              <h3 className="mt-10 font-display text-[1.5rem] font-semibold leading-[1.15]">{page.aside.housesTitle}</h3>
              <ul className="mt-3 border-t border-navy/15">
                {houseLinks.map((house) => {
                  const inner = (
                    <>
                      <span className="text-[1.0625rem] text-navy">{house.name}</span>
                      <span className="label-caps text-[0.625rem] tracking-caps-sm text-navy/60">{house.note}</span>
                    </>
                  );
                  const className =
                    "flex min-h-[56px] items-center justify-between gap-4 py-3 transition-colors duration-300 hover:text-forest";
                  return (
                    <li key={house.name} className="border-b border-navy/15">
                      {house.external ? (
                        <a href={house.href} target="_blank" rel="noopener noreferrer" className={className}>
                          {inner}
                          <span className="sr-only">{t.home.newTab}</span>
                        </a>
                      ) : (
                        <Link href={house.href} className={className}>
                          {inner}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </aside>
        </div>
      </section>
    </MotionScope>
  );
}
