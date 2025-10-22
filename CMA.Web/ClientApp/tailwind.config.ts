import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './**/*.{ts,tsx,js,jsx,html}',
    '!./wwwroot/**',
    '!./node_modules/**'
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        surface: '#1e293b',
        primary: {
          DEFAULT: '#0891b2',
          dark: '#0e7490',
        },
        secondary: {
          DEFAULT: '#10b981',
          dark: '#059669',
        },
        accent: {
          DEFAULT: '#8b5cf6',
          dark: '#7c3aed',
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      fontFamily: {
        tajawal: ["Tajawal", 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.2)',
      }
    }
  },
  plugins: [],
} satisfies Config
