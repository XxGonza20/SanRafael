/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0F172A",
          light: "#1E293B",
          accent: "#38BDF8",
        },
      },
    },
  },
  plugins: [],
}
