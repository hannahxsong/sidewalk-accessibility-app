/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          emerald: {
            500: '#A7D7C4', // Your light mint green
            900: '#064e3b', // Dark green for text
          }
        }
      },
    },
    plugins: [],
  }