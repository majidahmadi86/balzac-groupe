"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { getDictionary, type Locale } from "@/lib/i18n";
import { isActive, mainNav, pathFor } from "@/lib/routes";
import { LanguageToggle } from "./LanguageToggle";
import { Plaque } from "./Plaque";
import { SocialLinks } from "./SocialLinks";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  const close = useCallback(() => setOpen(false), []);

  // Close whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Scroll lock, focus management, Escape, focus trap, auto close at desktop widths.
  useEffect(() => {
    const root = document.documentElement;
    if (!open) {
      if (wasOpen.current) {
        wasOpen.current = false;
        menuButtonRef.current?.focus({ preventScroll: true });
      }
      return;
    }
    wasOpen.current = true;

    // Compensate the classic scrollbar width so nothing shifts under the drawer.
    const scrollbar = window.innerWidth - root.clientWidth;
    const previousOverflow = root.style.overflow;
    const previousPadding = root.style.paddingRight;
    root.style.overflow = "hidden";
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;
    closeButtonRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusable = drawerRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const desktop = window.matchMedia("(min-width: 1024px)");
    const onDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onDesktop);
    return () => {
      root.style.overflow = previousOverflow;
      root.style.paddingRight = previousPadding;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open]);

  const mottoLines = t.motto.split(", ");

  return (
    <>
      <a
        href="#main"
        className="label-caps sr-only z-[60] bg-navy text-cream focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:inline-flex focus:min-h-[44px] focus:items-center focus:px-5"
      >
        {t.header.skip}
      </a>

      <header className="sticky top-0 z-40 border-b border-navy/10 bg-cream">
        <div className="site-gutter flex h-[76px] items-center justify-between gap-6 lg:h-[104px]">
          <Link href={pathFor(locale, "home")} aria-label={t.header.homeLink} className="block shrink-0">
            <Plaque className="block h-auto w-[172px] sm:w-[196px] lg:w-[212px] xl:w-[228px]" label={t.siteName} />
          </Link>

          <div className="hidden items-center gap-8 lg:flex xl:gap-10">
            <nav aria-label={t.header.primaryNav}>
              <ul className="flex items-center gap-6 xl:gap-8">
                {mainNav.map((page) => {
                  const active = isActive(pathname, locale, page);
                  return (
                    <li key={page}>
                      <Link
                        href={pathFor(locale, page)}
                        aria-current={active ? "page" : undefined}
                        className={`group/nav flex min-h-[44px] min-w-[44px] items-center justify-center text-[15px] leading-none tracking-[0.01em] transition-colors duration-300 ${
                          active ? "text-navy" : "text-navy/75 hover:text-navy"
                        }`}
                      >
                        <span
                          className={`relative after:absolute after:inset-x-0 after:-bottom-2 after:h-px after:origin-left after:bg-navy after:transition-transform after:duration-500 after:ease-editorial ${
                            active ? "after:scale-x-100" : "after:scale-x-0 group-hover/nav:after:scale-x-100"
                          }`}
                        >
                          {t.nav[page]}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <span aria-hidden="true" className="h-7 w-px bg-navy/20" />

            <LanguageToggle locale={locale} pathname={pathname} label={t.header.language} />

            <p className="hidden border-l border-navy/10 pl-8 font-display text-[17px] italic leading-[1.15] text-navy/80 xl:block">
              {mottoLines.map((line, idx) => (
                <span key={line} className="block">
                  {idx < mottoLines.length - 1 ? `${line},` : line}
                </span>
              ))}
            </p>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="site-drawer"
            aria-label={t.header.openMenu}
            className="-mr-2 flex flex-col items-center gap-[7px] px-2 py-2 text-navy lg:hidden"
          >
            <span aria-hidden="true" className="flex w-[26px] flex-col gap-[5px]">
              <span className="h-[2px] w-full bg-current" />
              <span className="h-[2px] w-full bg-current" />
              <span className="h-[2px] w-full bg-current" />
            </span>
            <span aria-hidden="true" className="label-caps text-[0.5625rem] tracking-caps-sm">
              {t.header.menu}
            </span>
          </button>
        </div>
      </header>

      <div
        id="site-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.header.primaryNav}
        aria-hidden={!open}
        className={`fixed inset-0 z-50 flex h-[100dvh] flex-col overflow-y-auto overscroll-contain bg-navy text-cream duration-500 ease-editorial lg:hidden ${
          // Visibility flips instantly on open (so focus can land) and waits for the fade on close.
          open ? "visible opacity-100 transition-opacity" : "invisible opacity-0 transition-[opacity,visibility]"
        }`}
      >
        <div className="site-gutter flex h-[76px] shrink-0 items-center justify-between border-b border-cream/10">
          <Link href={pathFor(locale, "home")} onClick={close} aria-label={t.header.homeLink} className="block">
            <Plaque className="block h-auto w-[172px] sm:w-[196px]" label={t.siteName} />
          </Link>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label={t.header.closeMenu}
            className="-mr-2 flex flex-col items-center gap-[7px] px-2 py-2 text-cream"
          >
            <span aria-hidden="true" className="relative block h-[18px] w-[26px]">
              <span className="absolute left-0 top-1/2 h-[2px] w-full rotate-45 bg-current" />
              <span className="absolute left-0 top-1/2 h-[2px] w-full -rotate-45 bg-current" />
            </span>
            <span aria-hidden="true" className="label-caps text-[0.5625rem] tracking-caps-sm">
              {t.header.close}
            </span>
          </button>
        </div>

        <nav aria-label={t.header.primaryNav} className="site-gutter flex-1 pt-4">
          <ul>
            {mainNav.map((page, idx) => {
              const active = isActive(pathname, locale, page);
              return (
                <li
                  key={page}
                  style={{ transitionDelay: open ? `${120 + idx * 45}ms` : "0ms" }}
                  className={`border-b border-cream/10 transition-[opacity,transform] duration-700 ease-editorial ${
                    open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  <Link
                    href={pathFor(locale, page)}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className="group flex items-baseline gap-5 py-[1.05rem]"
                  >
                    <span
                      aria-hidden="true"
                      className={`label-caps w-6 text-[0.625rem] ${active ? "text-gold-light" : "text-gold"}`}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`font-display text-[2.125rem] font-medium leading-none transition-colors duration-300 ${
                        active ? "text-gold-light" : "text-cream group-hover:text-gold-light"
                      }`}
                    >
                      {t.nav[page]}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          style={{ transitionDelay: open ? "420ms" : "0ms" }}
          className={`site-gutter shrink-0 pb-[max(2rem,env(safe-area-inset-bottom))] pt-10 transition-opacity duration-700 ease-editorial ${
            open ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center justify-between gap-6 border-t border-gold/40 pt-5">
            <LanguageToggle locale={locale} pathname={pathname} label={t.header.language} tone="light" />
            <SocialLinks label={t.footer.social} className="gap-2" itemClassName="text-cream/80 hover:text-gold-light" />
          </div>
          <p className="mt-6 font-display text-xl italic text-cream/80">{t.motto}</p>
          <p className="label-caps mt-3 text-[0.625rem] text-gold">{t.tagline}</p>
        </div>
      </div>
    </>
  );
}
