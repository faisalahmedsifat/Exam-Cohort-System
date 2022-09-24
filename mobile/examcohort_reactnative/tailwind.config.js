/** @type {import('tailwindcss').Config} */

const color_theme = require("./color-theme")

module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: color_theme,
    },
  },
  plugins: [],
}
