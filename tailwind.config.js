/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#4cd7f6",
        "primary-container": "#06b6d4",
        "background": "#0b1326",
        "surface": "#121a2e",
        "surface-container": "#171f33",
        "surface-container-low": "#131b2e",
        "on-surface": "#dae2fd",
        "on-surface-variant": "#aeb9d4",
        "outline": "#3d494c",
        "secondary": "#adc6ff",
        "tertiary": "#d0bcff",
        "error": "#ffb4ab",
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        "full": "9999px",
      },
      spacing: {
        "xs": "8px",
        "md": "24px",
        "lg": "40px",
        "xl": "64px",
        "margin-desktop": "48px",
        "margin-mobile": "16px",
      },
      fontFamily: {
        "serif": ["DM Serif Display", "serif"],
        "sans": ["Inter", "sans-serif"],
        "mono": ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
