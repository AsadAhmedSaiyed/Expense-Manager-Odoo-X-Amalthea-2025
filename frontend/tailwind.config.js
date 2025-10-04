/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'parchment': '#FFFBF5',
        'deep-teak': '#422D0B',
        'faded-khaki': '#967A53',
        'marigold': '#FFA800',
        'soft-saffron': '#FFC24A',
        'sandstone': '#E8DDCB',
      },
      fontFamily: {
        'sans': ['Montserrat', 'sans-serif'],
        'brand': ['Rajdhani', 'sans-serif'], // For your Asimovian-style font
      }
    },
  },
  plugins: [],
}
