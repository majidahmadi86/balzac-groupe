"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { submitContact, submitFranchise } from "@/lib/form-actions";
import { FORM_FIELDS_BY_KIND, HONEYPOT_FIELD, initialFormState, type FieldName, type FormKind, type FormState } from "@/lib/forms";
import { getDictionary, type Locale } from "@/lib/i18n";

const actions = { contact: submitContact, franchise: submitFranchise };

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="group/cta label-caps inline-flex min-h-[3rem] max-w-full items-center gap-4 bg-forest px-7 py-3.5 text-left leading-[1.45] tracking-caps-sm text-cream transition-colors duration-500 ease-editorial hover:bg-forest-900 disabled:cursor-wait disabled:opacity-80 sm:tracking-caps"
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

function FallbackEmail({ email, pending }: { email: string | null; pending: string }) {
  if (!email) {
    return (
      <span data-pending="GROUP_EMAIL" className="border-b border-dotted border-gold-dark italic">
        {pending}
      </span>
    );
  }
  return (
    <a href={`mailto:${email}`} className="border-b border-navy/40 font-medium text-navy hover:border-navy">
      {email}
    </a>
  );
}

type InquiryFormProps = {
  kind: FormKind;
  locale: Locale;
  groupEmail: string | null;
};

export function InquiryForm({ kind, locale, groupEmail }: InquiryFormProps) {
  const t = getDictionary(locale).forms;
  const pendingEmail = locale === "fr" ? "adresse à confirmer" : "address to be confirmed";
  const [state, formAction] = useFormState(actions[kind], initialFormState);
  const statusRef = useRef<HTMLDivElement>(null);
  const fields = FORM_FIELDS_BY_KIND[kind];
  // Marks the form as interactive (hydrated), for progressive enhancement and the form checks.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

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

  if (state.status === "success") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        data-form-state="success"
        data-form-nonce={state.nonce}
        data-form-ready={ready ? "" : undefined}
        className="border border-navy/15 bg-cream-50 px-6 py-10 outline-none sm:px-10"
      >
        <span aria-hidden="true" className="block h-px w-14 bg-gold" />
        <h3 className="mt-6 font-display text-[1.875rem] font-semibold leading-[1.1] text-navy lg:text-[2.25rem]">{t.success[kind].title}</h3>
        <p className="mt-4 text-[1.0625rem] leading-[1.6] text-navy/85">
          {t.success[kind].body} <span className="font-medium text-navy">{state.values.email}</span>.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="label-caps mt-8 inline-flex min-h-[44px] items-center text-navy underline decoration-navy/30 underline-offset-[6px] transition-colors duration-300 hover:decoration-navy"
        >
          {t.success.again}
        </button>
      </div>
    );
  }

  const inputBase =
    "mt-2 block min-h-[48px] w-full rounded-none border-0 border-b bg-transparent px-0 py-3 text-[1.0625rem] text-navy placeholder:text-navy/40 focus:outline-none focus:ring-0 transition-colors duration-300";

  return (
    <div data-form-nonce={state.nonce} data-form-ready={ready ? "" : undefined}>
      {(state.status === "error" || state.status === "limited") && (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          data-form-state={state.status}
          className="mb-8 border-l-2 border-gold-dark bg-cream-50 px-5 py-5 outline-none sm:px-6"
        >
          <p className="font-display text-[1.375rem] font-semibold leading-[1.2] text-navy">
            {state.status === "error" ? t.failure.title : t.limited.title}
          </p>
          <p className="mt-2 text-[1rem] leading-[1.6] text-navy/85">
            {state.status === "error" ? t.failure.body : t.limited.body} <FallbackEmail email={groupEmail} pending={pendingEmail} />.
          </p>
        </div>
      )}

      {state.status === "invalid" && (
        <p role="alert" data-form-state="invalid" className="mb-6 border-l-2 border-gold-dark pl-4 text-[1rem] text-navy">
          {t.invalid}
        </p>
      )}

      <form key={state.nonce} action={formAction} noValidate className="space-y-7" data-form={kind}>
        <input type="hidden" name="locale" value={locale} />
        <p className="text-[0.9375rem] text-navy/70">{t.required}</p>

        <div className="grid gap-7 sm:grid-cols-2">
          {fields
            .filter((f) => f !== "message")
            .map((field) => (
              <Field key={field} kind={kind} field={field} label={t.fields[field]} hint={field === "location" ? t.hints.location : undefined} state={state} errors={t.errors} inputBase={inputBase} />
            ))}
        </div>

        <Field kind={kind} field="message" label={t.fields.message} state={state} errors={t.errors} inputBase={inputBase} />

        {/* Honeypot: hidden from people and assistive tech, tempting for bots. */}
        <div aria-hidden="true" className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
          <label htmlFor={`${kind}-${HONEYPOT_FIELD}`}>{t.honeypot}</label>
          <input id={`${kind}-${HONEYPOT_FIELD}`} type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>

        <div className="pt-2">
          <SubmitButton label={t.submit[kind]} pendingLabel={t.submitting} />
        </div>
      </form>
    </div>
  );
}

type FieldProps = {
  kind: FormKind;
  field: FieldName;
  label: string;
  hint?: string;
  state: FormState;
  errors: ReturnType<typeof getDictionary>["forms"]["errors"];
  inputBase: string;
};

function Field({ kind, field, label, hint, state, errors, inputBase }: FieldProps) {
  const id = `${kind}-${field}`;
  const error = state.errors[field];
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
  const border = error ? "border-gold-dark border-b-2" : "border-navy/30 focus:border-navy";
  const common = {
    id,
    name: field,
    defaultValue: state.values[field] ?? "",
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    required: true,
    className: `${inputBase} ${border}`,
  };

  return (
    <div className="min-w-0">
      <label htmlFor={id} className="label-caps block leading-[1.5] tracking-caps-sm text-navy/80">
        {label}
      </label>
      {field === "message" ? (
        <textarea {...common} rows={6} className={`${common.className} resize-y`} />
      ) : (
        <input
          {...common}
          type={field === "email" ? "email" : "text"}
          autoComplete={field === "name" ? "name" : field === "email" ? "email" : field === "location" ? "address-level2" : "off"}
          inputMode={field === "email" ? "email" : undefined}
        />
      )}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-[0.875rem] text-navy/60">
          {hint}
        </p>
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
