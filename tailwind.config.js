/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#FAFAF8',
        'bg-alt': '#F2F0EC',
        navy: '#1A2B4A',
        amber: '#F59E0B',
        'amber-light': '#FEF3C7',
        'amber-dark': '#D97706',
        border: '#E5E5E3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['64px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-sm': ['48px', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-xs': ['40px', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '800' }],
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
