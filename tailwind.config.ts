import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0B1120',
        cardBackground: '#111827',
        border: '#374151',
        textPrimary: '#F9FAFB',
        textSecondary: '#9CA3AF',
        primary: '#3B82F6',
        accent: '#3B82F6',
        destructive: '#EF4444',
        success: '#22C55E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;