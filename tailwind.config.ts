import type { Config } from "tailwindcss";

// Palette sampled from docs/mockup-mobile.jpg and docs/mockup-desktop.jpg.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Deep navy: plaque, headlines, footer band.
        navy: {
          DEFAULT: "#001824",
          950: "#000f17",
          900: "#001824",
          800: "#0b2735",
          700: "#1c3a48",
          600: "#3a5563",
        },
        // Warm cream: page ground.
        cream: {
          DEFAULT: "#f4f0e9",
          50: "#faf8f4",
          100: "#f4f0e9",
          200: "#e9e2d5",
          300: "#d8cebb",
        },
        // Forest green: buttons and the Franchise band.
        forest: {
          DEFAULT: "#1f3626",
          950: "#081a13",
          900: "#0c221a",
          800: "#1f3626",
          700: "#2d4a36",
        },
        // Antique gold: plaque border and accents.
        gold: {
          DEFAULT: "#b09a6a",
          light: "#e0d1ae",
          dark: "#8c774a",
        },
      },
      fontFamily: {
        display: ["var(--font-text)", "Georgia", "Times New Roman", "serif"],
        serif: ["var(--font-text)", "Georgia", "Times New Roman", "serif"],
      },
      // Letterspacing scale for the small-caps label style.
      letterSpacing: {
        "caps-xs": "0.12em",
        "caps-sm": "0.18em",
        caps: "0.24em",
        "caps-lg": "0.32em",
        "caps-xl": "0.42em",
      },
      maxWidth: {
        site: "90rem",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
