/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      fontFamily: {
        roboto: ["'Roboto', sans-serif", "system-ui"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
