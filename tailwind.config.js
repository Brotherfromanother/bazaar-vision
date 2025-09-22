/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--bg))",
        surface: "hsl(var(--surface))",
        surface2: "hsl(var(--surface-2))",
        border: "hsl(var(--border))",
        text: "hsl(var(--text))",
        muted: "hsl(var(--muted))",
        accent: "hsl(var(--accent))",
        positive: "#4ade80",
        negative: "#f87171"
      },
      boxShadow: { soft: "0 6px 24px -12px rgba(0,0,0,.5)" },
      borderRadius: { xl2: "1rem" }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
