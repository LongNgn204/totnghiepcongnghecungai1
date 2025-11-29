# HƯỚNG DẪN NÂNG CẤP TAILWIND CONFIG

## Tailwind.config.js - Cấu Hình Hoàn Chỉnh

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ===== COLORS =====
      colors: {
        // Primary Colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Secondary Colors (Purple)
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        // Accent Colors (Orange)
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Semantic Colors
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
          900: '#145231',
        },
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
        },
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
        },
        info: {
          50: '#ecf8ff',
          100: '#cff9ff',
          200: '#a5f3ff',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        // Neutral Colors
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },

      // ===== TYPOGRAPHY =====
      fontSize: {
        // Responsive font sizes
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.2' }],
        '7xl': ['4.5rem', { lineHeight: '1.2' }],
      },

      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'Fira Code',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
      },

      lineHeight: {
        tight: '1.2',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2',
      },

      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },

      // ===== SPACING =====
      spacing: {
        0: '0px',
        0.5: '0.125rem',
        1: '0.25rem',
        1.5: '0.375rem',
        2: '0.5rem',
        2.5: '0.625rem',
        3: '0.75rem',
        3.5: '0.875rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        7: '1.75rem',
        8: '2rem',
        9: '2.25rem',
        10: '2.5rem',
        12: '3rem',
        14: '3.5rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
        28: '7rem',
        32: '8rem',
        36: '9rem',
        40: '10rem',
        44: '11rem',
        48: '12rem',
        52: '13rem',
        56: '14rem',
        60: '15rem',
        64: '16rem',
        72: '18rem',
        80: '20rem',
        96: '24rem',
      },

      // ===== BORDER RADIUS =====
      borderRadius: {
        none: '0px',
        sm: '0.125rem',
        base: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },

      // ===== SHADOWS =====
      boxShadow: {
        none: 'none',
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        base: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        md: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        lg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      },

      // ===== TRANSITIONS =====
      transitionDuration: {
        75: '75ms',
        100: '100ms',
        150: '150ms',
        200: '200ms',
        300: '300ms',
        500: '500ms',
        700: '700ms',
        1000: '1000ms',
      },

      transitionTimingFunction: {
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // ===== ANIMATIONS =====
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-out': 'fadeOut 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-up': 'slideInUp 0.3s ease-out',
        'slide-in-down': 'slideInDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeOut: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(10px)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },

      // ===== BREAKPOINTS =====
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },

      // ===== CONTAINER =====
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          md: '2rem',
          lg: '2rem',
          xl: '2rem',
          '2xl': '2rem',
        },
      },

      // ===== MAX WIDTH =====
      maxWidth: {
        'xs': '20rem',
        'sm': '24rem',
        'md': '28rem',
        'lg': '32rem',
        'xl': '36rem',
        '2xl': '42rem',
        '3xl': '48rem',
        '4xl': '56rem',
        '5xl': '64rem',
        '6xl': '72rem',
        '7xl': '80rem',
        full: '100%',
        min: 'min-content',
        max: 'max-content',
        fit: 'fit-content',
      },

      // ===== ASPECT RATIO =====
      aspectRatio: {
        auto: 'auto',
        square: '1 / 1',
        video: '16 / 9',
        '4/3': '4 / 3',
        '3/2': '3 / 2',
        '5/4': '5 / 4',
        '2/1': '2 / 1',
        '3/1': '3 / 1',
        '4/5': '4 / 5',
        '16/10': '16 / 10',
      },

      // ===== OPACITY =====
      opacity: {
        0: '0',
        5: '0.05',
        10: '0.1',
        20: '0.2',
        25: '0.25',
        30: '0.3',
        40: '0.4',
        50: '0.5',
        60: '0.6',
        70: '0.7',
        75: '0.75',
        80: '0.8',
        90: '0.9',
        95: '0.95',
        100: '1',
      },

      // ===== Z-INDEX =====
      zIndex: {
        auto: 'auto',
        0: '0',
        10: '10',
        20: '20',
        30: '30',
        40: '40',
        50: '50',
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100',
        dropdown: '1000',
        sticky: '1020',
        fixed: '1030',
        modal: '1040',
        popover: '1050',
        tooltip: '1060',
      },
    },
  },
  plugins: [
    // Custom plugins
    function({ addComponents, theme }) {
      addComponents({
        // Responsive container
        '.container-responsive': {
          '@apply mx-auto px-4 sm:px-6 md:px-8 lg:px-8': {},
        },

        // Responsive grid
        '.grid-responsive': {
          '@apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6': {},
        },

        // Responsive text
        '.text-responsive': {
          '@apply text-base md:text-lg lg:text-xl': {},
        },

        // Responsive heading
        '.heading-responsive': {
          '@apply text-2xl md:text-3xl lg:text-4xl font-bold': {},
        },

        // Card base
        '.card': {
          '@apply bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300': {},
        },

        // Button base
        '.btn': {
          '@apply inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2': {},
        },

        // Input base
        '.input': {
          '@apply w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent': {},
        },

        // Badge
        '.badge': {
          '@apply inline-flex items-center px-3 py-1 rounded-full text-sm font-medium': {},
        },

        // Flex center
        '.flex-center': {
          '@apply flex items-center justify-center': {},
        },

        // Flex between
        '.flex-between': {
          '@apply flex items-center justify-between': {},
        },

        // Absolute center
        '.absolute-center': {
          '@apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2': {},
        },

        // Truncate
        '.truncate-2': {
          '@apply line-clamp-2': {},
        },

        '.truncate-3': {
          '@apply line-clamp-3': {},
        },

        // Gradient text
        '.gradient-text': {
          '@apply bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent': {},
        },

        // Smooth scroll
        '.smooth-scroll': {
          '@apply scroll-smooth': {},
        },
      });
    },
  ],
};
```

---

## Responsive Utilities - Thêm vào index.css

```css
/* Responsive Utilities */

/* Display utilities */
@media (max-width: 640px) {
  .hidden-mobile {
    display: none !important;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .hidden-tablet {
    display: none !important;
  }
}

@media (min-width: 1025px) {
  .hidden-desktop {
    display: none !important;
  }
}

/* Responsive padding */
.p-responsive {
  @apply p-4 md:p-6 lg:p-8;
}

.px-responsive {
  @apply px-4 md:px-6 lg:px-8;
}

.py-responsive {
  @apply py-4 md:py-6 lg:py-8;
}

/* Responsive margin */
.m-responsive {
  @apply m-4 md:m-6 lg:m-8;
}

.mx-responsive {
  @apply mx-4 md:mx-6 lg:mx-8;
}

.my-responsive {
  @apply my-4 md:my-6 lg:my-8;
}

/* Responsive gap */
.gap-responsive {
  @apply gap-4 md:gap-6 lg:gap-8;
}

/* Responsive font size */
.text-responsive-sm {
  @apply text-sm md:text-base lg:text-lg;
}

.text-responsive-base {
  @apply text-base md:text-lg lg:text-xl;
}

.text-responsive-lg {
  @apply text-lg md:text-xl lg:text-2xl;
}

.text-responsive-xl {
  @apply text-xl md:text-2xl lg:text-3xl;
}

.text-responsive-2xl {
  @apply text-2xl md:text-3xl lg:text-4xl;
}

/* Responsive width */
.w-responsive {
  @apply w-full md:w-auto;
}

/* Responsive grid */
.grid-responsive-2 {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6;
}

.grid-responsive-3 {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6;
}

.grid-responsive-4 {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6;
}

/* Responsive flex */
.flex-responsive {
  @apply flex flex-col md:flex-row gap-4 md:gap-6;
}

/* Touch-friendly sizes */
.touch-target {
  @apply min-h-[44px] min-w-[44px];
}

.touch-target-lg {
  @apply min-h-[48px] min-w-[48px];
}

/* Responsive image */
.img-responsive {
  @apply w-full h-auto object-cover;
}

/* Responsive container */
.container-responsive {
  @apply mx-auto px-4 md:px-6 lg:px-8;
}

/* Responsive section padding */
.section-padding {
  @apply py-8 md:py-12 lg:py-16;
}

.section-padding-lg {
  @apply py-12 md:py-20 lg:py-32;
}
```

---

## Sử Dụng Trong Component

```tsx
// Ví dụ sử dụng responsive utilities

// 1. Responsive Container
<div className="container-responsive">
  {/* Content */}
</div>

// 2. Responsive Grid
<div className="grid-responsive-3">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>

// 3. Responsive Padding
<div className="p-responsive">
  {/* 16px on mobile, 24px on tablet, 32px on desktop */}
</div>

// 4. Responsive Text
<h1 className="text-responsive-2xl">
  {/* 24px on mobile, 32px on tablet, 40px on desktop */}
</h1>

// 5. Responsive Flex
<div className="flex-responsive">
  {/* Column on mobile, row on desktop */}
</div>

// 6. Touch Targets
<button className="touch-target">
  {/* Minimum 44x44px */}
</button>

// 7. Responsive Image
<img src="..." className="img-responsive" />

// 8. Section Padding
<section className="section-padding">
  {/* Responsive padding for sections */}
</section>
```

---

## Breakpoint Reference

```
xs:  320px  - Extra small phones
sm:  640px  - Small phones, large phones
md:  768px  - Tablets
lg:  1024px - Small laptops
xl:  1280px - Desktops
2xl: 1536px - Large desktops

Usage:
- Mobile first: base styles apply to all
- sm: applies to 640px and up
- md: applies to 768px and up
- lg: applies to 1024px and up
- xl: applies to 1280px and up
- 2xl: applies to 1536px and up

Example:
<div className="text-base sm:text-lg md:text-xl lg:text-2xl">
  Responsive text size
</div>
```

---

## Dark Mode Configuration

```tsx
// Sử dụng dark mode
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  {/* Content */}
</div>

// Ví dụ đầy đủ
<Card className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900/30">
  <h2 className="text-gray-900 dark:text-white">Title</h2>
  <p className="text-gray-600 dark:text-gray-400">Description</p>
</Card>
```

