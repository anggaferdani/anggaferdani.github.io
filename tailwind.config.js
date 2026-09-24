/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        ink: '#0a0a0a',
        paper: '#e7e7e7',
        muted: '#8a8a8a',
      },
    },
  },
};
