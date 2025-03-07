/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      padding: {
        safe: 'env(safe-area-inset-bottom)',
      },
      colors: {
        logo: {
          primary: '#F6AE84',
        },
        gold: '#FFD700',
        silver: '#C0C0C0',
        bronze: '#CD7F32',
      },
      animation: {
        'slide-in': 'slide-in 0.75s ease-in-out forwards',
      },
      keyframes: {
        'slide-in': {
          '0%': {
            transform: 'translateY(100%)',
            opacity: 0,
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: 1,
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(24px) rotate(0deg)' },
          '100%': {
            transform: 'rotate(360deg) translateX(24px) rotate(-360deg)',
          },
        },
      },
    },
  },
  plugins: [],
};
