import Link from "next/link";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Hero } from "@/components/home/Hero";
import { MotionScope } from "@/components/home/MotionScope";
import { getDictionary, type Locale } from "@/lib/i18n";
import { pathFor, SHOW_IMMOBILIER } from "@/lib/routes";

const ANTIQUES_URL = "https://balzacantiques.ch";

export function ContactPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const page = t.contactPage;
  const about = pathFor(locale, "about");

  const houseLinks = [
    { name: t.home.bands.cafe.name, note: page.aside.cafeNote, href: `${about}#cafe`, external: false },
    { name: t.home.bands.antiques.name, note: page.aside.antiquesNote, href: ANTIQUES_URL, external: true },
    ...(SHOW_IMMOBILIER
      ? [{ name: t.home.bands.immobilier.name, note: page.aside.immobilierNote, href: `${about}#immobilier`, external: false }]
      : []),
  ];

  return (
    <MotionScope>
      <Hero
        tight
        scrim="light"
        label={page.hero.label}
        titleLines={[page.hero.title]}
        // Phone: the desk itself (letter, pen, sealed envelope, coffee), type over its lower edge on the
        // scrim. From 1024px the whole width shows, the type sits on the navy wall the photograph leaves
        // for it, and the band is the desk top.
        image={{ src: "/images/balzacgroupe-contact-desk.jpg", alt: page.hero.imageAlt, position: "object-[100%_50%] lg:object-[50%_75%]" }}
      />

      {/* Intro beside the form from 1024px (first field visible without scrolling); on mobile intro, form, then the houses.
          The form is the only way to reach the group: no email address is shown anywhere. */}
      <section aria-labelledby="contact-intro-title" className="bg-cream pb-16 pt-8 text-navy sm:pb-20 sm:pt-10 lg:pb-24 lg:pt-12">
        <div className="site-gutter grid gap-8 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-10">
          <div data-contrast="" className="lg:col-span-5 lg:row-start-1 lg:pt-2">
            <p className="label-caps tracking-caps-lg text-navy lg:text-xs">{page.aside.label}</p>
            <h2
              id="contact-intro-title"
              className="mt-3 text-balance font-display text-[2rem] font-semibold leading-[1.06] sm:text-[2.5rem] lg:mt-4 lg:text-[3rem]"
            >
              {page.intro.title}
            </h2>
            <p className="mt-4 text-pretty text-[1.0625rem] leading-[1.6] text-navy lg:mt-6 lg:text-[1.125rem]">{page.intro.body}</p>
          </div>

          <div className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
            <InquiryForm kind="contact" locale={locale} label={page.form.label} />
          </div>

          <aside data-contrast="" aria-label={page.aside.label} className="border-t border-navy/15 pt-8 lg:col-span-5 lg:row-start-2 lg:self-start">
            <h3 className="font-display text-[1.5rem] font-semibold leading-[1.15]">{page.aside.maisonsTitle}</h3>
            <ul className="mt-3 border-t border-navy/15">
              {houseLinks.map((house) => {
                const inner = (
                  <>
                    <span className="text-[1.0625rem] text-navy">{house.name}</span>
                    <span className="label-caps text-[0.625rem] tracking-caps-sm text-navy">{house.note}</span>
                  </>
                );
                const className = "flex min-h-[56px] items-center justify-between gap-4 py-3 transition-colors duration-300 hover:text-forest";
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
          </aside>
        </div>
      </section>
    </MotionScope>
  );
}
