import "server-only";
import { Resend } from "resend";
import type { FieldName, FormKind, FormValues } from "./forms";
import { FORM_FIELDS_BY_KIND } from "./forms";
import type { Locale } from "./i18n";
import { SITE_DOMAIN } from "./legal";

// One email pipeline for both site forms.
// RESEND_API_KEY and CONTACT_TO_EMAIL come from the environment; RESEND_FROM_EMAIL is
// optional and must be an address on the domain verified in Resend.

const DEFAULT_FROM = `Groupe Balzac <site@${SITE_DOMAIN}>`;

const labels: Record<Locale, Record<FieldName, string> & { kind: Record<FormKind, string>; intro: string; reply: string; page: string }> = {
  en: {
    name: "Name",
    email: "Email",
    subject: "Subject",
    location: "City and country",
    message: "Message",
    kind: { contact: "Contact message", franchise: "Franchise enquiry" },
    intro: "A new message was sent from the website.",
    reply: "Reply to this email to answer directly.",
    page: "Sent from",
  },
  fr: {
    name: "Nom",
    email: "Email",
    subject: "Objet",
    location: "Ville et pays",
    message: "Message",
    kind: { contact: "Message de contact", franchise: "Demande franchise" },
    intro: "Un nouveau message a été envoyé depuis le site.",
    reply: "Répondez à cet email pour écrire directement à l’expéditeur.",
    page: "Envoyé depuis",
  },
};

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export function buildInquiryEmail(kind: FormKind, locale: Locale, values: FormValues) {
  const l = labels[locale];
  const fields = FORM_FIELDS_BY_KIND[kind].filter((f) => f !== "message");
  const origin = `${SITE_DOMAIN}${locale === "fr" ? "/fr" : ""}/${kind}`;
  const topic = kind === "contact" ? values.subject : values.location;
  const subject = `[${l.kind[kind]}] ${topic} · ${values.name}`;

  const text = [
    `${l.kind[kind]} · Groupe Balzac`,
    "",
    l.intro,
    "",
    ...fields.map((f) => `${l[f]}: ${values[f]}`),
    "",
    `${l.message}:`,
    values.message ?? "",
    "",
    "--",
    `${l.page} ${origin}`,
    l.reply,
  ].join("\n");

  const rows = fields
    .map(
      (f) => `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #e9e2d5;width:34%;vertical-align:top;font:600 11px/1.4 Georgia,'Times New Roman',serif;letter-spacing:2px;text-transform:uppercase;color:#1c3a48;">${escapeHtml(l[f])}</td>
        <td style="padding:10px 0;border-bottom:1px solid #e9e2d5;vertical-align:top;font:16px/1.5 Georgia,'Times New Roman',serif;color:#001824;">${escapeHtml(values[f] ?? "")}</td>
      </tr>`,
    )
    .join("");

  const html = `<!doctype html>
<html lang="${locale}">
<body style="margin:0;padding:0;background:#f4f0e9;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f0e9;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#faf8f4;border:1px solid #d8cebb;">
        <tr><td style="background:#001824;padding:22px 32px;text-align:center;border-bottom:3px double #b09a6a;">
          <div style="font:600 11px/1 Georgia,'Times New Roman',serif;letter-spacing:4px;color:#faf8f4;">GROUPE</div>
          <div style="font:600 30px/1.1 Georgia,'Times New Roman',serif;color:#faf8f4;margin-top:4px;">Balzac</div>
        </td></tr>
        <tr><td style="padding:30px 32px 8px;">
          <div style="font:600 11px/1.4 Georgia,'Times New Roman',serif;letter-spacing:3px;text-transform:uppercase;color:#8c774a;">${escapeHtml(l.kind[kind])}</div>
          <div style="font:600 24px/1.25 Georgia,'Times New Roman',serif;color:#001824;margin-top:8px;">${escapeHtml(topic ?? "")}</div>
          <div style="width:48px;height:1px;background:#b09a6a;margin:18px 0 6px;"></div>
          <p style="font:15px/1.6 Georgia,'Times New Roman',serif;color:#1c3a48;margin:12px 0 0;">${escapeHtml(l.intro)}</p>
        </td></tr>
        <tr><td style="padding:8px 32px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
        </td></tr>
        <tr><td style="padding:22px 32px 8px;">
          <div style="font:600 11px/1.4 Georgia,'Times New Roman',serif;letter-spacing:2px;text-transform:uppercase;color:#1c3a48;">${escapeHtml(l.message)}</div>
          <div style="font:16px/1.65 Georgia,'Times New Roman',serif;color:#001824;margin-top:10px;white-space:pre-wrap;">${escapeHtml(values.message ?? "")}</div>
        </td></tr>
        <tr><td style="padding:24px 32px 28px;">
          <div style="border-top:1px solid #e9e2d5;padding-top:16px;font:13px/1.6 Georgia,'Times New Roman',serif;color:#3a5563;">
            ${escapeHtml(l.reply)}<br>${escapeHtml(l.page)} ${escapeHtml(origin)}
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}

export type SendResult = { ok: true; id: string } | { ok: false; reason: "not_configured" | "provider_error" };

export async function sendInquiry(kind: FormKind, locale: Locale, values: FormValues): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error(`[forms] ${kind}: RESEND_API_KEY or CONTACT_TO_EMAIL is not set, message not sent`);
    return { ok: false, reason: "not_configured" };
  }

  const { subject, text, html } = buildInquiryEmail(kind, locale, values);
  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || DEFAULT_FROM,
      to: to.split(",").map((address) => address.trim()),
      replyTo: values.email,
      subject,
      text,
      html,
    });
    if (error || !data) {
      console.error(`[forms] ${kind}: Resend rejected the message`, error);
      return { ok: false, reason: "provider_error" };
    }
    return { ok: true, id: data.id };
  } catch (error) {
    console.error(`[forms] ${kind}: Resend request failed`, error);
    return { ok: false, reason: "provider_error" };
  }
}
