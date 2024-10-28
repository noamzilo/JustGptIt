/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gpt-dark': '#343541',
        'gpt-dark-light': '#444654',
        'gpt-dark-input': '#40414f',
      },
    },
  },
  plugins: [],
}