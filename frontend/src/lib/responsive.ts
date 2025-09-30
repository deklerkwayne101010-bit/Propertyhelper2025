/**
 * Responsive Design Utilities
 * Mobile-first approach with breakpoint helpers
 */

// Breakpoint values matching Tailwind defaults
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export type Breakpoint = keyof typeof breakpoints

// Hook for checking if screen size is above a certain breakpoint
export function useBreakpoint(breakpoint: Breakpoint): boolean {
  if (typeof window === 'undefined') return false

  const [isAbove, setIsAbove] = React.useState(
    window.innerWidth >= breakpoints[breakpoint]
  )

  React.useEffect(() => {
    const checkSize = () => {
      setIsAbove(window.innerWidth >= breakpoints[breakpoint])
    }

    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [breakpoint])

  return isAbove
}

// Hook for getting current breakpoint
export function useCurrentBreakpoint(): Breakpoint | null {
  if (typeof window === 'undefined') return null

  const [current, setCurrent] = React.useState<Breakpoint | null>(() => {
    const width = window.innerWidth
    if (width >= breakpoints['2xl']) return '2xl'
    if (width >= breakpoints.xl) return 'xl'
    if (width >= breakpoints.lg) return 'lg'
    if (width >= breakpoints.md) return 'md'
    if (width >= breakpoints.sm) return 'sm'
    return 'sm' // Default to smallest
  })

  React.useEffect(() => {
    const checkSize = () => {
      const width = window.innerWidth
      if (width >= breakpoints['2xl']) setCurrent('2xl')
      else if (width >= breakpoints.xl) setCurrent('xl')
      else if (width >= breakpoints.lg) setCurrent('lg')
      else if (width >= breakpoints.md) setCurrent('md')
      else if (width >= breakpoints.sm) setCurrent('sm')
      else setCurrent('sm')
    }

    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  return current
}

// Responsive container queries
export const containerQueries = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
  wide: '(min-width: 1280px)',
} as const

// Mobile-first responsive classes generator
export function responsiveClass(
  baseClass: string,
  responsiveClasses: Partial<Record<Breakpoint, string>>
): string {
  let classes = [baseClass]

  Object.entries(responsiveClasses).forEach(([breakpoint, className]) => {
    if (className) {
      classes.push(`${breakpoint}:${className}`)
    }
  })

  return classes.join(' ')
}

// Common responsive patterns
export const responsivePatterns = {
  // Hide on mobile, show on larger screens
  hideMobile: 'hidden sm:block',

  // Show only on mobile
  mobileOnly: 'block sm:hidden',

  // Hide on tablet
  hideTablet: 'block md:hidden lg:block',

  // Center content on mobile, left-align on desktop
  centerMobile: 'text-center sm:text-left',

  // Stack on mobile, flex on desktop
  stackMobile: 'flex-col sm:flex-row',

  // Single column on mobile, grid on desktop
  gridMobile: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',

  // Full width on mobile, contained on desktop
  fullMobile: 'w-full sm:w-auto sm:max-w-md',

  // Padding that increases with screen size
  responsivePadding: 'p-4 sm:p-6 lg:p-8',

  // Text size that scales up
  responsiveText: 'text-sm sm:text-base lg:text-lg',

  // Gap that increases with screen size
  responsiveGap: 'gap-2 sm:gap-4 lg:gap-6',
} as const

// Mobile-optimized touch targets
export const touchTargets = {
  button: 'min-h-[44px] min-w-[44px]', // Apple's recommended minimum
  input: 'min-h-[44px]',
  link: 'min-h-[44px] flex items-center justify-center px-3',
} as const

// Responsive typography scale
export const typographyScale = {
  xs: 'text-xs sm:text-sm',
  sm: 'text-sm sm:text-base',
  base: 'text-base sm:text-lg',
  lg: 'text-lg sm:text-xl',
  xl: 'text-xl sm:text-2xl',
  '2xl': 'text-2xl sm:text-3xl',
  '3xl': 'text-3xl sm:text-4xl',
  '4xl': 'text-4xl sm:text-5xl',
} as const

// Responsive spacing scale
export const spacingScale = {
  xs: 'space-y-2 sm:space-y-3',
  sm: 'space-y-3 sm:space-y-4',
  base: 'space-y-4 sm:space-y-6',
  lg: 'space-y-6 sm:space-y-8',
  xl: 'space-y-8 sm:space-y-12',
} as const

// Mobile-first grid systems
export const gridSystems = {
  cards: {
    mobile: 'grid-cols-1',
    tablet: 'sm:grid-cols-2',
    desktop: 'lg:grid-cols-3',
    wide: 'xl:grid-cols-4',
  },
  stats: {
    mobile: 'grid-cols-2',
    tablet: 'sm:grid-cols-3',
    desktop: 'lg:grid-cols-4',
  },
  navigation: {
    mobile: 'flex-col space-y-2',
    tablet: 'sm:flex-row sm:space-y-0 sm:space-x-4',
  },
} as const

// Accessibility helpers for responsive design
export const a11yResponsive = {
  // Ensure touch targets meet minimum size requirements
  touchTarget: 'min-h-[44px] min-w-[44px]',

  // Responsive focus indicators
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',

  // Skip links for mobile navigation
  skipLink: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md',

  // Responsive ARIA labels
  mobileMenu: 'lg:hidden',
  desktopMenu: 'hidden lg:block',
} as const

// Performance optimizations for mobile
export const mobileOptimizations = {
  // Lazy load images on mobile
  lazyImage: 'loading="lazy" decoding="async"',

  // Reduce motion for better performance
  reducedMotion: 'motion-reduce:transition-none',

  // Touch action optimizations
  touchAction: 'touch-pan-x touch-pan-y',

  // Viewport meta optimizations
  viewportContent: 'width=device-width, initial-scale=1.0, viewport-fit=cover',
} as const

// React imports for hooks (to be added when React is available)
import * as React from 'react'