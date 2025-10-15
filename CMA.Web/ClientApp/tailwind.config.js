/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'tajawal': ['Tajawal', 'sans-serif'],
      },
      colors: {
        'primary': {
          DEFAULT: '#0891b2',
          'dark': '#0e7490',
        },
        'secondary': {
          DEFAULT: '#10b981',
        }
      }
    },
  },
  plugins: [],
}