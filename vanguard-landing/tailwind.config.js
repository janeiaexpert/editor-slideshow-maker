/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        podium: ['"FSP DEMO - PODIUM Sharp 4.11"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
