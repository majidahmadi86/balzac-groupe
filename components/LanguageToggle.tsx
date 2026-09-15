import { type Locale } from "@/lib/i18n";
import { switchLocalePath } from "@/lib/routes";

type LanguageToggleProps = {
  locale: Locale;
  pathname: string;
  label: string;
  tone?: "light" | "dark";
  className?: string;
};

// Plain anchors on purpose: /fr and / are separate document trees
// (each with its own <html lang>), so a full document load is correct.
export function LanguageToggle({ locale, pathname, label, tone = "dark", className = "" }: LanguageToggleProps) {
  const options: Array<{ code: Locale; text: string }> = [
    { code: "en", text: "EN" },
    { code: "fr", text: "FR" },
  ];
  const idle = tone === "dark" ? "text-navy/45 hover:text-navy" : "text-cream/50 hover:text-cream";
  const current = tone === "dark" ? "text-navy" : "text-gold-light";
  const rule = tone === "dark" ? "bg-navy/25" : "bg-cream/30";

  return (
    <div role="group" aria-label={label} className={`flex items-center gap-3 ${className}`}>
      {options.map((o, idx) => (
        <span key={o.code} className="flex items-center gap-3">
          {idx > 0 && <span aria-hidden="true" className={`h-3 w-px ${rule}`} />}
          <a
            href={switchLocalePath(pathname, o.code)}
            hrefLang={o.code}
            lang={o.code}
            aria-current={o.code === locale ? "true" : undefined}
            className={`label-caps py-2 transition-colors duration-300 ${o.code === locale ? current : idle}`}
          >
            {o.text}
          </a>
        </span>
      ))}
    </div>
  );
}
