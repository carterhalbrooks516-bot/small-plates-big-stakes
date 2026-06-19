/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep premium backgrounds
        navy: {
          DEFAULT: '#0a0e1a',
          950: '#070a14',
          900: '#0a0e1a',
          800: '#0d1424',
          700: '#111a30',
          600: '#16203a',
        },
        // Warm tapas / wine palette
        burgundy: {
          DEFAULT: '#5b1a2b',
          light: '#7a1f35',
          dark: '#3d0f1c',
        },
        wine: '#722f37',
        ember: '#c0392b',
        gold: {
          DEFAULT: '#d4af37',
          light: '#f0c75e',
          dark: '#b8941f',
        },
        amber: {
          warm: '#f59e0b',
          glow: '#fbbf24',
        },
        cream: {
          DEFAULT: '#f5ecd7',
          dim: '#cdbfa3',
        },
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'sans-serif'],
        cond: ['Oswald', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 28px -4px rgba(212, 175, 55, 0.45)',
        'glow-red': '0 0 28px -4px rgba(192, 57, 43, 0.5)',
        card: '0 20px 50px -20px rgba(0, 0, 0, 0.8)',
        inset: 'inset 0 1px 0 0 rgba(255,255,255,0.06)',
      },
      backgroundImage: {
        'gold-sheen':
          'linear-gradient(110deg, #b8941f 0%, #f0c75e 45%, #d4af37 55%, #b8941f 100%)',
        'wine-sheen': 'linear-gradient(110deg, #3d0f1c 0%, #7a1f35 50%, #5b1a2b 100%)',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-150%)' },
          '100%': { transform: 'translateX(250%)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.35', transform: 'scale(0.8)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'count-pop': {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.18)', color: '#f0c75e' },
          '100%': { transform: 'scale(1)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 18px -6px rgba(212,175,55,0.4)' },
          '50%': { boxShadow: '0 0 30px -2px rgba(212,175,55,0.75)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-7px)' },
          '40%, 80%': { transform: 'translateX(7px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        ticker: 'ticker 38s linear infinite',
        shimmer: 'shimmer 2.4s ease-in-out infinite',
        'pulse-dot': 'pulse-dot 1.4s ease-in-out infinite',
        'fade-up': 'fade-up 0.5s ease-out both',
        'scale-in': 'scale-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        'count-pop': 'count-pop 0.5s ease-out',
        'glow-pulse': 'glow-pulse 2.5s ease-in-out infinite',
        shake: 'shake 0.5s ease-in-out',
        float: 'float 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
