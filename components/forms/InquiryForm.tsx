"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { getCaptchaConfig, submitContact, submitFranchise } from "@/lib/form-actions";
import {
  CAPTCHA_FIELD,
  FORM_FIELDS_BY_KIND,
  HONEYPOT_FIELD,
  initialFormState,
  type FieldName,
  type FormKind,
  type FormState,
} from "@/lib/forms";
import { getDictionary, type Locale } from "@/lib/i18n";
import { StaleNotice, SubmissionBoundary, storageKeyFor, type FormTracker } from "./StaleDeployment";
import { useTurnstile } from "./useTurnstile";

const actions = { contact: submitContact, franchise: submitFranchise };

function SubmitButton({ label, pendingLabel, waiting }: { label: string; pendingLabel: string; waiting: boolean }) {
  const { pending: sending } = useFormStatus();
  // Waiting covers the moment the captcha token is still being issued, before the send itself.
  const pending = sending || waiting;
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="group/cta label-caps inline-flex min-h-[3rem] max-w-full items-center gap-4 bg-forest px-7 py-3.5 text-left leading-[1.45] tracking-caps-sm text-cream transition-colors duration-500 ease-editorial hover:bg-forest-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-dark focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 disabled:cursor-wait disabled:opacity-90 sm:tracking-caps"
    >
      <span>{pending ? pendingLabel : label}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 16 10"
        className={`h-2.5 w-4 shrink-0 transition-transform duration-500 ease-editorial ${pending ? "animate-pulse" : "group-hover/cta:translate-x-1.5"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M0 5h15M11 1l4 4-4 4" />
      </svg>
    </button>
  );
}

type InquiryFormProps = {
  kind: FormKind;
  locale: Locale;
  /** Caps label shown above the form, inside the panel. */
  label: string;
};

const PANEL = "border border-navy/15 bg-cream-50 px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10";

function PanelLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4">
      <p className="label-caps text-[0.75rem] tracking-caps-lg text-navy">{label}</p>
      <span aria-hidden="true" className="h-px flex-1 bg-gold/60" />
    </div>
  );
}

/** The form, inside a boundary that turns a submission lost to a deploy into a "refresh the page" notice. */
export function InquiryForm({ kind, locale, label }: InquiryFormProps) {
  // Written by the form on every keystroke, read by the boundary after the form has gone.
  const tracker = useRef<FormTracker>({ values: {}, submitting: false });
  return (
    <SubmissionBoundary locale={locale} kind={kind} tracker={tracker.current} panel={PANEL} label={<PanelLabel label={label} />}>
      <InquiryFormFields kind={kind} locale={locale} label={label} tracker={tracker.current} />
    </SubmissionBoundary>
  );
}

// The form as a framed cream panel: caps label, white fields with visible navy borders and a gold
// focus ring, all text at 4.5:1 or better (asserted by the responsive gate via data-contrast).
// No email address is ever shown: when a send fails, the only way forward is to try again.
function InquiryFormFields({ kind, locale, label, tracker }: InquiryFormProps & { tracker: FormTracker }) {
  const t = getDictionary(locale).forms;
  const [returned, formAction] = useFormState(actions[kind], initialFormState);
  // A submission whose action no longer exists on the server comes back as nothing usable.
  const stale = !returned || typeof returned.nonce !== "number";
  const lastGood = useRef<FormState>(initialFormState);
  if (!stale) lastGood.current = returned;
  const state = stale ? lastGood.current : returned;
  const statusRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const tokenRef = useRef<HTMLInputElement>(null);
  const tokenReady = useRef(false);
  const [waiting, setWaiting] = useState(false);
  // After a first submission the person is clearly using the form, so the next widget renders at once.
  const captcha = useTurnstile(getCaptchaConfig, { action: kind, language: locale, resetKey: state.nonce, eager: state.nonce > 0 });
  const fields = FORM_FIELDS_BY_KIND[kind];
  // Marks the form as interactive (hydrated), for progressive enhancement and the form checks.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  // Text kept across the refresh that a deploy forces. Written into the fields after mount, so the
  // markup React hydrates is still the one the server sent.
  useEffect(() => {
    let saved: Record<string, string> | null = null;
    try {
      const raw = sessionStorage.getItem(storageKeyFor(kind));
      if (raw) {
        sessionStorage.removeItem(storageKeyFor(kind));
        saved = JSON.parse(raw);
      }
    } catch {
      saved = null;
    }
    if (!saved) return;
    for (const [field, value] of Object.entries(saved)) {
      const input = document.getElementById(`${kind}-${field}`);
      if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) input.value = value;
    }
    tracker.values = { ...saved };
    formRef.current?.setAttribute("data-form-restored", "");
  }, [kind, tracker]);

  // The boundary needs the typed text after the form itself is gone.
  const trackValues = () => {
    const form = formRef.current;
    if (!form) return;
    for (const field of fields) {
      const input = form.elements.namedItem(field);
      if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) tracker.values[field] = input.value;
    }
  };
  useEffect(() => {
    tracker.submitting = false;
  }, [state, tracker]);

  // Move focus to the outcome so screen reader and keyboard users hear it.
  useEffect(() => {
    if (state.nonce === 0) return;
    if (state.status === "invalid") {
      const firstInvalid = fields.find((f) => state.errors[f]);
      if (firstInvalid) document.getElementById(`${kind}-${firstInvalid}`)?.focus();
    } else {
      statusRef.current?.focus();
    }
  }, [state, fields, kind]);

  // Unless captcha is known to be off, hold the submit until Turnstile has issued a token (or the
  // server has said captcha is off), then submit again with it.
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    trackValues();
    tracker.submitting = true;
    if (captcha.status === "off") return;
    if (tokenReady.current) {
      tokenReady.current = false;
      return;
    }
    event.preventDefault();
    if (waiting) return;
    const form = event.currentTarget;
    setWaiting(true);
    void captcha.getToken().then((token) => {
      if (tokenRef.current) tokenRef.current.value = token ?? "";
      setWaiting(false);
      tokenReady.current = true;
      // A form ignores requestSubmit while its own submit event is still being dispatched, and a token
      // that is already there resolves within that dispatch: submit again on the next task.
      setTimeout(() => form.requestSubmit(), 0);
    });
  };

  const retry = () => formRef.current?.requestSubmit();

  const panel = PANEL;
  const panelLabel = <PanelLabel label={label} />;

  if (!stale && state.status === "success") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        data-contrast=""
        data-form-state="success"
        data-form-nonce={state.nonce}
        data-form-ready={ready ? "" : undefined}
        className={`${panel} outline-none`}
      >
        {panelLabel}
        <h3 className="mt-8 font-display text-[1.875rem] font-semibold leading-[1.1] text-navy lg:text-[2.25rem]">{t.success[kind].title}</h3>
        <p className="mt-4 text-[1.0625rem] leading-[1.6] text-navy">
          {t.success[kind].body} <span className="font-medium">{state.values.email}</span>.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="label-caps mt-8 inline-flex min-h-[44px] items-center text-navy underline decoration-navy/40 underline-offset-[6px] transition-colors duration-300 hover:decoration-navy"
        >
          {t.success.again}
        </button>
      </div>
    );
  }

  return (
    <div data-contrast="" data-form-nonce={state.nonce} data-form-ready={ready ? "" : undefined} className={panel}>
      {panelLabel}

      {stale && <StaleNotice locale={locale} kind={kind} tracker={tracker} className="mt-6" />}

      {!stale && (state.status === "error" || state.status === "limited") && (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          data-form-state={state.status}
          data-form-reason={state.reason}
          className="mt-6 border-l-2 border-gold-dark bg-white px-5 py-4 outline-none"
        >
          <p className="font-display text-[1.375rem] font-semibold leading-[1.2] text-navy">
            {state.status === "error" ? t.failure.title : t.limited.title}
          </p>
          <p className="mt-2 text-[1rem] leading-[1.6] text-navy">{state.status === "error" ? t.failure.body : t.limited.body}</p>
          {state.status === "error" && (
            <button
              type="button"
              onClick={retry}
              data-form-retry=""
              className="label-caps mt-3 inline-flex min-h-[44px] items-center text-[0.75rem] tracking-caps-sm text-navy underline decoration-navy/40 underline-offset-[6px] transition-colors duration-300 hover:decoration-navy"
            >
              {t.failure.retry}
            </button>
          )}
        </div>
      )}

      {!stale && state.status === "invalid" && (
        <p role="alert" data-form-state="invalid" className="mt-6 border-l-2 border-gold-dark bg-white px-4 py-3 text-[1rem] font-medium text-navy">
          {t.invalid}
        </p>
      )}

      <form
        key={state.nonce}
        ref={formRef}
        action={formAction}
        onSubmit={onSubmit}
        onInput={trackValues}
        onFocusCapture={captcha.start}
        onPointerDownCapture={captcha.start}
        noValidate
        className="mt-7"
        data-form={kind}
        data-captcha={captcha.status}
      >
        <input type="hidden" name="locale" value={locale} />
        {/* No value prop: React would write it back over the token on the next render. */}
        <input ref={tokenRef} type="hidden" name={CAPTCHA_FIELD} />

        <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
          {fields.map((field, idx) => (
            <Field
              key={field}
              kind={kind}
              field={field}
              label={t.fields[field]}
              placeholder={field === "location" ? t.hints.location : undefined}
              wide={idx >= 2}
              state={state}
              errors={t.errors}
            />
          ))}
        </div>

        {/* Honeypot: hidden from people and assistive tech, tempting for bots. */}
        <div aria-hidden="true" className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
          <label htmlFor={`${kind}-${HONEYPOT_FIELD}`}>{t.honeypot}</label>
          <input id={`${kind}-${HONEYPOT_FIELD}`} type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>

        {/* Turnstile slot: empty and zero-height unless Cloudflare asks for an interaction. */}
        {captcha.status === "on" && (
          <div className={captcha.interactive ? "mt-8" : ""}>
            {captcha.interactive && <p className="label-caps mb-3 text-[0.75rem] tracking-caps-sm text-navy">{t.captcha}</p>}
            <div ref={captcha.slotRef} data-captcha-slot="" className="max-w-full overflow-hidden" />
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
          <SubmitButton label={t.submit[kind]} pendingLabel={t.submitting} waiting={waiting} />
          <p className="text-[0.9375rem] text-navy">{t.required}</p>
        </div>
      </form>
    </div>
  );
}

type FieldProps = {
  kind: FormKind;
  field: FieldName;
  label: string;
  placeholder?: string;
  wide: boolean;
  state: FormState;
  errors: ReturnType<typeof getDictionary>["forms"]["errors"];
};

function Field({ kind, field, label, placeholder, wide, state, errors }: FieldProps) {
  const id = `${kind}-${field}`;
  const error = state.errors[field];
  const border = error ? "border-2 border-gold-dark" : "border border-navy/60 hover:border-navy";
  const common = {
    id,
    name: field,
    defaultValue: state.values[field] ?? "",
    placeholder,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
    required: true,
    className: `mt-2 block w-full rounded-none bg-white px-4 text-[1.0625rem] text-navy placeholder:text-navy/70 transition-[border-color,box-shadow] duration-300 focus:border-gold-dark focus:outline-none focus:ring-2 focus:ring-gold-dark/70 ${border}`,
  };

  return (
    <div className={`min-w-0 ${wide ? "sm:col-span-2" : ""}`}>
      <label htmlFor={id} className="label-caps block text-[0.75rem] leading-[1.5] tracking-caps-sm text-navy">
        {label}
      </label>
      {field === "message" ? (
        <textarea {...common} rows={6} className={`${common.className} resize-y py-3 leading-[1.6]`} />
      ) : (
        <input
          {...common}
          type={field === "email" ? "email" : "text"}
          autoComplete={field === "name" ? "name" : field === "email" ? "email" : field === "location" ? "address-level2" : "off"}
          inputMode={field === "email" ? "email" : undefined}
          className={`${common.className} min-h-[3rem] py-2.5`}
        />
      )}
      {error && (
        <p id={`${id}-error`} data-field-error={field} className="mt-2 flex items-center gap-2 text-[0.9375rem] font-medium text-navy">
          <span aria-hidden="true" className="h-px w-3 shrink-0 bg-gold-dark" />
          {errors[error]}
        </p>
      )}
    </div>
  );
}
