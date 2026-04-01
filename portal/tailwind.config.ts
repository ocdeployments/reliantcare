import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1A2B4A',
          dark: '#0F1E35',
        },
        amber: {
          DEFAULT: '#F59E0B',
          light: '#FCD34D',
          dark: '#B45309',
          tint: '#FEF3C7',
        },
        royal: {
          DEFAULT: '#1E3A8A',
          light: '#2563EB',
        },
        warm: {
          white: '#FAFAF8',
        },
      },
    },
  },
  plugins: [],
}

export default config
