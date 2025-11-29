# HƯỚNG DẪN SỬ DỤNG CÁC COMPONENTS ĐÃ TẠO

## 📦 Các Components Đã Tạo

### UI Components (components/ui/)

#### 1. Button Component
```tsx
import { Button } from '@/components/ui';

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button variant="success">Success</Button>

// With sizes
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large (44px - Mobile)</Button>
<Button size="xl">Extra Large (48px - Mobile)</Button>

// Full width on mobile
<Button fullWidth>Full Width</Button>

// With loading state
<Button loading>Loading...</Button>

// With icon
<Button icon={<Icon />}>With Icon</Button>
<Button icon={<Icon />} iconPosition="right">Icon Right</Button>

// Disabled
<Button disabled>Disabled</Button>
```

#### 2. Card Component
```tsx
import { Card } from '@/components/ui';

// Basic usage
<Card>
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>

// With variants
<Card variant="elevated">Elevated</Card>
<Card variant="outlined">Outlined</Card>
<Card variant="filled">Filled</Card>

// With padding
<Card padding="sm">Small padding</Card>
<Card padding="md">Medium padding</Card>
<Card padding="lg">Large padding</Card>

// Hoverable
<Card hoverable onClick={() => console.log('clicked')}>
  Click me
</Card>
```

#### 3. Input Component
```tsx
import { Input } from '@/components/ui';

// Basic usage
<Input 
  label="Email"
  placeholder="Enter email"
  type="email"
/>

// With error
<Input 
  label="Password"
  type="password"
  error="Password is required"
/>

// With helper text
<Input 
  label="Username"
  helperText="3-20 characters"
/>

// With icon
<Input 
  label="Search"
  icon={<SearchIcon />}
/>

// Disabled
<Input 
  label="Disabled"
  disabled
/>

// Required field
<Input 
  label="Name"
  required
/>
```

#### 4. Textarea Component
```tsx
import { Textarea } from '@/components/ui';

// Basic usage
<Textarea 
  label="Message"
  placeholder="Enter your message"
  rows={4}
/>

// With character limit
<Textarea 
  label="Bio"
  maxLength={200}
/>

// With error
<Textarea 
  label="Comments"
  error="This field is required"
/>
```

#### 5. Select Component
```tsx
import { Select } from '@/components/ui';

const options = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
];

<Select 
  label="Choose option"
  placeholder="Select one"
  options={options}
/>

// With error
<Select 
  label="Category"
  options={options}
  error="Please select a category"
/>
```

#### 6. Checkbox Component
```tsx
import { Checkbox } from '@/components/ui';

// Basic usage
<Checkbox 
  label="I agree to terms"
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
/>

// Different sizes
<Checkbox label="Small" size="sm" />
<Checkbox label="Medium" size="md" />
<Checkbox label="Large" size="lg" />

// With error
<Checkbox 
  label="Accept"
  error="You must accept"
/>
```

#### 7. Radio Component
```tsx
import { Radio } from '@/components/ui';

// Basic usage
<Radio 
  name="gender"
  value="male"
  label="Male"
  checked={gender === 'male'}
  onChange={(e) => setGender(e.target.value)}
/>

<Radio 
  name="gender"
  value="female"
  label="Female"
  checked={gender === 'female'}
  onChange={(e) => setGender(e.target.value)}
/>
```

#### 8. Modal Component
```tsx
import { Modal } from '@/components/ui';
import { Button } from '@/components/ui';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  size="md"
>
  <p>Are you sure you want to continue?</p>
  
  <footer slot="footer">
    <Button variant="secondary" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button onClick={() => setIsOpen(false)}>
      Confirm
    </Button>
  </footer>
</Modal>
```

#### 9. Badge Component
```tsx
import { Badge } from '@/components/ui';

// Basic usage
<Badge>New</Badge>

// With variants
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>

// With icon
<Badge icon={<Icon />}>With Icon</Badge>

// Removable
<Badge onRemove={() => console.log('removed')}>
  Removable Badge
</Badge>
```

#### 10. Alert Component
```tsx
import { Alert } from '@/components/ui';

// Basic usage
<Alert type="info" title="Info">
  This is an informational message
</Alert>

// Different types
<Alert type="success" title="Success">Success message</Alert>
<Alert type="warning" title="Warning">Warning message</Alert>
<Alert type="error" title="Error">Error message</Alert>

// Closeable
<Alert 
  type="info" 
  closeable 
  onClose={() => console.log('closed')}
>
  Closeable alert
</Alert>
```

#### 11. Skeleton Component
```tsx
import { Skeleton, SkeletonCard, SkeletonList, SkeletonTable } from '@/components/ui';

// Basic skeleton
<Skeleton variant="text" />
<Skeleton variant="heading" />
<Skeleton variant="circle" width={48} height={48} />
<Skeleton variant="rect" />

// Multiple skeletons
<Skeleton variant="text" count={3} />

// Card skeleton
<SkeletonCard count={3} />

// List skeleton
<SkeletonList count={5} />

// Table skeleton
<SkeletonTable rows={5} cols={4} />
```

#### 12. Typography Components
```tsx
import { 
  H1, H2, H3, H4, 
  Body, BodyLarge, 
  Small, XSmall, 
  Label, Muted, 
  Bold, Accent, 
  Success, Error, Warning 
} from '@/components/ui';

// Headings
<H1>Heading 1</H1>
<H2>Heading 2</H2>
<H3>Heading 3</H3>
<H4>Heading 4</H4>

// Body text
<Body>Body text</Body>
<BodyLarge>Large body text</BodyLarge>

// Small text
<Small>Small text</Small>
<XSmall>Extra small text</XSmall>

// Special text
<Label>Label text</Label>
<Muted>Muted text</Muted>
<Bold>Bold text</Bold>
<Accent>Accent text</Accent>
<Success>Success text</Success>
<Error>Error text</Error>
<Warning>Warning text</Warning>
```

---

### Layout Components (components/layout/)

#### 1. Container Component
```tsx
import { Container } from '@/components/layout';

// Basic usage
<Container>
  <h1>Content</h1>
</Container>

// With sizes
<Container size="sm">Small container</Container>
<Container size="md">Medium container</Container>
<Container size="lg">Large container (default)</Container>
<Container size="xl">Extra large container</Container>
<Container size="full">Full width</Container>

// As different elements
<Container as="section">
  <h2>Section</h2>
</Container>

<Container as="main">
  <h1>Main content</h1>
</Container>
```

#### 2. Grid Component
```tsx
import { Grid } from '@/components/layout';

// Basic usage - 1 col mobile, 2 col tablet, 3 col desktop
<Grid>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>

// Custom columns
<Grid cols={{ mobile: 1, tablet: 2, desktop: 4 }}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</Grid>

// Different gaps
<Grid gap="sm">Small gap</Grid>
<Grid gap="md">Medium gap</Grid>
<Grid gap="lg">Large gap</Grid>
<Grid gap="xl">Extra large gap</Grid>
```

#### 3. Header Component
```tsx
import { Header } from '@/components/layout';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

<Header
  logo={<Logo />}
  title="My App"
  navItems={navItems}
  rightContent={<UserMenu />}
  onLogoClick={() => navigate('/')}
/>
```

---

##[object Object] Utilities

### Responsive Padding
```tsx
<div className="p-responsive">
  {/* 16px mobile, 24px tablet, 32px desktop */}
</div>

<div className="px-responsive">
  {/* Horizontal padding responsive */}
</div>

<div className="py-responsive">
  {/* Vertical padding responsive */}
</div>
```

### Responsive Text
```tsx
<h1 className="text-responsive-2xl">
  {/* 24px mobile, 32px tablet, 40px desktop */}
</h1>

<p className="text-responsive-base">
  {/* 16px mobile, 18px tablet, 20px desktop */}
</p>
```

### Responsive Grid
```tsx
<div className="grid-responsive-2">
  {/* 1 col mobile, 2 col desktop */}
</div>

<div className="grid-responsive-3">
  {/* 1 col mobile, 2 col tablet, 3 col desktop */}
</div>

<div className="grid-responsive-4">
  {/* 1 col mobile, 2 col tablet, 4 col desktop */}
</div>
```

### Responsive Flex
```tsx
<div className="flex-responsive">
  {/* Column mobile, row desktop */}
</div>
```

### Touch Targets
```tsx
<button className="touch-target">
  {/* Min 44x44px */}
</button>

<button className="touch-target-lg">
  {/* Min 48x48px */}
</button>
```

---

## 📱 Responsive Breakpoints

```
xs:  320px  - Extra small phones
sm:  640px  - Small phones
md:  768px  - Tablets
lg:  1024px - Small laptops
xl:  1280px - Desktops
2xl: 1536px - Large desktops
```

### Usage Example
```tsx
<div className="text-base sm:text-lg md:text-xl lg:text-2xl">
  Responsive text size
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</div>
```

---

## 🎯 Best Practices

### 1. Use Container for Page Layouts
```tsx
<Container size="lg">
  <H1>Page Title</H1>
  <Body>Content here</Body>
</Container>
```

### 2. Use Grid for Card Layouts
```tsx
<Container>
  <Grid cols={{ mobile: 1, tablet: 2, desktop: 3 }}>
    <Card>Card 1</Card>
    <Card>Card 2</Card>
    <Card>Card 3</Card>
  </Grid>
</Container>
```

### 3. Use Button Sizes Appropriately
```tsx
// Mobile primary action
<Button size="lg" fullWidth>
  Submit
</Button>

// Desktop secondary action
<Button size="md" variant="secondary">
  Cancel
</Button>
```

### 4. Use Typography Components
```tsx
<div>
  <H2>Section Title</H2>
  <Body>Description text</Body>
  <Small>Additional info</Small>
</div>
```

### 5. Responsive Forms
```tsx
<div className="space-y-4">
  <Input 
    label="Name"
    placeholder="Enter your name"
    required
  />
  <Input 
    label="Email"
    type="email"
    placeholder="Enter your email"
    required
  />
  <Button size="lg" fullWidth>
    Submit
  </Button>
</div>
```

---

## 🔄 Dark Mode Support

All components support dark mode automatically:

```tsx
// Light mode (default)
<Card>Light mode</Card>

// Dark mode (when dark class is on html element)
// Automatically switches colors
```

To enable dark mode:
```tsx
// Toggle dark mode
document.documentElement.classList.toggle('dark');
```

---

## 📝 Component Props Reference

### Button Props
- `variant`: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `fullWidth`: boolean
- `loading`: boolean
- `disabled`: boolean
- `icon`: React.ReactNode
- `iconPosition`: 'left' | 'right'

### Card Props
- `variant`: 'elevated' | 'outlined' | 'filled'
- `padding`: 'sm' | 'md' | 'lg' | 'none'
- `hoverable`: boolean

### Input Props
- `type`: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url'
- `label`: string
- `error`: string
- `helperText`: string
- `icon`: React.ReactNode

### Grid Props
- `cols`: { mobile?: number, tablet?: number, desktop?: number }
- `gap`: 'sm' | 'md' | 'lg' | 'xl'

---

## 🚀 Next Steps

1. Import components in your pages
2. Use responsive utilities for layouts
3. Test on mobile, tablet, and desktop
4. Customize colors using Tailwind classes
5. Add dark mode support

Happy coding! 🎉

