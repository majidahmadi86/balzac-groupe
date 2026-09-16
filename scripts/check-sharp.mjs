// Image optimization runs on sharp, in this build and on the server.
//   npm run build && npm run check:sharp
// Next only warns once, at the first optimized image, and then quietly serves a slower fallback, so
// this check makes that condition fail a run instead:
//   1. sharp resolves and its native binary really encodes (not just a package on disk)
//   2. sharp is a runtime dependency, not a dev one (a server installing with --omit=dev needs it)
//   3. package-lock.json carries the Linux x64 binaries, glibc and musl, so `npm ci` on the server
//      can install one; a lockfile without them is the usual reason a VPS ends up without sharp
//   4. .npmrc keeps optional dependencies in, whatever the server's own npm config says: sharp's
//      binary is an optional dependency, and --omit=optional installs sharp without it
//   5. a production server started from this build serves an optimized image and logs no sharp warning
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { root } from "./lib/site.mjs";

const require = createRequire(join(root, "package.json"));
const failures = [];
const passes = [];
const expect = (ok, label) => (ok ? passes.push(label) : failures.push(label));

// 1
let version = null;
try {
  const sharp = require("sharp");
  version = sharp.versions?.sharp ?? require("sharp/package.json").version;
  const pixels = Buffer.alloc(64 * 64 * 3, 128);
  const encoded = await sharp(pixels, { raw: { width: 64, height: 64, channels: 3 } })
    .resize(32)
    .webp()
    .toBuffer();
  expect(encoded.length > 0 && encoded.subarray(8, 12).toString("ascii") === "WEBP", `sharp ${version} encodes with its native binary`);
} catch (error) {
  expect(false, `sharp cannot be loaded here: ${String(error.message).split("\n")[0]}`);
}

// 2
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
expect(Boolean(pkg.dependencies?.sharp), "sharp is a runtime dependency");
expect(!pkg.devDependencies?.sharp, "sharp is not a dev dependency");

// 3
const lock = JSON.parse(readFileSync(join(root, "package-lock.json"), "utf8"));
for (const binary of ["@img/sharp-linux-x64", "@img/sharp-linuxmusl-x64"]) {
  const entry = lock.packages?.[`node_modules/${binary}`];
  expect(Boolean(entry?.resolved), `package-lock.json carries ${binary} for the server`);
}

// 4
const npmrc = readFileSync(join(root, ".npmrc"), "utf8");
expect(/^\s*include\s*=\s*optional\s*$/m.test(npmrc), ".npmrc keeps optional dependencies (sharp's binary) installed");

// 5
const port = 3800 + Math.floor(Math.random() * 90);
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, [join(root, "node_modules/next/dist/bin/next"), "start", "-p", String(port)], {
  cwd: root,
  env: { ...process.env, RESEND_API_KEY: "", CONTACT_TO_EMAIL: "" },
  stdio: ["ignore", "pipe", "pipe"],
});
let log = "";
server.stdout.on("data", (d) => (log += d));
server.stderr.on("data", (d) => (log += d));
try {
  const deadline = Date.now() + 30000;
  for (;;) {
    try {
      if ((await fetch(base)).ok) break;
    } catch {}
    if (Date.now() > deadline) throw new Error(`next start did not come up on ${base}\n${log}`);
    await new Promise((r) => setTimeout(r, 300));
  }

  // Optimize an image the site actually ships, at a size and quality no build step has cached.
  const html = await (await fetch(base)).text();
  const source = (html.match(/\/_next\/image\?url=([^&"]+)&/) || [])[1];
  expect(Boolean(source), "the homepage serves its photography through the image optimizer");
  const quality = 40 + Math.floor(Math.random() * 20);
  const res = await fetch(`${base}/_next/image?url=${source}&w=640&q=${quality}`, { headers: { accept: "image/webp,*/*" } });
  const type = res.headers.get("content-type") || "";
  expect(res.ok && type.startsWith("image/"), `an optimized image is served (${res.status} ${type})`);
  // Give the warning a moment to reach the log after the response.
  await new Promise((r) => setTimeout(r, 500));
  const warned = /sharp/i.test(log);
  expect(!warned, `the production server logs no sharp warning${warned ? `: ${log.split("\n").find((line) => /sharp/i.test(line))?.trim()}` : ""}`);
} catch (error) {
  failures.push(`crashed: ${error.message}`);
} finally {
  server.kill();
}

if (failures.length) {
  console.error(`check:sharp FAILED (${failures.length} of ${failures.length + passes.length})\n${failures.map((f) => `  ${f}`).join("\n")}`);
  process.exit(1);
}
console.log(`check:sharp ok · ${passes.length} assertions · sharp ${version} encodes here, ships to the server, and the production server optimizes images without falling back`);
