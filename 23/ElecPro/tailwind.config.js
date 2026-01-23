/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'elec': {
          'primary': '#1e40af',
          'secondary': '#f59e0b',
          'success': '#10b981',
          'danger': '#ef4444',
          'warning': '#f97316',
          'dark': '#1f2937',
          'light': '#f3f4f6'
        }
      }
    },
  },
  plugins: [],
}
