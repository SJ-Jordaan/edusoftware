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
      },
    },
  },
  plugins: [],
};
