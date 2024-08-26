/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'sidebar-hover': '#118c83',
        'background': '#F9F7F7',
        'secondary': '#DBE2EF',
        'button': '#3F72AF',
        'hover': '#112D4E',
      },
    },
  },
  plugins: [],
}

