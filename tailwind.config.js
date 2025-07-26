/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/styles/**/*.css',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#161C24',
          surface: '#1E252B',
          text: '#919EAB',
          textSecondary: '#8796A5',
          textTertiary: '#90A4AE',
          accent: '#0F7865',
          accentHover: '#0F7864',
          border: '#2A3138',
          card: '#1E252B',
        }
      }
    },
  },
  plugins: [],
}
