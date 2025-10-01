import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // Modern gradient-based primary colors (Ocean Blue)
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        // Elegant secondary colors with purple accents (Royal Purple)
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        // Success with modern green tones (Emerald)
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // Warm warning colors (Amber)
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Modern error colors (Rose)
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        // Neutral grays with modern warmth
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        // Special accent colors for real estate
        accent: {
          gold: '#fbbf24',
          emerald: '#10b981',
          sapphire: '#3b82f6',
          ruby: '#ef4444',
          amethyst: '#a855f7',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        'gradient-success': 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
        'gradient-warning': 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
        'gradient-ocean': 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
        'gradient-forest': 'linear-gradient(135deg, #16a34a 0%, #84cc16 100%)',
        'gradient-luxury': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgb(14 165 233 / 0.3)',
        'glow-lg': '0 0 40px rgb(14 165 233 / 0.2)',
        'card': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1), 0 0 0 1px rgb(255 255 255 / 0.05)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    function({ addUtilities, addComponents, theme, addBase }) {
      // Custom utilities
      addUtilities({
        '.backdrop-blur-glass': {
          'backdrop-filter': 'blur(16px) saturate(180%)',
          '-webkit-backdrop-filter': 'blur(16px) saturate(180%)',
          'background-color': 'rgba(255, 255, 255, 0.75)',
          'border': '1px solid rgba(209, 213, 219, 0.3)',
        },
        '.backdrop-blur-glass-dark': {
          'backdrop-filter': 'blur(16px) saturate(180%)',
          '-webkit-backdrop-filter': 'blur(16px) saturate(180%)',
          'background-color': 'rgba(17, 25, 40, 0.75)',
          'border': '1px solid rgba(255, 255, 255, 0.125)',
        },
        '.animate-fade-in': {
          animation: 'fadeIn 0.6s ease-out',
        },
        '.animate-slide-up': {
          animation: 'slideUp 0.6s ease-out',
        },
        '.animate-bounce-in': {
          animation: 'bounceIn 0.8s ease-out',
        },
      })

      // Custom components
      addComponents({
        '.glass': {
          'background': 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          'background': 'rgba(0, 0, 0, 0.1)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.gradient-text': {
          'background': `linear-gradient(135deg, ${theme('colors.primary.600')}, ${theme('colors.secondary.600')})`,
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.animated-gradient': {
          'background': 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
          'background-size': '400% 400%',
          'animation': 'gradientShift 15s ease infinite',
        },
        '.hover-lift': {
          'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.hover-lift:hover': {
          'transform': 'translateY(-4px)',
          'box-shadow': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        },
        '.btn-primary': {
          '@apply bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200': {},
        },
        '.btn-secondary': {
          '@apply bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200': {},
        },
        '.card-beautiful': {
          '@apply bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300': {},
        },
        '.card-beautiful-dark': {
          '@apply bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300': {},
        },
        '.input-beautiful': {
          '@apply bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 placeholder-gray-400': {},
        },
        '.heading-hero': {
          '@apply text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight': {},
        },
        '.heading-section': {
          '@apply text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent': {},
        },
        '.text-gradient': {
          '@apply bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent': {},
        },
      })

      // Custom keyframes
      addBase({
        '@keyframes fadeIn': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        '@keyframes slideUp': {
          'from': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        '@keyframes bounceIn': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.3)',
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1.05)',
          },
          '70%': {
            transform: 'scale(0.9)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        '@keyframes gradientShift': {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
      })
    },
  ],
}

export default config