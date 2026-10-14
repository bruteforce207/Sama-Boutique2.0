/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#E8E4DD",
        signal: "#E63B2E",
        canvas: "#F5F3EE",
        ink: "#111111",
      },
      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"],
        serif: ["DM Serif Display", "serif"],
        mono: ["Space Mono", "monospace"],
      },
      borderRadius: {
        panel: "2rem",
      },
    },
  },
  plugins: [],
};
