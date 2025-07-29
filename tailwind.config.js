/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF4444',
        primaryDark: '#E63946',
        secondary: '#1D1D1F',
        background: '#FAFBFC',
        backgroundDark: '#F4F5F7',
        text: '#101419',
        textSecondary: '#4A5568',
        textMuted: '#718096',
        card: '#FFFFFF',
        cardBorder: '#E2E8F0',
        accent: '#FF6B6B',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        surface: '#F8FAFC',
        overlay: 'rgba(16, 20, 25, 0.1)',
      },
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'Space Grotesk', 'Manrope', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        'xs': '6px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        'card': '20px',
        'pill': '999px',
        'full': '9999px',
      },
      boxShadow: {
        'card': '0 4px 20px 0 rgba(16, 20, 25, 0.08)',
        'card-hover': '0 8px 32px 0 rgba(16, 20, 25, 0.12)',
        'smooth': '0 2px 12px 0 rgba(16, 20, 25, 0.06)',
        'button': '0 2px 8px 0 rgba(255, 68, 68, 0.2)',
        'button-hover': '0 4px 16px 0 rgba(255, 68, 68, 0.3)',
        'glow': '0 0 0 3px rgba(255, 68, 68, 0.1)',
        'inner-soft': 'inset 0 1px 3px 0 rgba(16, 20, 25, 0.1)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      backdropBlur: {
        'xs': '2px',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-soft': 'bounceSoft 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'float': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0px)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceSoft: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 0 3px rgba(255, 68, 68, 0.1)' },
          '50%': { boxShadow: '0 0 0 6px rgba(255, 68, 68, 0.2)' },
        },
      },
    },
  },
  plugins: [],
}
