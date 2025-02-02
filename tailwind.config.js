/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F9FBFC",
        text: "#080808",
        secondary: "#4F4F4F",
        accent: "#7CCCFF",
        codeBackground: "#EEEEEE",
        code: "#D4D4D4",
        border: "#D0D0D0",
        tableRowBackground: "#D8D8D8",
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
