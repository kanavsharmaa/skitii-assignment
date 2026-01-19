/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f4fc',
          100: '#c5e4f9',
          200: '#9ed2f5',
          300: '#77bff1',
          400: '#50adef',
          500: '#2d5a87',
          600: '#1e3a5f',
          700: '#152d4a',
          800: '#0c1f35',
          900: '#031020',
        },
        success: '#2e7d32',
        warning: '#f57c00',
        error: '#c2185b',
        hrv: {
          low: '#ef4444',
          normal: '#22c55e',
          high: '#3b82f6',
        }
      },
      spacing: {
        'touch-min': '48px',
        'touch-md': '60px',
        'touch-lg': '80px',
      },
      fontSize: {
        'body': '16px',
        'button': '18px',
        'heading': '24px',
      }
    },
  },
  plugins: [],
}
