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
          'light': '#67e8f9',
        },
        'secondary': {
          DEFAULT: '#10b981',
          'dark': '#059669',
          'light': '#6ee7b7',
        },
        'accent': {
          DEFAULT: '#8b5cf6',
          'light': '#c4b5fd',
          'dark': '#7c3aed',
        },
        'success': {
          DEFAULT: '#10b981',
          'light': '#6ee7b7',
          'dark': '#059669',
        },
        'warning': {
          DEFAULT: '#f59e0b',
          'light': '#fcd34d',
          'dark': '#d97706',
        },
        'error': {
          DEFAULT: '#ef4444',
          'light': '#fca5a5',
          'dark': '#dc2626',
        },
        'background': {
          DEFAULT: '#0f172a',
          'light': '#1e293b',
          'dark': '#0c1221',
        },
        'surface': {
          DEFAULT: '#1e293b',
          'light': '#334155',
          'dark': '#0f172a',
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.2)',
        'glass-lg': '0 10px 20px rgba(0,0,0,0.3), 0 0 15px rgba(8, 145, 178, 0.3)',
        'inner-glass': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: 0, transform: 'translateX(-10px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}