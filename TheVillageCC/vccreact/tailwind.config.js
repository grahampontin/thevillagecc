/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        villageGreen: '#1d7a4b',
        villageGreenLight: '#e6f4ee',
        villageText: '#1f2933',
      },
      fontFamily: {
        // Keep template intent (Inter) but provide robust fallbacks.
        // Note: your public/index.html currently loads Source Sans Pro; feel free to swap the font link if you want Inter.
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      letterSpacing: {
        village: '0.2em',
      },
      rotate: {
        '-20': '-20deg',
      },
      aspectRatio: {
        '4/3': '4 / 3',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

