import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'scan-line': {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(calc(100% - 2px))' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'scan-line': 'scan-line 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config 