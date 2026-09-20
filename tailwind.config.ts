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
        primary: {
          50: '#FFF7F2',
          100: '#FFEFE6',
          200: '#FFDEC9',
          300: '#FFC29E',
          400: '#FF9763',
          500: '#FF5A1F', // Signature warm vibrant saffron orange
          600: '#EA470C',
          700: '#C23508',
          800: '#9A2B0A',
          900: '#7C260D',
          DEFAULT: '#FF5A1F',
        },
        secondary: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        surface: {
          warm: '#FAF9F6',
          card: '#FFFFFF',
          dark: '#0A0D14',
          darkCard: '#121722',
          darkCardElevated: '#181F2E',
          darkBorder: '#232C3D',
        },
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        glow: '0 4px 20px -2px rgba(255, 90, 31, 0.30)',
        'glow-lg': '0 10px 30px -4px rgba(255, 90, 31, 0.40)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 4px 14px -2px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 18px 36px -6px rgba(0, 0, 0, 0.12), 0 6px 16px -2px rgba(0, 0, 0, 0.06)',
        premium: '0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
        float: '0 24px 48px -12px rgba(15, 23, 42, 0.18)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 2s infinite',
        'scale-spring': 'scaleSpring 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        scaleSpring: {
          '0%': { transform: 'scale(0.92)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
