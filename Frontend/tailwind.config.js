/** @type {import('tailwindcss/types').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navbar: {
          DEFAULT: "#1b2730",
          bgButtons: "#9c27b0",
          bgIcon: "#a5b4fc",
          textButton: "#ffffff",
        },
        form: {
          bgFormLight: "#FFFFFF",
          bgFormDark: "#1b2730",
          textWhite: "#FFFFFF",
          textGray: "#9CA3AF",
          bgButtonSecondary: "#1b2730",
          bgButtonPrimary: "#9c27b0",
          bgButtonPrimaryHover: "#bd2fd6",
          bgButtonSecondaryHover: "#304656",
        },
      },
    },
  },
  plugins: [],
};
