import Link from "next/link";
import { getDictionary, type Locale } from "@/lib/i18n";
import { legalNav, mainNav, pathFor } from "@/lib/routes";
import { Plaque } from "./Plaque";
import { SocialLinks } from "./SocialLinks";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <footer className="bg-navy text-cream">
      <div className="site-gutter flex flex-col items-center gap-10 py-14 text-center lg:flex-row lg:justify-between lg:gap-12 lg:py-12 lg:text-left">
        <Link href={pathFor(locale, "home")} aria-label={t.header.homeLink} className="block shrink-0">
          <Plaque className="block h-auto w-[208px] lg:w-[220px]" label={t.siteName} />
        </Link>

        <nav aria-label={t.footer.footerNav}>
          <ul className="grid grid-cols-2 gap-x-10 gap-y-4 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-0 sm:gap-y-3">
            {mainNav.map((page) => (
              <li key={page} className="sm:border-l sm:border-cream/20 sm:px-5 sm:first:border-l-0 lg:first:pl-0">
                <Link
                  href={pathFor(locale, page)}
                  className="text-[15px] leading-none text-cream/85 transition-colors duration-300 hover:text-gold-light"
                >
                  {t.nav[page]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <SocialLinks label={t.footer.social} itemClassName="text-cream hover:text-gold-light" />
      </div>

      <div className="border-t border-cream/10">
        <div className="site-gutter flex flex-col items-center gap-5 py-7 text-center text-[13px] text-cream/65 lg:flex-row lg:justify-between lg:gap-8 lg:py-6 lg:text-left">
          <p className="order-3 lg:order-1">{t.footer.copyright}</p>

          <ul className="order-2 flex items-center gap-4">
            {legalNav.map((page, idx) => (
              <li key={page} className="flex items-center gap-4">
                {idx > 0 && <span aria-hidden="true" className="h-3 w-px bg-cream/25" />}
                <Link href={pathFor(locale, page)} className="transition-colors duration-300 hover:text-gold-light">
                  {t.legalNav[page]}
                </Link>
              </li>
            ))}
          </ul>

          <p className="order-1 flex items-center gap-4 font-display text-[17px] italic text-cream/85 lg:order-3">
            <span aria-hidden="true" className="hidden h-px w-10 bg-gold/60 lg:block" />
            {t.motto}
          </p>
        </div>
      </div>
    </footer>
  );
}
