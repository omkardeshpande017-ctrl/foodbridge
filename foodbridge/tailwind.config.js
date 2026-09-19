/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      colors: {
        forest: { DEFAULT: '#1B4332', 50:'#EAF3EE', 100:'#D2E7DB', 300:'#7FB99A', 500:'#2D6A4F', 700:'#1B4332', 900:'#0E2A20' },
        leaf: { DEFAULT: '#74C69D', 100:'#E4F5EC', 300:'#A9E2C4', 500:'#74C69D', 700:'#40916C' },
        sand: { DEFAULT:'#F7F9F4', 100:'#FBFCFA', 200:'#F1F3EC' },
        amber: { DEFAULT:'#E9A23B', 100:'#FBEBD3' },
        ink: { DEFAULT:'#14231C', 600:'#2C3B33', 400:'#5C6B62' },
        berry: { DEFAULT:'#B3492B' },
      },
      boxShadow: {
        soft: '0 2px 10px -2px rgba(20,35,28,0.08), 0 1px 2px rgba(20,35,28,0.06)',
        lift: '0 12px 30px -8px rgba(20,35,28,0.18)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
