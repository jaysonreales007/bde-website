/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#8B5CF6',
        'primary-dark': '#7C3AED',
        'primary-light': 'rgba(139, 92, 246, 0.1)',
        'bg-dark': '#0f0f1a',
        'card': 'rgba(255, 255, 255, 0.03)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
        'hover': '0 5px 15px rgba(139, 92, 246, 0.2)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
} 