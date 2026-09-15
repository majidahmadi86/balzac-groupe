"use server";

import { headers } from "next/headers";
import { sendInquiry } from "./email";
import { HONEYPOT_FIELD, validateForm, type FormKind, type FormState } from "./forms";
import type { Locale } from "./i18n";
import { isRateLimited } from "./rate-limit";

function clientIp(): string {
  const h = headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

async function handle(kind: FormKind, previous: FormState, formData: FormData): Promise<FormState> {
  const nonce = previous.nonce + 1;
  const locale: Locale = formData.get("locale") === "fr" ? "fr" : "en";
  const raw = Object.fromEntries(formData.entries());
  const { values, errors, valid } = validateForm(kind, raw);

  if (!valid) return { status: "invalid", errors, values, nonce };

  // Honeypot filled: behave as if it worked, send nothing.
  const trap = formData.get(HONEYPOT_FIELD);
  if (typeof trap === "string" && trap.trim() !== "") return { status: "success", errors: {}, values: { email: values.email }, nonce };

  if (isRateLimited(`${kind}:${clientIp()}`)) return { status: "limited", errors: {}, values, nonce };

  const result = await sendInquiry(kind, locale, values);
  if (!result.ok) return { status: "error", errors: {}, values, nonce };

  return { status: "success", errors: {}, values: { email: values.email }, nonce };
}

export async function submitContact(previous: FormState, formData: FormData): Promise<FormState> {
  return handle("contact", previous, formData);
}

export async function submitFranchise(previous: FormState, formData: FormData): Promise<FormState> {
  return handle("franchise", previous, formData);
}
