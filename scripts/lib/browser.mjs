import { spawn } from "node:child_process";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import puppeteer from "puppeteer-core";

const CANDIDATES = [
  process.env.BROWSER_PATH,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

/**
 * A headless Chromium for the check and asset scripts.
 * CDP_URL=http://127.0.0.1:9222 attaches to a running browser; otherwise a local
 * Chrome/Edge (or BROWSER_PATH) is started with a debugging port and attached to.
 */
export async function openBrowser() {
  if (process.env.CDP_URL) {
    const browser = await puppeteer.connect({ browserURL: process.env.CDP_URL });
    return { browser, close: () => browser.disconnect() };
  }

  const executable = CANDIDATES.find((path) => existsSync(path));
  if (!executable) throw new Error("No Chrome or Edge found. Set BROWSER_PATH or CDP_URL.");

  // Edge's launcher can exit right away and hand off to a child process, so
  // use a fixed port and poll it rather than waiting on the spawned process.
  const port = 9400 + Math.floor(Math.random() * 500);
  const profile = mkdtempSync(join(tmpdir(), "balzac-check-"));
  spawn(
    executable,
    ["--headless=new", "--disable-gpu", "--no-sandbox", "--no-first-run", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank"],
    { stdio: "ignore", detached: false },
  ).unref();

  const browserURL = `http://127.0.0.1:${port}`;
  const deadline = Date.now() + 20000;
  let browser;
  while (!browser) {
    try {
      browser = await puppeteer.connect({ browserURL });
    } catch (error) {
      if (Date.now() > deadline) throw new Error(`Browser did not start on ${browserURL}: ${error.message}`);
      await new Promise((r) => setTimeout(r, 250));
    }
  }

  return {
    browser,
    close: () => browser.close().catch(() => {}),
  };
}
