// End-to-end form check against the production build (run `npm run build` first).
//   npm run check:forms
// Starts a local mock of the Resend API and of Cloudflare Turnstile (script + siteverify), then runs
// `next start` in several configurations and drives both forms in both languages through a real browser.
//
// Captcha absent (no TURNSTILE_* keys):
//   validation   empty submit and a bad email render inline field errors
//   success      a valid submit renders the success state; the email reaches Resend with the env
//                recipient, a sender on the site domain, Reply-To = submitter, text + escaped HTML;
//                the server logs that captcha is unconfigured and no captcha script is loaded
//   failure      Resend returning 500 renders the failure state: typed values kept, no email address,
//                a retry that sends once the provider is back
//   honeypot     a filled honeypot shows success but sends nothing
//   rate limit   repeated sends from one IP render the limited state
//   stale        a submission whose Server Action is gone (a deploy happened while the tab was open),
//                and one that fails outright, both render the "refresh the page" notice in the page
//                language, with no error text, and the refresh brings the typed values back
// Captcha present (keys set, Turnstile mocked):
//   the widget loads only once the form is used; the token reaches siteverify with the secret before
//   anything is sent; a rejected token, a token for the other form and an unreachable siteverify each
//   render the failure state and send nothing; an interactive challenge shows in the captcha slot;
//   the secret never reaches the page
// Captcha live (Cloudflare's published test keys, real script and siteverify; skipped when offline):
//   an always-pass key sends, an always-fail secret renders the failure state and sends nothing
// Every state keeps its text at 4.5:1 or better, and no state ever shows an email address.
// CHECK_ARTIFACTS_DIR=path saves screenshots of each state and the rendered email HTML.
// FORMS_ONLY=absent,mocked,live limits the configurations while iterating; the full check runs all three.
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { join } from "node:path";
import { foregroundPage, openBrowser } from "./lib/browser.mjs";
import { measureContrast } from "./lib/contrast.mjs";
import { root } from "./lib/site.mjs";

const TEST_KEY = "re_test_balzac_groupe_check";
const RECIPIENT = "inbox@example.test";
const RATE_LIMIT = 8;
const MOCK_SITE_KEY = "0x_mock_site_key_balzac";
const MOCK_SECRET = "0x_mock_secret_balzac_never_rendered";
// Cloudflare's documented Turnstile testing keys.
const CF_PASS_SITE_KEY = "1x00000000000000000000AA";
const CF_PASS_SECRET = "1x0000000000000000000000000000000AA";
const CF_FAIL_SECRET = "2x0000000000000000000000000000000AA";
const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const CONFIGS = process.env.FORMS_ONLY ? process.env.FORMS_ONLY.split(",") : ["absent", "mocked", "live"];
const artifacts = process.env.CHECK_ARTIFACTS_DIR;
if (artifacts) mkdirSync(artifacts, { recursive: true });

const failures = [];
const passes = [];
const skipped = [];
let step = "start";
const started = Date.now();
const trace = process.env.CHECK_TRACE ? (msg) => console.log(`  . ${((Date.now() - started) / 1000).toFixed(1)}s ${msg}`) : () => {};
const expect = (ok, label) => (ok ? passes.push(label) : failures.push(label));

// Mock Resend API and Turnstile
const received = [];
const verifications = [];
const scriptLoads = [];
let resendMode = "ok";
let verifyMode = "pass";
let widgetMode = "invisible";

const MOCK_TURNSTILE = (mode) => `
window.turnstile = (function () {
  var n = 0, timers = {};
  return {
    render: function (el, o) {
      var id = "mock" + (++n);
      (window.__turnstileRenders = window.__turnstileRenders || []).push({ sitekey: o.sitekey, action: o.action, language: o.language, appearance: o.appearance, size: o.size });
      var issue = function () { o.callback("mock-token-" + o.action + "-" + n); };
      if (${JSON.stringify(mode)} === "interactive") {
        o["before-interactive-callback"] && o["before-interactive-callback"]();
        var box = document.createElement("div");
        box.setAttribute("data-mock-widget", "");
        box.style.cssText = "width:" + (o.size === "compact" ? 150 : 300) + "px;height:65px;border:1px solid #d8cebb;background:#fafafa";
        el.appendChild(box);
        timers[id] = setTimeout(function () { o["after-interactive-callback"] && o["after-interactive-callback"](); issue(); }, 1500);
      } else {
        timers[id] = setTimeout(issue, 150);
      }
      return id;
    },
    remove: function (id) { clearTimeout(timers[id]); }
  };
})();`;

const mock = createServer((req, res) => {
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    if (req.method === "POST" && req.url === "/emails") {
      if (resendMode === "fail") {
        res.writeHead(500, { "content-type": "application/json" });
        res.end(JSON.stringify({ statusCode: 500, name: "application_error", message: "Mock outage" }));
        return;
      }
      received.push({ auth: req.headers.authorization, payload: JSON.parse(body) });
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ id: `mock_${received.length}` }));
      return;
    }
    if (req.method === "GET" && req.url.startsWith("/turnstile.js")) {
      scriptLoads.push(req.url);
      res.writeHead(200, { "content-type": "text/javascript", "cache-control": "no-store", "access-control-allow-origin": "*" });
      res.end(MOCK_TURNSTILE(widgetMode));
      return;
    }
    if (req.method === "POST" && req.url === "/siteverify") {
      const params = Object.fromEntries(new URLSearchParams(body));
      verifications.push(params);
      if (verifyMode === "down") {
        res.writeHead(502, { "content-type": "text/html" });
        res.end("<html>Bad gateway</html>");
        return;
      }
      const action = (params.response || "").replace(/^mock-token-/, "").replace(/-\d+$/, "");
      const reply =
        verifyMode === "reject"
          ? { success: false, "error-codes": ["invalid-input-response"] }
          : { success: true, action: verifyMode === "wrong-action" ? (action === "contact" ? "franchise" : "contact") : action, hostname: "localhost" };
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(reply));
      return;
    }
    res.writeHead(404).end();
  });
});
await new Promise((r) => mock.listen(0, "127.0.0.1", r));
const mockUrl = `http://127.0.0.1:${mock.address().port}`;

/** A `next start` on a free port with the given env, stopped by the returned function. */
async function startSite(env) {
  const port = 3900 + Math.floor(Math.random() * 90);
  const base = `http://127.0.0.1:${port}`;
  const server = spawn(process.execPath, [join(root, "node_modules/next/dist/bin/next"), "start", "-p", String(port)], {
    cwd: root,
    env: {
      ...process.env,
      RESEND_API_KEY: TEST_KEY,
      RESEND_BASE_URL: mockUrl,
      CONTACT_TO_EMAIL: RECIPIENT,
      RESEND_FROM_EMAIL: "",
      TURNSTILE_SITE_KEY: "",
      TURNSTILE_SECRET_KEY: "",
      TURNSTILE_VERIFY_URL: "",
      TURNSTILE_SCRIPT_URL: "",
      FORM_RATE_LIMIT: String(RATE_LIMIT),
      ...env,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const site = { base, log: "", stop: () => server.kill() };
  server.stdout.on("data", (d) => (site.log += d));
  server.stderr.on("data", (d) => (site.log += d));
  const deadline = Date.now() + 30000;
  for (;;) {
    try {
      if ((await fetch(base)).ok) break;
    } catch {}
    if (Date.now() > deadline) {
      server.kill();
      throw new Error(`next start did not come up on ${base}\n${site.log}`);
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  return site;
}

const forms = [
  { kind: "contact", slug: "contact", fields: ["name", "email", "subject", "message"], extra: { subject: "Une question sur la galerie" } },
  { kind: "franchise", slug: "franchise", fields: ["name", "email", "location", "message"], extra: { location: "Lyon, France" } },
];
const valuesFor = (form, locale) => ({
  name: "Camille Durand",
  email: "camille@example.test",
  ...form.extra,
  message: `Bonjour, <b>test</b> & message de vérification (${locale}).`,
});
const pathFor = (form, locale) => `${locale === "fr" ? "/fr" : ""}/${form.slug}`;

const { browser, close } = await openBrowser();
let site = null;
try {
  const page = await foregroundPage(browser);
  page.setDefaultTimeout(20000);
  await page.setViewport({ width: 1280, height: 1000, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  if (process.env.CHECK_TRACE) {
    page.on("console", (msg) => trace(`console.${msg.type()}: ${msg.text()}`));
    page.on("pageerror", (error) => trace(`pageerror: ${error.message}`));
    page.on("requestfailed", (req) => trace(`requestfailed: ${req.url()} ${req.failure()?.errorText}`));
  }

  const snap = async (name) => {
    if (!artifacts) return;
    step = `snapshot ${name}`;
    trace(step);
    // Best effort: artifacts never decide the result.
    const capture = (async () => {
      const box = await page.evaluate(() => {
        const node = document.querySelector("[data-form-state], form[data-form]")?.closest("section");
        if (!node) return null;
        node.scrollIntoView({ block: "start" });
        const r = node.getBoundingClientRect();
        return { x: 0, y: r.top + window.scrollY, width: document.documentElement.clientWidth, height: Math.min(r.height, 2400) };
      });
      if (box) await page.screenshot({ path: join(artifacts, `${name}.png`), clip: box, captureBeyondViewport: true });
    })();
    await Promise.race([capture.catch(() => {}), new Promise((r) => setTimeout(r, 10000))]);
  };
  const open = async (path) => {
    step = `open ${path}`;
    trace(step);
    await page.bringToFront();
    await page.goto(site.base + path, { waitUntil: "networkidle0" });
    // DOM mutation polling: unlike timers it is not throttled if the tab loses visibility.
    await page.waitForFunction(() => Boolean(document.querySelector("[data-form-ready]")), { timeout: 15000, polling: "mutation" });
    // Contrast is measured against the hero photo, so it must be decoded first.
    await page.evaluate(() =>
      Promise.all(
        [...document.images].map((img) => {
          img.loading = "eager";
          return Promise.race([img.decode().catch(() => {}), new Promise((r) => setTimeout(r, 4000))]);
        }),
      ),
    );
  };
  const fill = async (kind, values) => {
    for (const [field, value] of Object.entries(values)) {
      const selector = `#${kind}-${field}`;
      await page.$eval(selector, (el) => (el.value = ""));
      await page.type(selector, value);
    }
  };
  const waitNonce = (nonce, timeout = 30000) =>
    page.waitForFunction((n) => Number(document.querySelector("[data-form-nonce]")?.dataset.formNonce ?? 0) > n, { timeout, polling: "mutation" }, nonce);
  const captchaStatus = async (kind) => {
    await page.waitForFunction((k) => document.querySelector(`form[data-form="${k}"]`)?.dataset.captcha !== "pending", { timeout: 15000, polling: "mutation" }, kind);
    return page.$eval(`form[data-form="${kind}"]`, (el) => el.dataset.captcha);
  };
  const currentNonce = () => page.evaluate(() => Number(document.querySelector("[data-form-nonce]")?.dataset.formNonce ?? 0));
  const assertState = async (tag, state) => {
    const got = await page.evaluate(() => document.querySelector("[data-form-state]")?.dataset.formState ?? "idle");
    if (got !== state) throw new Error(`expected the ${state} state, got ${got}`);
    const { failures: low } = await measureContrast(page);
    expect(low.length === 0, `${tag} ${state} state: all text at 4.5:1 or better${low.length ? ` (${low.slice(0, 3).join("; ")})` : ""}`);
  };
  const submitAndWait = async (kind, state, tag = kind, timeout) => {
    step = `submit ${tag} expecting ${state}`;
    trace(step);
    const nonce = await currentNonce();
    await page.click(`form[data-form="${kind}"] button[type="submit"]`);
    await waitNonce(nonce, timeout);
    await assertState(tag, state);
  };
  const noEmailShown = async (tag) => {
    const shown = await page.evaluate(
      (source) => {
        const re = new RegExp(source, "i");
        const panel = document.querySelector("[data-form-nonce]");
        const alert = document.querySelector('[data-form-state="error"], [data-form-state="limited"]');
        return {
          address: re.test(alert?.textContent || ""),
          mailto: Boolean(panel?.querySelector('a[href^="mailto:"]')),
          pending: Boolean(document.querySelector("[data-pending]")),
          retry: Boolean(alert?.querySelector("[data-form-retry]")),
        };
      },
      EMAIL_PATTERN.source,
    );
    expect(!shown.address && !shown.mailto && !shown.pending, `${tag}: failure state shows no email address and no placeholder`);
    return shown;
  };

  // ---------------------------------------------------------------- captcha absent
  if (CONFIGS.includes("absent")) {
  site = await startSite({});
  for (const form of forms) {
    for (const locale of ["en", "fr"]) {
      const path = pathFor(form, locale);
      const tag = `${form.kind} ${locale}`;

      // Validation: empty submit
      await open(path);
      await submitAndWait(form.kind, "invalid", tag);
      const emptyErrors = await page.$$eval("[data-field-error]", (els) => els.map((e) => e.dataset.fieldError));
      expect(form.fields.every((f) => emptyErrors.includes(f)), `${tag}: empty submit shows an error on every field`);
      const invalidAria = await page.$$eval(`form[data-form="${form.kind}"] [aria-invalid="true"]`, (els) => els.length);
      expect(invalidAria === form.fields.length, `${tag}: invalid fields carry aria-invalid`);
      await snap(`${form.kind}-${locale}-validation`);

      // Validation: bad email only
      const values = valuesFor(form, locale);
      await fill(form.kind, { ...values, email: "camille-at-example" });
      expect((await captchaStatus(form.kind)) === "off", `${tag}: captcha is off without TURNSTILE_* keys`);
      await submitAndWait(form.kind, "invalid", tag);
      const emailErrors = await page.$$eval("[data-field-error]", (els) => els.map((e) => e.dataset.fieldError));
      expect(emailErrors.length === 1 && emailErrors[0] === "email", `${tag}: a bad email flags only the email field`);
      const kept = await page.$eval(`#${form.kind}-name`, (el) => el.value);
      expect(kept === values.name, `${tag}: values survive a validation round trip`);

      // Success
      const before = received.length;
      const logBefore = site.log.length;
      await fill(form.kind, values);
      await submitAndWait(form.kind, "success", tag);
      await snap(`${form.kind}-${locale}-success`);
      const mail = received[before];
      expect(received.length === before + 1 && mail, `${tag}: success sends exactly one email without captcha keys`);
      expect(/captcha is unconfigured/.test(site.log.slice(logBefore)), `${tag}: the server logs that captcha is unconfigured`);
      if (mail) {
        const p = mail.payload;
        expect(mail.auth === `Bearer ${TEST_KEY}`, `${tag}: request uses RESEND_API_KEY`);
        expect(Array.isArray(p.to) && p.to.length === 1 && p.to[0] === RECIPIENT, `${tag}: recipient comes from CONTACT_TO_EMAIL`);
        expect(/@balzacgroupe\.com>?$/.test(p.from), `${tag}: sender is on the site domain (${p.from})`);
        expect(p.reply_to === values.email, `${tag}: Reply-To is the submitter`);
        expect(p.subject.includes(values.name) && p.subject.includes(form.extra[form.fields[2]]), `${tag}: subject names the sender and topic`);
        expect(typeof p.text === "string" && p.text.includes(values.message), `${tag}: plain text template carries the message`);
        expect(p.html.includes("&lt;b&gt;test&lt;/b&gt; &amp; message") && !p.html.includes("<b>test</b>"), `${tag}: HTML template escapes user input`);
        expect(p.html.includes(`lang="${locale}"`), `${tag}: HTML template is in the submission language`);
        if (artifacts && locale === "fr") writeFileSync(join(artifacts, `${form.kind}-email.html`), p.html);
      }

      // Failure: provider outage, then retry once it is back
      await open(path);
      resendMode = "fail";
      await fill(form.kind, values);
      await submitAndWait(form.kind, "error", tag);
      const keptMessage = await page.$eval(`#${form.kind}-message`, (el) => el.value);
      expect(keptMessage === values.message, `${tag}: failure keeps the typed message`);
      const shown = await noEmailShown(tag);
      expect(shown.retry, `${tag}: failure offers a retry`);
      await snap(`${form.kind}-${locale}-failure`);
      resendMode = "ok";
      const beforeRetry = received.length;
      const nonce = await currentNonce();
      await page.click("[data-form-retry]");
      await waitNonce(nonce);
      await assertState(`${tag} retry`, "success");
      expect(received.length === beforeRetry + 1, `${tag}: retry sends the kept message once`);
    }

    // Honeypot (once per form)
    await open(`/${form.slug}`);
    const before = received.length;
    await fill(form.kind, { name: "Bot", email: "bot@example.test", ...form.extra, message: "Buy cheap things right now please" });
    await page.$eval('input[name="website"]', (el) => (el.value = "https://spam.example"));
    await submitAndWait(form.kind, "success");
    expect(received.length === before, `${form.kind}: honeypot submissions show success and send nothing`);
  }

  // Rate limit: contact has used 6 attempts (EN + FR: success, failure, retry); the limit counts attempts.
  let limited = false;
  for (let attempt = 0; attempt < RATE_LIMIT + 1 && !limited; attempt++) {
    await open("/contact");
    await fill("contact", { name: "Camille Durand", email: "camille@example.test", subject: "Relance", message: "Un message de plus pour tester la limite." });
    await page.click('form[data-form="contact"] button[type="submit"]');
    await waitNonce(0);
    limited = await page.evaluate(() => Boolean(document.querySelector('[data-form-state="limited"]')));
    if (limited) {
      const { failures: low } = await measureContrast(page);
      expect(low.length === 0, `contact limited state: all text at 4.5:1 or better${low.length ? ` (${low.slice(0, 3).join("; ")})` : ""}`);
      await noEmailShown("contact limited");
    }
  }
  expect(limited, `contact: repeated sends from one IP hit the rate limit (${RATE_LIMIT} per window)`);
  if (limited) await snap("contact-en-limited");
  // ---------------------------------------------------------------- stale deployment
  // Two ways a deploy breaks a tab that is already open: the action id is gone from the new build,
  // or the request fails outright while the server restarts. Neither may show an error page.
  for (const [slug, kind, locale, mode, refreshLabel] of [
    ["contact", "contact", "en", "unknown-action", "Refresh the page"],
    ["fr/franchise", "franchise", "fr", "request-failed", "Actualiser la page"],
  ]) {
    const tag = `${kind} ${locale} stale deploy (${mode})`;
    const form = forms.find((f) => f.kind === kind);
    const values = valuesFor(form, locale);
    step = tag;
    trace(step);
    await open(`/${slug}`);
    await fill(kind, values);

    await page.setRequestInterception(true);
    const intercept = (req) => {
      const headers = req.headers();
      if (!headers["next-action"]) return void req.continue();
      // An id from an older build: the server cannot map it to an action any more.
      if (mode === "unknown-action") return void req.continue({ headers: { ...headers, "next-action": "0".repeat(40) } });
      return void req.abort("connectionrefused");
    };
    page.on("request", intercept);
    try {
      await page.click(`form[data-form="${kind}"] button[type="submit"]`);
      await page.waitForSelector('[data-form-state="stale"]', { timeout: 20000 });
    } finally {
      page.off("request", intercept);
      await page.setRequestInterception(false);
    }

    const shown = await page.evaluate(() => {
      const notice = document.querySelector('[data-form-state="stale"]');
      return { text: (notice?.textContent || "").replace(/\s+/g, " ").trim(), body: (document.body.innerText || "").replace(/\s+/g, " ") };
    });
    expect(shown.text.includes(refreshLabel), `${tag}: the notice is in the page language ("${shown.text.slice(0, 60)}")`);
    expect(!/Application error|client-side exception|Failed to find Server Action|TypeError|Error:/i.test(shown.body), `${tag}: no error page and no raw error text`);
    expect(/Balzac/.test(shown.body), `${tag}: the page itself is still standing`);
    if (mode === "unknown-action") {
      // The form is still standing, so the text is still in front of the person who typed it.
      const keptBefore = await page.$eval(`#${kind}-message`, (el) => el.value);
      expect(keptBefore === values.message, `${tag}: the typed message is still in the field`);
    } else {
      // The submission threw: the boundary replaced the form, and the text is held for the reload.
      expect(!(await page.$(`form[data-form="${kind}"]`)), `${tag}: the broken form is replaced by the notice`);
    }
    const { failures: low } = await measureContrast(page);
    expect(low.length === 0, `${tag}: all text at 4.5:1 or better${low.length ? ` (${low[0]})` : ""}`);
    await snap(`${kind}-${locale}-stale-${mode}`);

    // The refresh reloads the page and puts the text back.
    await Promise.all([page.waitForNavigation({ waitUntil: "networkidle0", timeout: 20000 }), page.click("[data-form-refresh]")]);
    await page.waitForFunction(() => Boolean(document.querySelector("[data-form-restored]")), { timeout: 15000, polling: "mutation" });
    const restored = await page.evaluate((k, fieldNames) => Object.fromEntries(fieldNames.map((f) => [f, document.getElementById(`${k}-${f}`)?.value])), kind, form.fields);
    expect(
      form.fields.every((f) => restored[f] === values[f]),
      `${tag}: refreshing keeps every typed value`,
    );
    expect(!(await page.$('[data-form-state="stale"]')), `${tag}: the refreshed page is back to a working form`);
  }

  expect(scriptLoads.length === 0, "captcha absent: no captcha script is ever requested");
  site.stop();
  site = null;
  }

  // ---------------------------------------------------------------- captcha present (mocked Turnstile)
  if (CONFIGS.includes("mocked")) {
  site = await startSite({
    TURNSTILE_SITE_KEY: MOCK_SITE_KEY,
    TURNSTILE_SECRET_KEY: MOCK_SECRET,
    TURNSTILE_VERIFY_URL: `${mockUrl}/siteverify`,
    TURNSTILE_SCRIPT_URL: `${mockUrl}/turnstile.js`,
    FORM_RATE_LIMIT: "100",
  });
  for (const form of forms) {
    for (const locale of ["en", "fr"]) {
      const path = pathFor(form, locale);
      const tag = `${form.kind} ${locale} captcha`;
      const values = valuesFor(form, locale);

      await open(path);
      const loadsBefore = scriptLoads.length;
      await new Promise((r) => setTimeout(r, 400));
      expect(scriptLoads.length === loadsBefore, `${tag}: the captcha script waits until the form is used`);
      expect((await page.$eval(`form[data-form="${form.kind}"]`, (el) => el.dataset.captcha)) === "pending", `${tag}: captcha settings are not requested before the form is used`);

      // Success: token verified with the secret before the send
      verifyMode = "pass";
      widgetMode = "invisible";
      const before = received.length;
      const verifiedBefore = verifications.length;
      await fill(form.kind, values);
      expect((await captchaStatus(form.kind)) === "on", `${tag}: captcha is on with both keys`);
      expect(scriptLoads.length > loadsBefore, `${tag}: using the form loads the captcha`);
      const html = await page.content();
      expect(!html.includes(MOCK_SECRET), `${tag}: the secret key never reaches the page`);
      await submitAndWait(form.kind, "success", tag);
      const check = verifications[verifiedBefore];
      expect(Boolean(check) && check.secret === MOCK_SECRET && check.response?.startsWith(`mock-token-${form.kind}-`), `${tag}: the token reaches siteverify with the secret`);
      expect(received.length === before + 1, `${tag}: a verified submission sends exactly one email`);
      const render = await page.evaluate(() => (window.__turnstileRenders || [])[0]);
      expect(render?.sitekey === MOCK_SITE_KEY && render.action === form.kind && render.language === locale && render.appearance === "interaction-only", `${tag}: widget renders with the site key, form action, language and interaction-only`);
      expect(!/captcha is unconfigured/.test(site.log), `${tag}: no unconfigured warning when both keys are set`);

      // Rejected token, token for the other form, siteverify down: clean failure state, nothing sent
      for (const mode of locale === "en" ? ["reject", "wrong-action", "down"] : ["reject"]) {
        await open(path);
        verifyMode = mode;
        const sentBefore = received.length;
        await fill(form.kind, values);
        await submitAndWait(form.kind, "error", `${tag} ${mode}`);
        const reason = await page.$eval('[data-form-state="error"]', (el) => el.dataset.formReason);
        expect(reason === "captcha", `${tag} ${mode}: failure is attributed to the captcha`);
        expect(received.length === sentBefore, `${tag} ${mode}: nothing is sent`);
        const keptMessage = await page.$eval(`#${form.kind}-message`, (el) => el.value);
        expect(keptMessage === values.message, `${tag} ${mode}: typed values are kept`);
        const shown = await noEmailShown(`${tag} ${mode}`);
        expect(shown.retry, `${tag} ${mode}: failure offers a retry`);
        if (mode === "reject") await snap(`${form.kind}-${locale}-captcha-failure`);
        // Retry once the captcha passes again: a fresh widget issues a new token and the message goes.
        if (mode === "reject") {
          verifyMode = "pass";
          const sent = received.length;
          const nonce = await currentNonce();
          await page.click("[data-form-retry]");
          await waitNonce(nonce);
          await assertState(`${tag} retry`, "success");
          expect(received.length === sent + 1, `${tag}: retry after a captcha failure sends once`);
        }
      }
      verifyMode = "pass";
    }
  }

  // Interactive challenge: the slot shows with its label, stays inside the panel, and the send completes.
  for (const width of [1280, 320]) {
    widgetMode = "interactive";
    await page.setViewport({ width, height: 1000, deviceScaleFactor: 1 });
    await open("/fr/contact");
    const before = received.length;
    await fill("contact", valuesFor(forms[0], "fr"));
    await page.waitForSelector("[data-mock-widget]", { timeout: 10000 });
    const layout = await page.evaluate(() => {
      const slot = document.querySelector("[data-captcha-slot]");
      const panel = document.querySelector("[data-form-nonce]");
      const s = slot.getBoundingClientRect();
      const p = panel.getBoundingClientRect();
      return { inside: s.left >= p.left - 1 && s.right <= p.right + 1, overflow: document.documentElement.scrollWidth > innerWidth, label: slot.previousElementSibling?.textContent || "" };
    });
    expect(layout.inside && !layout.overflow && layout.label.length > 0, `contact fr captcha @${width}px: interactive challenge shows labelled inside the panel without overflow`);
    const { failures: low } = await measureContrast(page);
    expect(low.length === 0, `contact fr captcha @${width}px: challenge label at 4.5:1 or better${low.length ? ` (${low[0]})` : ""}`);
    if (width === 320) await snap("contact-fr-captcha-interactive-320");
    await submitAndWait("contact", "success", `contact fr interactive @${width}px`);
    expect(received.length === before + 1, `contact fr captcha @${width}px: sends after the challenge`);
  }
  widgetMode = "invisible";
  await page.setViewport({ width: 1280, height: 1000, deviceScaleFactor: 1 });
  site.stop();
  site = null;
  }

  // ---------------------------------------------------------------- captcha live (Cloudflare test keys)
  const online = CONFIGS.includes("live") && await fetch("https://challenges.cloudflare.com/turnstile/v0/api.js", { signal: AbortSignal.timeout(6000) })
    .then((r) => r.ok)
    .catch(() => false);
  if (!online) {
    if (CONFIGS.includes("live")) skipped.push("captcha live: challenges.cloudflare.com unreachable");
  } else {
    for (const [secret, expected] of [
      [CF_PASS_SECRET, "success"],
      [CF_FAIL_SECRET, "error"],
    ]) {
      site = await startSite({ TURNSTILE_SITE_KEY: CF_PASS_SITE_KEY, TURNSTILE_SECRET_KEY: secret, FORM_RATE_LIMIT: "100" });
      for (const [form, locale] of [
        [forms[0], "en"],
        [forms[1], "fr"],
      ]) {
        const tag = `${form.kind} ${locale} live captcha (${expected === "success" ? "pass" : "fail"} keys)`;
        await open(pathFor(form, locale));
        const before = received.length;
        await fill(form.kind, valuesFor(form, locale));
        await submitAndWait(form.kind, expected, tag, 45000);
        expect(received.length === before + (expected === "success" ? 1 : 0), `${tag}: ${expected === "success" ? "sends once" : "sends nothing"}`);
        if (expected === "error") await noEmailShown(tag);
      }
      site.stop();
      site = null;
    }
  }

  await page.close();
} catch (error) {
  failures.push(`crashed during "${step}": ${error.message}`);
  if (process.env.CHECK_TRACE && site) console.error(`--- server log tail ---\n${site.log.slice(-3000)}`);
} finally {
  site?.stop();
  await close();
  mock.closeAllConnections?.();
  mock.close();
}

if (failures.length) {
  console.error(`check:forms FAILED (${failures.length} of ${failures.length + passes.length})\n${failures.map((f) => `  ${f}`).join("\n")}`);
  process.exit(1);
}
console.log(
  `check:forms ok · ${passes.length} assertions · contact + franchise x EN + FR · captcha absent, mocked and live · validation, success, failure + retry, honeypot, rate limit, stale deploy, no email shown${skipped.length ? `\n  skipped: ${skipped.join("; ")}` : ""}`,
);
