/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0f4ff',
          100: '#e0eaff',
          200: '#c7d9fe',
          300: '#a5bdfc',
          400: '#8196f8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        accent: {
          50:  '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl:  '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / .08), 0 1px 2px -1px rgb(0 0 0 / .06)',
        'card-hover': '0 8px 25px -5px rgb(0 0 0 / .12), 0 4px 10px -6px rgb(0 0 0 / .1)',
      },
      animation: {
        'fade-in':   'fadeIn .4s ease forwards',
        'slide-in':  'slideInLeft .3s ease forwards',
        shimmer:     'shimmer 1.5s infinite',
        'pulse-ring':'pulseRing 2s infinite',
      },
      keyframes: {
        fadeIn:     { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideInLeft:{ from: { opacity: '0', transform: 'translateX(-16px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        shimmer:    { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        pulseRing:  {
          '0%':   { transform: 'scale(.95)', boxShadow: '0 0 0 0 rgba(99,102,241,.4)' },
          '70%':  { transform: 'scale(1)',   boxShadow: '0 0 0 10px rgba(99,102,241,0)' },
          '100%': { transform: 'scale(.95)', boxShadow: '0 0 0 0 rgba(99,102,241,0)' },
        },
      },
    },
  },
  plugins: [],
}
