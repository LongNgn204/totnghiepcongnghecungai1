# HƯỚNG DẪN NÂNG CẤP COMPONENT CHI TIẾT

## 1. BUTTON COMPONENT - NÂNG CẤP ĐẦU TIÊN

### Hiện tại
```tsx
// Các button được viết inline, không nhất quán
<button className="px-4 py-2 bg-blue-600 text-white rounded">
  Click me
</button>
```

### Nâng cấp
```tsx
// components/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  children,
  onClick,
  className = '',
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400 disabled:bg-gray-300',
    ghost: 'text-blue-600 hover:bg-blue-50 active:bg-blue-100 disabled:text-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-gray-400',
  };

  const sizeClasses = {
    xs: 'px-3 py-1.5 text-xs h-8 min-w-8',
    sm: 'px-3 py-2 text-sm h-9 min-w-9',
    md: 'px-4 py-2.5 text-base h-10 min-w-10',
    lg: 'px-5 py-3 text-base h-11 min-w-11',
    xl: 'px-6 py-3.5 text-lg h-12 min-w-12',
  };

  const responsiveClasses = fullWidth ? 'w-full md:w-auto' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${responsiveClasses} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
```

### Responsive Behavior
```
Mobile (< 640px):
- Primary buttons: full width
- Minimum height: 44px (lg size)
- Padding: 12px 16px
- Font size: 16px (prevents iOS zoom)

Tablet (640px - 1024px):
- Auto width
- Height: 40px (md size)
- Padding: 10px 16px

Desktop (> 1024px):
- Auto width
- Height: 40px (md size)
- Padding: 10px 16px
```

---

## 2. CARD COMPONENT - NÂNG CẤP THỨ HAI

### Hiện tại
```tsx
<div className="bg-white rounded-lg shadow-md p-6">
  {/* Content */}
</div>
```

### Nâng cấp
```tsx
// components/Card.tsx
interface CardProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  children,
  className = '',
  hoverable = false,
  onClick,
}) => {
  const baseClasses = 'rounded-xl transition-all duration-300';
  
  const variantClasses = {
    elevated: 'bg-white shadow-md hover:shadow-lg dark:bg-gray-800 dark:shadow-gray-900/30',
    outlined: 'bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700',
    filled: 'bg-gray-50 dark:bg-gray-700',
  };

  const hoverClasses = hoverable ? 'cursor-pointer hover:scale-105' : '';

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
```

### Responsive Padding
```
Mobile (< 640px):
- Padding: 16px
- Margin bottom: 12px
- Full width with 0 margin

Tablet (640px - 1024px):
- Padding: 20px
- Margin bottom: 16px
- Max width: 600px

Desktop (> 1024px):
- Padding: 24px
- Margin bottom: 20px
- Max width: 400px
```

---

## 3. INPUT COMPONENT - NÂNG CẤP THỨ BA

### Hiện tại
```tsx
<input type="text" className="border border-gray-300 rounded px-3 py-2" />
```

### Nâng cấp
```tsx
// components/Input.tsx
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'search';
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  required = false,
  icon,
  className = '',
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full px-4 py-3 text-base rounded-lg
            border-2 transition-colors duration-200
            ${icon ? 'pl-10' : ''}
            ${error 
              ? 'border-red-500 focus:border-red-600 focus:ring-red-200' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
            }
            ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}
            focus:outline-none focus:ring-4
            dark:bg-gray-700 dark:border-gray-600 dark:text-white
            ${className}
          `}
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
```

### Responsive Sizing
```
Mobile (< 640px):
- Height: 44px
- Font size: 16px (prevents zoom)
- Padding: 12px 16px
- Full width

Tablet & Desktop:
- Height: 40px
- Font size: 14px
- Padding: 10px 12px
```

---

## 4. HEADER COMPONENT - NÂNG CẤP THỨ TƯ

### Hiện tại
```tsx
// Horizontal menu, không responsive
<header className="bg-white shadow">
  <nav className="flex items-center justify-between">
    {/* Logo and menu */}
  </nav>
</header>
```

### Nâng cấp
```tsx
// components/Header.tsx
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  logo?: React.ReactNode;
  title?: string;
  navItems?: Array<{ label: string; href: string }>;
  rightContent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  logo,
  title,
  navItems = [],
  rightContent,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            {logo}
            {title && <span className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">{title}</span>}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Content */}
          <div className="hidden md:flex items-center gap-4">
            {rightContent}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {item.label}
              </a>
            ))}
            <div className="px-4 py-2">
              {rightContent}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
```

---

## 5. MODAL/DIALOG COMPONENT - NÂNG CẤP THỨ NĂM

### Hiện tại
```tsx
// Fixed size modal
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
  <div className="bg-white rounded-lg w-1/2">
    {/* Content */}
  </div>
</div>
```

### Nâng cấp
```tsx
// components/Modal.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto`}>
        
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
```

### Responsive Behavior
```
Mobile (< 640px):
- Full screen modal
- Bottom sheet style
- 100% width, 90vh max height
- Padding: 16px

Tablet (640px - 1024px):
- 90% width
- Centered
- Max width: 600px

Desktop (> 1024px):
- 50% width
- Centered
- Max width: 700px
```

---

## 6. GRID LAYOUT COMPONENT

### Nâng cấp
```tsx
// components/Grid.tsx
interface GridProps {
  children: React.ReactNode;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Grid: React.FC<GridProps> = ({
  children,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  className = '',
}) => {
  const gapClasses = {
    sm: 'gap-3 md:gap-4 lg:gap-4',
    md: 'gap-4 md:gap-5 lg:gap-6',
    lg: 'gap-6 md:gap-7 lg:gap-8',
  };

  const colClasses = `grid grid-cols-${cols.mobile} md:grid-cols-${cols.tablet} lg:grid-cols-${cols.desktop}`;

  return (
    <div className={`${colClasses} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};

export default Grid;
```

---

## 7. CONTAINER COMPONENT

### Nâng cấp
```tsx
// components/Container.tsx
interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

const Container: React.FC<ContainerProps> = ({
  children,
  size = 'lg',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'w-full',
  };

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
};

export default Container;
```

---

## 8. RESPONSIVE TYPOGRAPHY

### Nâng cấp
```tsx
// components/Typography.tsx

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export const H1: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight ${className}`}>
    {children}
  </h1>
);

export const H2: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold leading-tight ${className}`}>
    {children}
  </h2>
);

export const H3: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h3 className={`text-xl md:text-2xl lg:text-3xl font-semibold leading-snug ${className}`}>
    {children}
  </h3>
);

export const Body: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <p className={`text-base md:text-lg leading-relaxed ${className}`}>
    {children}
  </p>
);

export const Small: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <p className={`text-sm md:text-base leading-normal ${className}`}>
    {children}
  </p>
);
```

---

## 9. RESPONSIVE SPACING UTILITIES

### CSS Classes
```css
/* Mobile first spacing */
.px-mobile { @apply px-4; }
.py-mobile { @apply py-4; }
.gap-mobile { @apply gap-3; }

/* Tablet */
@media (min-width: 640px) {
  .px-tablet { @apply px-6; }
  .py-tablet { @apply py-6; }
  .gap-tablet { @apply gap-4; }
}

/* Desktop */
@media (min-width: 1024px) {
  .px-desktop { @apply px-8; }
  .py-desktop { @apply py-8; }
  .gap-desktop { @apply gap-6; }
}
```

---

## 10. IMPLEMENTATION PRIORITY

### Week 1
1. Button Component
2. Card Component
3. Input Component
4. Update tailwind.config.js

### Week 2
5. Header Component
6. Navigation Component
7. Container Component
8. Grid Component

### Week 3
9. Modal Component
10. Typography Components
11. Responsive utilities

### Week 4
12. Update all existing components
13. Test on real devices
14. Performance optimization

---

## 11. TESTING CHECKLIST

### Mobile (320px - 480px)
- [ ] All buttons are 44px+ height
- [ ] Text is 16px+ (no zoom)
- [ ] Touch targets are 44px+
- [ ] Full width forms
- [ ] Hamburger menu works
- [ ] No horizontal scroll

### Tablet (640px - 1024px)
- [ ] 2-column layouts work
- [ ] Sidebar collapses/expands
- [ ] Cards are properly sized
- [ ] Navigation is accessible

### Desktop (1024px+)
- [ ] 3-4 column layouts
- [ ] Proper max-widths
- [ ] Sidebar is visible
- [ ] Spacing is optimal

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast passes WCAG AA
- [ ] Screen reader compatible
- [ ] Touch targets are 44px+

### Performance
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals pass
- [ ] No layout shifts
- [ ] Smooth animations

