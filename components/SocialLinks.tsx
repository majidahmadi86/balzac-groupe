type SocialLinksProps = {
  label: string;
  className?: string;
  itemClassName?: string;
};

const socials = [
  {
    name: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4.1" />
        <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full" fill="currentColor" fillRule="evenodd">
        <path d="M5 2.5h14A2.5 2.5 0 0 1 21.5 5v14a2.5 2.5 0 0 1-2.5 2.5H5A2.5 2.5 0 0 1 2.5 19V5A2.5 2.5 0 0 1 5 2.5Z M6.8 10h2.4v7.5H6.8Z M8 5.9a1.35 1.35 0 1 1 0 2.7a1.35 1.35 0 1 1 0-2.7Z M11 10h2.3v1.05c.45-.75 1.35-1.25 2.5-1.25 2 0 3.2 1.25 3.2 3.6v4.1h-2.4v-3.8c0-1.15-.5-1.8-1.45-1.8-.95 0-1.75.65-1.75 1.9v3.7H11Z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full" fill="currentColor" fillRule="evenodd">
        <path d="M5.3 5.5h13.4c1.8 0 3.3 1.4 3.3 3.2v6.6c0 1.8-1.5 3.2-3.3 3.2H5.3C3.5 18.5 2 17.1 2 15.3V8.7c0-1.8 1.5-3.2 3.3-3.2Z M10 9v6l5.2-3Z" />
      </svg>
    ),
  },
];

export function SocialLinks({ label, className = "", itemClassName = "" }: SocialLinksProps) {
  return (
    <ul aria-label={label} className={`flex items-center gap-6 ${className}`}>
      {socials.map((s) => (
        <li key={s.name}>
          <a
            href={s.href}
            aria-label={s.name}
            className={`block h-[22px] w-[22px] transition-colors duration-300 ${itemClassName}`}
          >
            {s.icon}
          </a>
        </li>
      ))}
    </ul>
  );
}
