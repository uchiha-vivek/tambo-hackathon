/**
 * StudyGenie Design System
 * Single source of truth - based on AI-Generated Curriculum Dashboard
 */

export const designSystem = {
  // Colors - Light mode primary with warm brown + teal accents
  colors: {
    background: {
      primary: '#F5F5F5', // Light cream/soft white
      secondary: '#FFFFFF',
    },
    accent: {
      teal: '#3FDFD5',
      brown: '#61210F',
    },
    text: {
      primary: '#1F2937', // Dark gray
      secondary: '#6B7280', // Medium gray
      tertiary: '#9CA3AF', // Light gray
      inverse: '#FFFFFF',
    },
    border: {
      default: '#E5E7EB',
      accent: 'rgba(97, 33, 15, 0.2)', // brown with opacity
      teal: 'rgba(63, 223, 213, 0.3)', // teal with opacity
    },
  },

  // Typography
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  // Spacing - 8px system
  spacing: {
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    5: '1.25rem',  // 20px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
  },

  // Border radius - consistent across all cards
  borderRadius: {
    card: '1.5rem', // 24px - all cards use this
    button: '0.75rem', // 12px
    small: '0.5rem', // 8px
  },

  // Shadows - consistent depth
  shadows: {
    card: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    cardHover: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },

  // Layout
  layout: {
    maxWidth: '1280px',
    containerPadding: '1.5rem', // 24px
  },
};

