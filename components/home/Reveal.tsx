"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

type MotionWindow = Window & { __bzMotion?: boolean };

// Scroll reveal (fade and rise), after the Antiques pattern but fail-open:
// content is only hidden while the parent carries data-motion="on", which the
// inline gate in HomePage sets before paint and removes again if JS never boots.
export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    (window as MotionWindow).__bzMotion = true;
    const node = ref.current;
    if (!node) return;
    if (!("IntersectionObserver" in window)) {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal=""
      data-revealed={revealed ? "" : undefined}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </div>
  );
}

export const motionGateScript = `(function(){try{var s=document.currentScript,el=s&&s.parentElement;if(!el||!("IntersectionObserver" in window)||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;el.setAttribute("data-motion","on");setTimeout(function(){if(!window.__bzMotion)el.removeAttribute("data-motion")},3000)}catch(e){}})();`;
