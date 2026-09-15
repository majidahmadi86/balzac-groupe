import type { ReactNode } from "react";

// Inline gate for <Reveal>: sets data-motion="on" before paint so revealed
// content can start hidden, and removes it again if JS never boots (fail-open).
const motionGateScript = `(function(){try{var s=document.currentScript,el=s&&s.parentElement;if(!el||!("IntersectionObserver" in window)||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;el.setAttribute("data-motion","on");setTimeout(function(){if(!window.__bzMotion)el.removeAttribute("data-motion")},3000)}catch(e){}})();`;

export function MotionScope({ children }: { children: ReactNode }) {
  return (
    // data-motion is set by the inline gate before hydration, so React must not flag it.
    <div className="flex flex-1 flex-col" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: motionGateScript }} />
      {children}
    </div>
  );
}
