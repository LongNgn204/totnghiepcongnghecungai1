# QUICK REFERENCE - SỬ DỤNG COMPONENTS NHANH

## [object Object]ẮT ĐẦU NGAY

### Import Components
```tsx
// UI Components
import { 
  Button, Card, Input, Textarea, Select,
  Checkbox, Radio, Modal, Badge, Alert,
  Skeleton, H1, H2, H3, Body, Small
} from '@/components/ui';

// Layout Components
import { Container, Grid, Header } from '@/components/layout';
```

---

## 📝 QUICK EXAMPLES

### 1. Responsive Page Layout
```tsx
<Container size="lg">
  <H1>Page Title</H1>
  <Body>Description</Body>
  
  <Grid cols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
    <Card>Item 1</Card>
    <Card>Item 2</Card>
    <Card>Item 3</Card>
  </Grid>
</Container>
```

### 2. Responsive Form
```tsx
<div className="space-y-4">
  <Input 
    label="Name"
    placeholder="Enter name"
    required
  />
  
  <Input 
    label="Email"
    type="email"
    placeholder="Enter email"
    required
  />
  
  <Select 
    label="Category"
    options={[
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ]}
  />
  
  <Checkbox label="I agree to terms" />
  
  <Button size="lg" fullWidth>
    Submit
  </Button>
</div>
```

### 3. Header with Navigation
```tsx
<Header
  logo={<Logo />}
  title="My App"
  navItems={[
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]}
  rightContent={<UserMenu />}
/>
```

### 4. Card Grid
```tsx
<Container>
  <H2>Featured Products</H2>
  
  <Grid cols={{ mobile: 1, tablet: 2, desktop: 4 }} gap="md">
    {products.map(product => (
      <Card key={product.id} hoverable>
        <img src={product.image} className="img-responsive" />
        <H3>{product.name}</H3>
        <Body>{product.description}</Body>
        <Button fullWidth>View Details</Button>
      </Card>
    ))}
  </Grid>
</Container>
```

### 5. Modal Dialog
```tsx
const [isOpen, setIsOpen] = useState(false);

<>
  <Button onClick={() => setIsOpen(true)}>
    Open Modal
  </Button>
  
  <Modal
    isOpen={isOpen}
    onClose={() => setIsOpen(false)}
    title="Confirm Action"
  >
    <Body>Are you sure you want to continue?</Body>
    
    <div className="flex gap-3 mt-6">
      <Button 
        variant="secondary" 
        onClick={() => setIsOpen(false)}
      >
        Cancel
      </Button>
      <Button onClick={() => setIsOpen(false)}>
        Confirm
      </Button>
    </div>
  </Modal>
</>
```

### 6. Alert Messages
```tsx
<Alert type="success" title="Success">
  Your changes have been saved
</Alert>

<Alert type="error" title="Error" closeable>
  Something went wrong
</Alert>

<Alert type="warning" title="Warning">
  Please review before submitting
</Alert>
```

### 7. Loading States
```tsx
// Loading button
<Button loading>Loading...</Button>

// Skeleton cards
<SkeletonCard count={3} />

// Skeleton list
<SkeletonList count={5} />
```

### 8. Responsive Text
```tsx
<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
  Responsive Heading
</h1>

<p className="text-base md:text-lg lg:text-xl">
  Responsive body text
</p>
```

### 9. Responsive Spacing
```tsx
<div className="p-responsive">
  {/* 16px mobile, 24px tablet, 32px desktop */}
</div>

<div className="space-y-4 md:space-y-6 lg:space-y-8">
  {/* Responsive gap between items */}
</div>
```

### 10. Badges and Tags
```tsx
<div className="flex gap-2 flex-wrap">
  <Badge variant="primary">New</Badge>
  <Badge variant="success">Active</Badge>
  <Badge variant="warning">Pending</Badge>
  <Badge variant="error">Inactive</Badge>
</div>
```

---

## 🎨 RESPONSIVE UTILITIES

### Responsive Classes
```tsx
// Padding
className="p-4 md:p-6 lg:p-8"
className="px-responsive"
className="py-responsive"

// Margin
className="m-4 md:m-6 lg:m-8"
className="mx-responsive"
className="my-responsive"

// Gap
className="gap-4 md:gap-6 lg:gap-8"
className="gap-responsive"

// Text Size
className="text-base md:text-lg lg:text-xl"
className="text-responsive-base"

// Grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
className="grid-responsive-3"

// Flex
className="flex flex-col md:flex-row"
className="flex-responsive"
```

---

## 🔧 COMPONENT PROPS CHEAT SHEET

### Button
```tsx
<Button
  variant="primary"        // primary, secondary, ghost, danger, success
  size="md"               // xs, sm, md, lg, xl
  fullWidth              // boolean
  loading                // boolean
  disabled               // boolean
  icon={<Icon />}        // ReactNode
  iconPosition="left"    // left, right
>
  Click me
</Button>
```

### Input
```tsx
<Input
  type="text"            // text, email, password, number, search, tel, url
  label="Name"           // string
  placeholder="..."      // string
  value={value}          // string
  onChange={handler}     // function
  error="Error msg"      // string
  helperText="Help"      // string
  disabled               // boolean
  required               // boolean
  icon={<Icon />}        // ReactNode
/>
```

### Card
```tsx
<Card
  variant="elevated"     // elevated, outlined, filled
  padding="md"           // sm, md, lg, none
  hoverable              // boolean
  onClick={handler}      // function
>
  Content
</Card>
```

### Grid
```tsx
<Grid
  cols={{                // { mobile, tablet, desktop }
    mobile: 1,
    tablet: 2,
    desktop: 3
  }}
  gap="md"               // sm, md, lg, xl
>
  Items
</Grid>
```

### Modal
```tsx
<Modal
  isOpen={true}          // boolean
  onClose={handler}      // function
  title="Title"          // string
  size="md"              // sm, md, lg, xl, full
  closeButton            // boolean
  backdrop               // boolean
>
  Content
</Modal>
```

---

## 📱 RESPONSIVE BREAKPOINTS

```
Mobile:  < 640px   (xs, sm)
Tablet:  640-1024px (md)
Desktop: > 1024px  (lg, xl, 2xl)
```

### Usage
```tsx
// Mobile first
<div className="text-base">
  {/* Base for mobile */}
</div>

// Add tablet styles
<div className="text-base md:text-lg">
  {/* 768px and up */}
</div>

// Add desktop styles
<div className="text-base md:text-lg lg:text-xl">
  {/* 1024px and up */}
</div>
```

---

## 🌙 DARK MODE

### Enable Dark Mode
```tsx
// Toggle dark mode
document.documentElement.classList.toggle('dark');

// All components automatically support dark mode
<Card>Light and dark mode</Card>
```

---

## ✅ CHECKLIST - NÂNG CẤP TRANG

Khi nâng cấp một trang, hãy kiểm tra:

- [ ] Sử dụng Container component
- [ ] Sử dụng Grid component cho layouts
- [ ] Sử dụng Button component (size lg cho mobile)
- [ ] Sử dụng Card component
- [ ] Sử dụng Typography components (H1, H2, Body, etc.)
- [ ] Responsive padding (p-responsive)
- [ ] Responsive text size (text-responsive-*)
- [ ] Touch targets 44px+ (buttons, inputs)
- [ ] Test trên mobile (320px)
- [ ] Test trên tablet (768px)
- [ ] Test trên desktop (1024px+)
- [ ] Dark mode support
- [ ] Accessibility (keyboard, screen reader)

---

## 🎯 COMMON PATTERNS

### Hero Section
```tsx
<section className="section-padding-lg bg-gradient-to-r from-primary-600 to-accent-600">
  <Container>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div>
        <H1 className="text-white">Hero Title</H1>
        <Body className="text-white/90">Hero description</Body>
        <Button size="lg">Get Started</Button>
      </div>
      <img src="hero.png" className="img-responsive" />
    </div>
  </Container>
</section>
```

### Feature Grid
```tsx
<section className="section-padding">
  <Container>
    <H2 className="text-center mb-12">Features</H2>
    
    <Grid cols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
      {features.map(feature => (
        <Card key={feature.id}>
          <div className="text-4xl mb-4">{feature.icon}</div>
          <H3>{feature.title}</H3>
          <Body>{feature.description}</Body>
        </Card>
      ))}
    </Grid>
  </Container>
</section>
```

### CTA Section
```tsx
<section className="section-padding bg-gray-50 dark:bg-gray-800">
  <Container>
    <div className="text-center space-y-6">
      <H2>Ready to get started?</H2>
      <Body>Join thousands of users</Body>
      <Button size="lg">Sign Up Now</Button>
    </div>
  </Container>
</section>
```

### Stats Section
```tsx
<Grid cols={{ mobile: 2, tablet: 4, desktop: 4 }} gap="md">
  {stats.map(stat => (
    <Card key={stat.id} className="text-center">
      <div className="text-4xl font-bold text-primary-600">
        {stat.value}
      </div>
      <Small className="text-gray-600">{stat.label}</Small>
    </Card>
  ))}
</Grid>
```

---

## 📚 DOCUMENTATION LINKS

- Full Component Guide: `COMPONENT_USAGE_GUIDE.md`
- Design System: `PLAN_UI_UX_UPGRADE_RESPONSIVE.md`
- Tailwind Config: `TAILWIND_CONFIG_UPGRADE.md`
- Page Examples: `PAGE_OPTIMIZATION_GUIDE.md`

---

## 🚀 NEXT STEPS

1. Import components in your pages
2. Replace old components with new ones
3. Use responsive utilities
4. Test on mobile, tablet, desktop
5. Enable dark mode
6. Deploy and monitor

Happy coding! [object Object]
