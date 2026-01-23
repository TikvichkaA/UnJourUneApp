/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wood: {
          light: '#DEB887',
          medium: '#B8860B',
          dark: '#8B4513',
          accent: '#CD853F'
        },
        chess: {
          white: '#F5F5DC',
          black: '#4A3728',
          highlight: '#90EE90',
          danger: '#FF6B6B',
          info: '#64B5F6'
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  plugins: [],
}
