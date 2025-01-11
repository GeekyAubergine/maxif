/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#FFFFFF",
          dark: "#0C0C0E",
        },
        headings: {
          DEFAULT: "#080808",
          dark: "#EDEDED",
        },
        text: {
          DEFAULT: "#080808",
          dark: "#EDEDED",
        },
        secondary: {
          DEFAULT: "#74727B",
          dark: "#ABA9B0",
        },
        accent: {
          DEFAULT: "#784387", //'#FEB847',//#F58123', //'#89BA6A', //'#FEB847', //'#DEB9FF', //'#BB9EE0',//'#FEB847', ///#FEB847",//"#F2DE7C",//"#FEB847",//D9BBFF//00D5C6
          dark: "#EA93E3",
        },
        code: {
          DEFAULT: "#D4D4D4",
          dark: "#303030",
        },
        border: {
          DEFAULT: "#D8D8D8",
          dark: "#404040",
        },
        middleGray: {
          DEFAULT: "#888888",
          dark: "#181818",
        },
      },
      gridTemplateColumns: {
        // Simple 8 row grid
        8: "repeat(8, minmax(0, 1fr))",
        24: "repeat(24, minmax(0, 1fr))",
        36: "repeat(36, minmax(0, 1fr))",
        45: "repeat(45, minmax(0, 1fr))",
      },
    },
    fontFamily: {
      sans: ["Helvetica", "Arial", "sans-serif"],
    },
  },
  plugins: [],
};
