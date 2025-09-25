/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        primary: "var(--primary)",
        details: "var(--details)",
      },
      fontFamily: {
        text: ["var(--font-text)"],
        title: ["var(--font-title)"],
        support: ["var(--font-support)"],
        logo: ["var(--font-logo)"],
      },
    },
  },
  plugins: [],
}