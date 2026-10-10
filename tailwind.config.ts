import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0a0a0f',
          50: '#16161f',
          100: '#101018',
        },
        amber: {
          DEFAULT: '#f59e0b',
          gold: '#fbbf24',
        },
      },
      fontFamily: {
        sans: [
          'var(--font-geist-sans)',
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'sans-serif',
        ],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        glow: '0 0 32px rgba(245, 158, 11, 0.25)',
        soft: '0 8px 32px rgba(0, 0, 0, 0.35)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(-6px)' },
          '50%': { transform: 'translateY(6px)' },
        },
        spinSlow: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
        float: 'float 3s ease-in-out infinite',
        'spin-slow': 'spinSlow 2.4s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
