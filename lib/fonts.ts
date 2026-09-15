import localFont from "next/font/local";

// Self-hosted woff2 (SIL OFL 1.1), bundled in app/fonts. No CDN fetch at build time.
export const displayFont = localFont({
  src: [
    { path: "../app/fonts/cormorant-garamond-latin-wght-normal.woff2", weight: "300 700", style: "normal" },
    { path: "../app/fonts/cormorant-garamond-latin-wght-italic.woff2", weight: "300 700", style: "italic" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const textFont = localFont({
  src: [
    { path: "../app/fonts/eb-garamond-latin-wght-normal.woff2", weight: "400 800", style: "normal" },
    { path: "../app/fonts/eb-garamond-latin-wght-italic.woff2", weight: "400 800", style: "italic" },
  ],
  variable: "--font-text",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const fontVariables = `${displayFont.variable} ${textFont.variable}`;
