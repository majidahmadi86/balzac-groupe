"use server";

import { headers } from "next/headers";
import { captchaClientConfig, verifyCaptcha, type CaptchaClientConfig } from "./captcha";
import { sendInquiry } from "./email";
import { CAPTCHA_FIELD, HONEYPOT_FIELD, validateForm, type FormKind, type FormState } from "./forms";
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

  const ip = clientIp();
  if (isRateLimited(`${kind}:${ip}`)) return { status: "limited", errors: {}, values, nonce };

  // Turnstile token checked server-side before anything is sent. Unconfigured: logged, and the send goes ahead.
  const captcha = await verifyCaptcha(formData.get(CAPTCHA_FIELD), ip, kind);
  if (!captcha.ok) return { status: "error", reason: "captcha", errors: {}, values, nonce };

  const result = await sendInquiry(kind, locale, values);
  if (!result.ok) return { status: "error", reason: "delivery", errors: {}, values, nonce };

  return { status: "success", errors: {}, values: { email: values.email }, nonce };
}

/**
 * Turnstile settings for the browser, asked for when someone starts using a form. Read at request time,
 * so the pages stay static and the keys can change with a restart. Never includes the secret.
 */
export async function getCaptchaConfig(): Promise<CaptchaClientConfig> {
  return captchaClientConfig();
}

export async function submitContact(previous: FormState, formData: FormData): Promise<FormState> {
  return handle("contact", previous, formData);
}

export async function submitFranchise(previous: FormState, formData: FormData): Promise<FormState> {
  return handle("franchise", previous, formData);
}
