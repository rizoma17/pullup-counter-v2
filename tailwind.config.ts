import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)'
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem'
      }
    }
  },
  plugins: []
} satisfies Config;
