import Link from "next/link";
import type { ReactNode } from "react";

type CtaVariant = "forest" | "cream" | "hero";

type CtaLinkProps = {
  href: string;
  children: ReactNode;
  variant?: CtaVariant;
  external?: boolean;
  newTabLabel?: string;
  className?: string;
};

const variants: Record<CtaVariant, string> = {
  forest: "bg-forest text-cream hover:bg-forest-900",
  cream: "bg-gold-light text-forest-900 hover:bg-cream-50",
  hero: "border border-gold/80 bg-forest-900/70 text-cream hover:border-gold-light hover:bg-forest-800",
};

export function CtaLink({ href, children, variant = "forest", external = false, newTabLabel, className = "" }: CtaLinkProps) {
  const classes = `group/cta label-caps inline-flex min-h-[3rem] max-w-full items-center gap-4 px-5 py-3.5 text-left leading-[1.45] tracking-caps-sm transition-colors duration-500 ease-editorial sm:px-7 sm:tracking-caps ${variants[variant]} ${className}`;

  const content = (
    <>
      <span>{children}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 16 10"
        className="h-2.5 w-4 shrink-0 transition-transform duration-500 ease-editorial group-hover/cta:translate-x-1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M0 5h15M11 1l4 4-4 4" />
      </svg>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
        {newTabLabel && <span className="sr-only">{newTabLabel}</span>}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
