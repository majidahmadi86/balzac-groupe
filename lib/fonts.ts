import localFont from "next/font/local";

// Self-hosted woff2 (SIL OFL 1.1), bundled in app/fonts. No CDN fetch at build time.
// EB Garamond serves both the display headlines (semibold) and the text.
// Cormorant Garamond was dropped: its accent marks sit detached from the letters
// (même, caractère, Actualités), which is not acceptable for French copy.
export const textFont = localFont({
  src: [
    { path: "../app/fonts/eb-garamond-latin-wght-normal.woff2", weight: "400 800", style: "normal" },
    { path: "../app/fonts/eb-garamond-latin-wght-italic.woff2", weight: "400 800", style: "italic" },
  ],
  variable: "--font-text",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const fontVariables = textFont.variable;
