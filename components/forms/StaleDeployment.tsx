"use client";

import { Component, type ReactNode } from "react";
import { getDictionary, type Locale } from "@/lib/i18n";

/**
 * A deploy replaces the Server Actions a page was built with. A tab left open across one posts to an
 * action that no longer exists: the request comes back as something the client cannot use, and without
 * this the whole page is replaced by a client-side exception.
 *
 * Two ways that failure arrives, both handled here:
 * - the action returns no usable state, which the form detects and renders as this notice;
 * - the submission throws inside the transition, which this boundary catches.
 *
 * Either way the person sees one short sentence, never an error message, and refreshing keeps
 * whatever they had typed.
 */

/** Typed values and submission flag, shared between the form and the boundary around it. */
export type FormTracker = { values: Record<string, string>; submitting: boolean };

export const storageKeyFor = (kind: string) => `balzac-form-${kind}`;

/** Keeps the typed values for the next page load, then reloads. */
export function refreshPreserving(kind: string, tracker: FormTracker) {
  try {
    sessionStorage.setItem(storageKeyFor(kind), JSON.stringify(tracker.values));
  } catch {
    // Private mode or blocked storage: the reload still fixes the page, the text is just not carried over.
  }
  window.location.reload();
}

export function StaleNotice({ locale, kind, tracker, className = "" }: { locale: Locale; kind: string; tracker: FormTracker; className?: string }) {
  const t = getDictionary(locale).forms.stale;
  return (
    <div role="alert" data-form-state="stale" className={`border-l-2 border-gold-dark bg-white px-5 py-4 ${className}`}>
      <p className="font-display text-[1.375rem] font-semibold leading-[1.2] text-navy">{t.title}</p>
      <p className="mt-2 text-[1rem] leading-[1.6] text-navy">{t.body}</p>
      <button
        type="button"
        onClick={() => refreshPreserving(kind, tracker)}
        data-form-refresh=""
        className="label-caps mt-3 inline-flex min-h-[44px] items-center text-[0.75rem] tracking-caps-sm text-navy underline decoration-navy/40 underline-offset-[6px] transition-colors duration-300 hover:decoration-navy"
      >
        {t.action}
      </button>
    </div>
  );
}

type BoundaryProps = { locale: Locale; kind: string; tracker: FormTracker; panel: string; label: ReactNode; children: ReactNode };

export class SubmissionBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    // Only a failed submission is treated as a stale deployment. Anything else is a real bug and is
    // left to the application error boundary, rather than hidden behind a "refresh the page" notice.
    if (!this.props.tracker.submitting) throw error;
    console.warn("[forms] submission failed, the page is probably older than the deployment:", error.message);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    const { locale, kind, tracker, panel, label } = this.props;
    return (
      <div data-contrast="" data-form-ready="" className={panel}>
        {label}
        <StaleNotice locale={locale} kind={kind} tracker={tracker} className="mt-6" />
      </div>
    );
  }
}
