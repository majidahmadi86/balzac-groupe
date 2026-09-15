import type { ReactNode } from "react";
import { fontVariables } from "@/lib/fonts";
import { getDictionary, type Locale } from "@/lib/i18n";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

// Each language tree renders its own <html lang>.
export function LocaleDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  const t = getDictionary(locale);

  return (
    <html lang={t.htmlLang} className={fontVariables}>
      <body className="flex min-h-[100dvh] flex-col">
        <SiteHeader locale={locale} />
        <main id="main" className="flex flex-1 flex-col">
          {children}
        </main>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
