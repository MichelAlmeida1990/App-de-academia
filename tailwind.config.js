/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f1fe',
          100: '#cce3fd',
          200: '#99c7fb',
          300: '#66aaf9',
          400: '#338ef7',
          500: '#0072f5', // primary
          600: '#005bc4',
          700: '#004493',
          800: '#002e62',
          900: '#001731',
        },
        dark: {
          background: '#111827',
          surface: '#1F2937',
          primary: '#3B82F6',
          text: '#F9FAFB',
          border: '#374151'
        }
      },
      backgroundColor: {
        dark: '#111827',
      },
    },
  },
  plugins: [],
}