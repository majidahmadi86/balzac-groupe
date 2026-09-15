// End-to-end form check against the production build (run `npm run build` first).
//   npm run check:forms
// Starts a local mock of the Resend API and a `next start` wired to it with a test key, then drives
// both forms in both languages through a real browser:
//   validation   empty submit and a bad email render inline field errors
//   success      a valid submit renders the success state; the email reaches Resend with the env
//                recipient, a sender on the site domain, Reply-To = submitter, text + escaped HTML
//   failure      Resend returning 500 renders the failure state, keeps the typed values, shows the fallback
//   honeypot     a filled honeypot shows success but sends nothing
//   rate limit   repeated sends from one IP render the limited state
//   contrast     every state (validation, success, failure, limited) keeps its text at 4.5:1 or better
// CHECK_ARTIFACTS_DIR=path saves screenshots of each state and the rendered email HTML.
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { join } from "node:path";
import { foregroundPage, openBrowser } from "./lib/browser.mjs";
import { measureContrast } from "./lib/contrast.mjs";
import { root } from "./lib/site.mjs";

const TEST_KEY = "re_test_balzac_groupe_check";
const RECIPIENT = "inbox@example.test";
const RATE_LIMIT = 5;
const artifacts = process.env.CHECK_ARTIFACTS_DIR;
if (artifacts) mkdirSync(artifacts, { recursive: true });

const failures = [];
const passes = [];
let step = "start";
const started = Date.now();
const trace = process.env.CHECK_TRACE ? (msg) => console.log(`  . ${((Date.now() - started) / 1000).toFixed(1)}s ${msg}`) : () => {};
const expect = (ok, label) => (ok ? passes.push(label) : failures.push(label));

// Mock Resend API
const received = [];
let mockMode = "ok";
const mock = createServer((req, res) => {
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    if (req.method === "POST" && req.url === "/emails") {
      if (mockMode === "fail") {
        res.writeHead(500, { "content-type": "application/json" });
        res.end(JSON.stringify({ statusCode: 500, name: "application_error", message: "Mock outage" }));
        return;
      }
      received.push({ auth: req.headers.authorization, payload: JSON.parse(body) });
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ id: `mock_${received.length}` }));
      return;
    }
    res.writeHead(404).end();
  });
});
await new Promise((r) => mock.listen(0, "127.0.0.1", r));
const mockUrl = `http://127.0.0.1:${mock.address().port}`;

// Next production server wired to the mock
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
    FORM_RATE_LIMIT: String(RATE_LIMIT),
  },
  stdio: ["ignore", "pipe", "pipe"],
});
let serverLog = "";
server.stdout.on("data", (d) => (serverLog += d));
server.stderr.on("data", (d) => (serverLog += d));

const stopAll = async () => {
  server.kill();
  mock.closeAllConnections?.();
  mock.close();
};

try {
  const deadline = Date.now() + 30000;
  for (;;) {
    try {
      if ((await fetch(base)).ok) break;
    } catch {}
    if (Date.now() > deadline) throw new Error(`next start did not come up on ${base}\n${serverLog}`);
    await new Promise((r) => setTimeout(r, 300));
  }

  const { browser, close } = await openBrowser();
  try {
    const page = await foregroundPage(browser);
    page.setDefaultTimeout(20000);
    await page.setViewport({ width: 1280, height: 1000, deviceScaleFactor: 1 });
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);

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
      await page.goto(base + path, { waitUntil: "networkidle0" });
      // DOM mutation polling: unlike timers it is not throttled if the tab loses visibility.
      await page.waitForFunction(() => Boolean(document.querySelector("[data-form-ready]")), { timeout: 15000, polling: "mutation" });
    };
    const fill = async (kind, values) => {
      for (const [field, value] of Object.entries(values)) {
        const selector = `#${kind}-${field}`;
        await page.$eval(selector, (el) => (el.value = ""));
        await page.type(selector, value);
      }
    };
    const submitAndWait = async (kind, state) => {
      step = `submit ${kind} expecting ${state}`;
      trace(step);
      const nonce = await page.evaluate(() => Number(document.querySelector("[data-form-nonce]")?.dataset.formNonce ?? 0));
      await page.click(`form[data-form="${kind}"] button[type="submit"]`);
      await page.waitForFunction(
        (n) => Number(document.querySelector("[data-form-nonce]")?.dataset.formNonce ?? 0) > n,
        { timeout: 15000, polling: "mutation" },
        nonce,
      );
      const got = await page.evaluate(() => document.querySelector("[data-form-state]")?.dataset.formState ?? "idle");
      if (got !== state) throw new Error(`expected the ${state} state, got ${got}`);
      const { failures: low } = await measureContrast(page);
      expect(low.length === 0, `${kind} ${state} state: all text at 4.5:1 or better${low.length ? ` (${low.slice(0, 3).join("; ")})` : ""}`);
    };

    const forms = [
      { kind: "contact", slug: "contact", fields: ["name", "email", "subject", "message"], extra: { subject: "Une question sur la galerie" } },
      { kind: "franchise", slug: "franchise", fields: ["name", "email", "location", "message"], extra: { location: "Lyon, France" } },
    ];

    for (const form of forms) {
      for (const locale of ["en", "fr"]) {
        const path = `${locale === "fr" ? "/fr" : ""}/${form.slug}`;
        const tag = `${form.kind} ${locale}`;

        // Validation: empty submit
        await open(path);
        await submitAndWait(form.kind, "invalid");
        const emptyErrors = await page.$$eval("[data-field-error]", (els) => els.map((e) => e.dataset.fieldError));
        expect(form.fields.every((f) => emptyErrors.includes(f)), `${tag}: empty submit shows an error on every field`);
        const invalidAria = await page.$$eval(`form[data-form="${form.kind}"] [aria-invalid="true"]`, (els) => els.length);
        expect(invalidAria === form.fields.length, `${tag}: invalid fields carry aria-invalid`);
        await snap(`${form.kind}-${locale}-validation`);

        // Validation: bad email only
        const values = {
          name: "Camille Durand",
          email: "camille@example.test",
          ...form.extra,
          message: `Bonjour, <b>test</b> & message de vérification (${locale}).`,
        };
        await fill(form.kind, { ...values, email: "camille-at-example" });
        await submitAndWait(form.kind, "invalid");
        const emailErrors = await page.$$eval("[data-field-error]", (els) => els.map((e) => e.dataset.fieldError));
        expect(emailErrors.length === 1 && emailErrors[0] === "email", `${tag}: a bad email flags only the email field`);
        const kept = await page.$eval(`#${form.kind}-name`, (el) => el.value);
        expect(kept === values.name, `${tag}: values survive a validation round trip`);

        // Success
        const before = received.length;
        await fill(form.kind, values);
        await submitAndWait(form.kind, "success");
        await snap(`${form.kind}-${locale}-success`);
        const mail = received[before];
        expect(received.length === before + 1 && mail, `${tag}: success sends exactly one email`);
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

        // Failure: provider outage
        await open(path);
        mockMode = "fail";
        await fill(form.kind, values);
        await submitAndWait(form.kind, "error");
        mockMode = "ok";
        const keptMessage = await page.$eval(`#${form.kind}-message`, (el) => el.value);
        expect(keptMessage === values.message, `${tag}: failure keeps the typed message`);
        const fallback = await page.$eval('[data-form-state="error"]', (el) => Boolean(el.querySelector('a[href^="mailto:"], [data-pending="GROUP_EMAIL"]')));
        expect(fallback, `${tag}: failure shows the group email fallback`);
        await snap(`${form.kind}-${locale}-failure`);
      }

      // Honeypot (once per form)
      await open(`/${form.slug}`);
      const before = received.length;
      await fill(form.kind, { name: "Bot", email: "bot@example.test", ...form.extra, message: "Buy cheap things right now please" });
      await page.$eval('input[name="website"]', (el) => (el.value = "https://spam.example"));
      await submitAndWait(form.kind, "success");
      expect(received.length === before, `${form.kind}: honeypot submissions show success and send nothing`);
    }

    // Rate limit: contact has used 2 sends (EN + FR success) and 2 failed attempts; the limit counts attempts.
    let limited = false;
    for (let attempt = 0; attempt < RATE_LIMIT + 1 && !limited; attempt++) {
      await open("/contact");
      await fill("contact", { name: "Camille Durand", email: "camille@example.test", subject: "Relance", message: "Un message de plus pour tester la limite." });
      await page.click('form[data-form="contact"] button[type="submit"]');
      await page.waitForFunction(() => Number(document.querySelector("[data-form-nonce]")?.dataset.formNonce ?? 0) > 0, { timeout: 15000, polling: "mutation" });
      limited = await page.evaluate(() => Boolean(document.querySelector('[data-form-state="limited"]')));
      if (limited) {
        const { failures: low } = await measureContrast(page);
        expect(low.length === 0, `contact limited state: all text at 4.5:1 or better${low.length ? ` (${low.slice(0, 3).join("; ")})` : ""}`);
      }
    }
    expect(limited, `contact: repeated sends from one IP hit the rate limit (${RATE_LIMIT} per window)`);
    if (limited) await snap("contact-en-limited");

    await page.close();
  } finally {
    await close();
  }
} catch (error) {
  failures.push(`crashed during "${step}": ${error.message}`);
  if (process.env.CHECK_TRACE) console.error(`--- server log tail ---
${serverLog.slice(-3000)}`);
} finally {
  await stopAll();
}

if (failures.length) {
  console.error(`check:forms FAILED (${failures.length} of ${failures.length + passes.length})\n${failures.map((f) => `  ${f}`).join("\n")}`);
  process.exit(1);
}
console.log(`check:forms ok · ${passes.length} assertions · contact + franchise x EN + FR · validation, success, failure, honeypot, rate limit`);
