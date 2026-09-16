import "server-only";

// Cloudflare Turnstile on the Contact and Franchise forms.
// TURNSTILE_SITE_KEY (sent to the browser once a form is used) and TURNSTILE_SECRET_KEY (server only) come from the
// environment. Captcha is on only when both are set; otherwise forms keep working with the honeypot
// and the rate limit, and every submission logs that captcha is unconfigured.

// Read at request time, never at build time. TURNSTILE_VERIFY_URL and TURNSTILE_SCRIPT_URL exist for the
// form checks, which point them at a local mock.
const verifyUrl = () => process.env.TURNSTILE_VERIFY_URL || "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const scriptUrl = () => process.env.TURNSTILE_SCRIPT_URL || "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export type CaptchaClientConfig = { siteKey: string; scriptUrl: string } | null;

function keys() {
  const siteKey = process.env.TURNSTILE_SITE_KEY?.trim();
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  return siteKey && secret ? { siteKey, secret } : null;
}

/** What the browser needs to render the widget, or null while captcha is unconfigured. Never includes the secret. */
export function captchaClientConfig(): CaptchaClientConfig {
  const configured = keys();
  return configured ? { siteKey: configured.siteKey, scriptUrl: scriptUrl() } : null;
}

export type CaptchaResult =
  | { ok: true; verified: boolean }
  | { ok: false; reason: "missing" | "rejected" | "unreachable" };

export async function verifyCaptcha(token: unknown, ip: string, action: string): Promise<CaptchaResult> {
  const configured = keys();
  if (!configured) {
    console.warn(`[forms] ${action}: captcha is unconfigured (TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY not both set), sending without captcha`);
    return { ok: true, verified: false };
  }
  if (typeof token !== "string" || !token || token.length > 2048) return { ok: false, reason: "missing" };

  const body = new URLSearchParams({ secret: configured.secret, response: token });
  if (ip && ip !== "unknown") body.set("remoteip", ip);
  try {
    const res = await fetch(verifyUrl(), { method: "POST", body, signal: AbortSignal.timeout(8000), cache: "no-store" });
    const data = (await res.json()) as { success?: boolean; action?: string; "error-codes"?: string[] };
    if (!data.success) {
      console.warn(`[forms] ${action}: captcha rejected`, data["error-codes"] ?? []);
      return { ok: false, reason: "rejected" };
    }
    // A token minted for the other form is not accepted here.
    if (data.action && data.action !== action) {
      console.warn(`[forms] ${action}: captcha token was issued for "${data.action}"`);
      return { ok: false, reason: "rejected" };
    }
    return { ok: true, verified: true };
  } catch (error) {
    console.error(`[forms] ${action}: captcha verification failed`, error);
    return { ok: false, reason: "unreachable" };
  }
}
