import Link from "next/link";
import { getDictionary, type Locale } from "@/lib/i18n";
import { copyrightLine } from "@/lib/legal";
import { legalNav, mainNav, pathFor } from "@/lib/routes";
import { Plaque } from "./Plaque";
import { SocialLinks } from "./SocialLinks";

// Below lg the footer follows docs/mockup-Mobile.jpg: one band with plaque,
// social icons and the italic motto, then legal links left and copyright right.
// From lg it adds the nav links, per the desktop mockup.
export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const splitAt = t.motto.lastIndexOf(", ");
  const mottoLines = splitAt > 0 ? [t.motto.slice(0, splitAt + 1), t.motto.slice(splitAt + 2)] : [t.motto];

  return (
    <footer className="bg-navy text-cream">
      <div className="site-gutter grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-6 py-8 min-[520px]:grid-cols-[auto_1fr_auto] sm:py-10 lg:flex lg:justify-between lg:gap-8 lg:py-12 xl:gap-12">
        <Link href={pathFor(locale, "home")} aria-label={t.header.homeLink} className="order-1 block shrink-0">
          <Plaque
            className="block h-auto w-[132px] min-[520px]:w-[150px] sm:w-[176px] lg:w-[190px] xl:w-[220px]"
            label={t.siteName}
          />
        </Link>

        <nav aria-label={t.footer.footerNav} className="hidden lg:order-2 lg:block">
          <ul className="flex items-center">
            {mainNav.map((page) => (
              <li key={page} className="relative px-3.5 before:absolute before:left-0 before:top-1/2 before:h-4 before:w-px before:-translate-y-1/2 before:bg-cream/20 first:pl-0 first:before:hidden xl:px-5">
                <Link
                  href={pathFor(locale, page)}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center whitespace-nowrap text-[14px] leading-none text-cream/85 transition-colors duration-300 hover:text-gold-light xl:text-[15px]"
                >
                  {t.nav[page]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="order-3 col-span-2 justify-self-center min-[520px]:order-2 min-[520px]:col-span-1 lg:order-3">
          <SocialLinks label={t.footer.social} className="gap-3 sm:gap-4" itemClassName="text-cream hover:text-gold-light" />
        </div>

        <p className="order-2 justify-self-end text-right font-display text-[15px] italic leading-[1.3] text-cream/90 min-[520px]:order-3 sm:text-lg lg:hidden">
          {mottoLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>

      <div className="border-t border-cream/10">
        <div className="site-gutter flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-4 text-[13px] text-cream/65 lg:flex-nowrap lg:gap-8 lg:py-6">
          <ul className="order-1 flex items-center gap-4 lg:order-2">
            {legalNav.map((page, idx) => (
              <li key={page} className="flex items-center gap-4">
                {idx > 0 && <span aria-hidden="true" className="h-3 w-px bg-cream/25" />}
                <Link href={pathFor(locale, page)} className="flex min-h-[44px] items-center transition-colors duration-300 hover:text-gold-light">
                  {t.legalNav[page]}
                </Link>
              </li>
            ))}
          </ul>

          <p className="order-2 ml-auto py-2 text-right lg:order-1 lg:ml-0 lg:text-left">{copyrightLine(locale)}</p>

          <p className="hidden items-center gap-4 font-display text-[17px] italic text-cream/85 lg:order-3 lg:flex">
            <span aria-hidden="true" className="h-px w-10 bg-gold/60" />
            {t.motto}
          </p>
        </div>
      </div>
    </footer>
  );
}
