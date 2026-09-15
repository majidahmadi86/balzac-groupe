// Shared form contract for the Contact and Franchise forms: field lists,
// validation and the state returned by the server actions. No server-only code.

export type FormKind = "contact" | "franchise";
export type FieldName = "name" | "email" | "subject" | "location" | "message";
export type FieldError = "required" | "email" | "tooShort" | "tooLong";
export type FormStatus = "idle" | "success" | "invalid" | "error" | "limited";

export type FormValues = Partial<Record<FieldName, string>>;

export type FormState = {
  status: FormStatus;
  errors: Partial<Record<FieldName, FieldError>>;
  values: FormValues;
  /** Changes on every submission so the client can remount the form with the returned values. */
  nonce: number;
};

/** Scope-locked field sets. */
export const FORM_FIELDS_BY_KIND: Record<FormKind, readonly FieldName[]> = {
  contact: ["name", "email", "subject", "message"],
  franchise: ["name", "email", "location", "message"],
};

/** Hidden honeypot input name. Real people never fill it. */
export const HONEYPOT_FIELD = "website";

const LENGTH: Record<FieldName, { min: number; max: number }> = {
  name: { min: 2, max: 120 },
  email: { min: 3, max: 254 },
  subject: { min: 2, max: 160 },
  location: { min: 2, max: 160 },
  message: { min: 10, max: 5000 },
};

const EMAIL = /^[^\s@<>(),;:"]+@[^\s@<>(),;:"]+\.[^\s@<>(),;:"]{2,}$/;

export const initialFormState: FormState = { status: "idle", errors: {}, values: {}, nonce: 0 };

export function validateForm(kind: FormKind, raw: Record<string, unknown>) {
  const values: FormValues = {};
  const errors: FormState["errors"] = {};

  for (const field of FORM_FIELDS_BY_KIND[kind]) {
    const input = typeof raw[field] === "string" ? (raw[field] as string) : "";
    // Single-line fields never carry line breaks (they end up in email headers).
    const value = field === "message" ? input.replace(/\r\n/g, "\n").trim() : input.replace(/[\r\n]+/g, " ").trim();
    values[field] = value;

    const { min, max } = LENGTH[field];
    if (!value) errors[field] = "required";
    else if (field === "email" && !EMAIL.test(value)) errors[field] = "email";
    else if (value.length < min) errors[field] = "tooShort";
    else if (value.length > max) errors[field] = "tooLong";
  }

  return { values, errors, valid: Object.keys(errors).length === 0 };
}
