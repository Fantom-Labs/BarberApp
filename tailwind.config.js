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
        // Paleta de cores personalizada
        'cakto': {
          'black': '#000000',
          'light-blue-gray': '#8796A5',
          'blue-gray': '#90A4AE',
          'text-primary': '#919EAB',
          'green-dark': '#0F7864',
          'green': '#0F7865',
          'bg-dark': '#161C24',
          'light-gray': '#E2E8F0',
          'gray-light': '#ECEFF1',
          'orange-warning': '#FCAB02',
          'orange': '#FFAB00',
          'white': '#FFFFFF',
          'dark-gray': '#212B36',
          'teal': '#2EA593',
          'emerald': '#36B37E',
          'charcoal': '#373D3F',
          'gray-medium': '#4A5568',
          'purple': '#5D2DE6',
          'gray-text': '#637381',
        },
        // Sobrescrever cores padrão do Tailwind para o tema escuro
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        // Cores para o tema escuro baseadas na paleta
        dark: {
          'bg-primary': '#161C24',
          'bg-secondary': '#212B36',
          'bg-tertiary': '#373D3F',
          'text-primary': '#FFFFFF',
          'text-secondary': '#919EAB',
          'text-tertiary': '#637381',
          'border': '#4A5568',
          'accent': '#0F7865',
          'accent-light': '#2EA593',
          'warning': '#FCAB02',
          'success': '#36B37E',
        }
      },
    },
  },
  plugins: [],
}
