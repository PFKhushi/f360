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
        primary: '#271A54', // Roxo Escuro
        secondary: '#482DA5', // Roxo Claro
        accent: '#FFB01C', // Amarelo
        neutral: '#D9D9D9', // Cinza
        'dark-purple': '#271A54',
        'dark-blackpurple': '#23174c',
        'light-purple': '#482DA5',
        'dark-yellow': '#FFB01C',
        'light-grey': '#D9D9D9',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      animation: {
        blink: 'blink 1s infinite',
      },
    },
  },
  plugins: [],
}
export default config
