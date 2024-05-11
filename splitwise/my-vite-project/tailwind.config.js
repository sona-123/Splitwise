/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'], // 'Open Sans' as the imported font family, followed by the generic fallback font
      },
      colors: {
        reqDblue: '#151834',
        reqLblue: '#40B4D2',
        reqRed: '#FF0000',
        reqGreen: '#3FED14',
      },
    },
  },
  plugins: [],
};
