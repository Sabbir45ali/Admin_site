/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF69B4",
          light: "#FFB6C1",
          dark: "#C71585",
        },
      },
    },
  },
  plugins: [],
};
