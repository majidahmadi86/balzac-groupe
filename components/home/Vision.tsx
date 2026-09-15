import type { ReactNode } from "react";
import { getDictionary, type Locale } from "@/lib/i18n";
import { Reveal } from "./Reveal";

export type PillarKey = "culture" | "heritage" | "artDeVivre" | "international";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  className: "mx-auto h-10 w-10 lg:h-11 lg:w-11",
};

export const pillarIcons: Record<PillarKey, ReactNode> = {
  // Open book
  culture: (
    <svg {...iconProps}>
      <path d="M12 6.6C10.2 5.3 7.6 4.6 4.5 4.6v12.6c3.1 0 5.7.7 7.5 2 1.8-1.3 4.4-2 7.5-2V4.6c-3.1 0-5.7.7-7.5 2Z" />
      <path d="M12 6.6v12.6" />
      <path d="M2.5 6.8v12.4c3.6 0 6.9.4 9.5 1.5 2.6-1.1 5.9-1.5 9.5-1.5V6.8" />
    </svg>
  ),
  // Classical monument
  heritage: (
    <svg {...iconProps}>
      <path d="M3.5 8.8 12 3.8l8.5 5Z" />
      <path d="M4.5 10.8h15" />
      <path d="M6.5 12.6v5.2M10 12.6v5.2M14 12.6v5.2M17.5 12.6v5.2" />
      <path d="M4.5 19.6h15M3 21.4h18" />
    </svg>
  ),
  // Leaf
  artDeVivre: (
    <svg {...iconProps}>
      <path d="M5.5 18.5C5.2 10.4 10.2 4.8 19.5 4.2c.3 9.4-5.3 14.6-14 14.3Z" />
      <path d="M5.5 18.5 14.5 9.5" />
      <path d="M5.5 18.5 3.5 20.5" />
    </svg>
  ),
  // Globe
  international: (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3c2.4 2.4 3.7 5.4 3.7 9s-1.3 6.6-3.7 9c-2.4-2.4-3.7-5.4-3.7-9S9.6 5.4 12 3Z" />
      <path d="M3 12h18M4.3 7.5h15.4M4.3 16.5h15.4" />
    </svg>
  ),
};

export const pillarOrder: PillarKey[] = ["culture", "heritage", "artDeVivre", "international"];

export function Vision({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).home.vision;

  return (
    <section aria-labelledby="vision-title" className="bg-cream py-16 text-navy sm:py-20 lg:py-28">
      <div className="site-gutter">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="label-caps tracking-caps-lg text-navy/80 lg:text-xs">{t.label}</p>
          <h2
            id="vision-title"
            className="mt-4 text-balance font-display text-[2rem] font-semibold leading-[1.08] sm:text-[2.5rem] lg:mt-5 lg:text-[3.25rem]"
          >
            {t.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-[1.0625rem] leading-[1.5] text-navy/85 lg:mt-6 lg:text-[1.1875rem]">
            {t.intro}
          </p>
        </Reveal>

        <ul className="mx-auto mt-12 grid max-w-6xl grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {pillarOrder.map((key, idx) => {
            const pillar = t.pillars[key];
            const borders = [
              idx % 2 === 1 ? "border-l" : "",
              idx >= 2 ? "border-t lg:border-t-0" : "",
              idx === 2 ? "lg:border-l" : "",
            ].join(" ");
            return (
              <li key={key} className={`border-navy/15 px-2 py-8 text-center sm:px-6 lg:py-3 ${borders}`}>
                <Reveal delay={idx * 90}>
                  <span className="block text-navy">{pillarIcons[key]}</span>
                  <h3 className="label-caps mt-5 tracking-caps-lg text-navy lg:text-xs">{pillar.title}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-[1.45] text-navy/85 lg:text-base">
                    {pillar.caption.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
