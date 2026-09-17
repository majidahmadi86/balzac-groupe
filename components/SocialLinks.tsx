/**
 * The group's one social account. It is a single link on purpose, so it is set as a named link rather
 * than a lone floating glyph: the icon keeps its 44px target and the word carries the same caps as the
 * footer nav, which is what makes one mark read as a choice.
 */

/** Canonical profile URL. The address the client sent carried a personal session token (stkn) and utm
 * parameters, which expire and are not ours to publish: only the profile path is kept. */
export const INSTAGRAM_URL = "https://www.instagram.com/balzacgroupe";

type SocialLinksProps = {
  /** Sr-only note that the link opens a new tab, in the page language. */
  newTabLabel: string;
  className?: string;
  itemClassName?: string;
};

export function SocialLinks({ newTabLabel, className = "", itemClassName = "" }: SocialLinksProps) {
  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`label-caps inline-flex min-h-[44px] items-center gap-3 text-[0.6875rem] tracking-caps-sm transition-colors duration-300 ${itemClassName} ${className}`}
    >
      <span aria-hidden="true" className="block h-[22px] w-[22px]">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4.1" />
          <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      </span>
      <span>Instagram</span>
      <span className="sr-only"> {newTabLabel}</span>
    </a>
  );
}
