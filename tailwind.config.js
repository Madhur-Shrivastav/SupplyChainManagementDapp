/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-black-1": "#1B1B1B",
        "custom-black-2": "#666362",
        "custom-black-3": "#494F55",
        "custom-black-4": "#1A1110",
      },
    },
  },
  plugins: [],
};
