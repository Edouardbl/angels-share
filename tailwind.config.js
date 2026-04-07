/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0F172A',
      },
      animation: {
        'scan-line': 'scanLine 1.8s ease-in-out infinite',
        'fade-up': 'fadeUp 1.2s ease-out forwards',
        'fade-in': 'fadeIn 0.35s ease-out forwards',
        'tier-pop': 'tierPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'dot-bounce': 'dotBounce 1.2s infinite',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'card-in': 'cardIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-ring': 'pulseRing 1.5s ease-out infinite',
      },
      keyframes: {
        scanLine: {
          '0%': { top: '0%', opacity: '1' },
          '50%': { top: '88%', opacity: '0.6' },
          '100%': { top: '0%', opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-40px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        tierPop: {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        dotBounce: {
          '0%, 80%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '40%': { transform: 'translateY(-6px)', opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        cardIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '70%': { transform: 'scale(1.4)', opacity: '0' },
          '100%': { transform: 'scale(1.4)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
