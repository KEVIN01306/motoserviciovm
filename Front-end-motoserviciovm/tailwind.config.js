/** @type {import('tailwindcss').Config} */
export default {
  // ESTO ES LO MÁS IMPORTANTE:
  darkMode: 'selector', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}