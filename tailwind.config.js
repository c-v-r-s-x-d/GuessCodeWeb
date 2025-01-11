module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          dark: '#60A5FA',
        },
        background: {
          light: '#FFFFFF',
          dark: '#1A1B1E',
        },
        surface: {
          light: '#F3F4F6',
          dark: '#2C2D31',
        },
        text: {
          light: '#1F2937',
          dark: '#E5E7EB',
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 