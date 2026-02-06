# Wealth Management - Theme & Styling Documentation

## 🎨 Design System Overview

This application uses a **Glassy + Classic Dark Theme** with:
- Dark navy backgrounds (`#0f172a`, `#020617`)
- Cyan/light-blue glow accents (`#05adc1`, `#06d9ff`)
- Glassmorphism effects (backdrop filters + transparency)
- Smooth gradients and elegant shadows
- Full-screen responsive layout

---

## 📋 Theme Variables (CSS Custom Properties)

All theme variables are defined in `src/index.css` under the `:root` selector.

### Color Palette

```css
/* Backgrounds */
--color-bg-primary: #0f172a;      /* Main dark navy */
--color-bg-secondary: #1a2540;    /* Slightly lighter navy */
--color-bg-tertiary: #0d1927;     /* Darker navy */
--color-bg-dark: #020617;         /* Darkest navy */

/* Text Colors */
--color-text-primary: #e5e7eb;     /* Main text - light gray */
--color-text-secondary: #d1d5db;   /* Secondary text - gray */
--color-text-muted: #9ca3af;       /* Muted text - dark gray */

/* Accent Colors */
--color-accent-cyan: #05adc1;              /* Main cyan accent */
--color-accent-cyan-light: #06d9ff;        /* Light cyan */
--color-accent-blue: #3b82f6;              /* Blue accent */
--color-accent-purple: #a855f7;            /* Purple accent */
```

### Shadow & Glow Effects

```css
/* Shadows (for depth) */
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.15);
--shadow-md: 0 8px 16px rgba(0, 0, 0, 0.25);
--shadow-lg: 0 16px 32px rgba(0, 0, 0, 0.35);
--shadow-xl: 0 24px 48px rgba(0, 0, 0, 0.45);

/* Glows (for highlights) */
--glow-cyan: 0 0 16px rgba(5, 172, 193, 0.3);
--glow-cyan-intense: 0 0 24px rgba(5, 172, 193, 0.5);
--glow-blue: 0 0 16px rgba(59, 130, 246, 0.2);
```

### Gradients

```css
--gradient-primary: linear-gradient(135deg, #0f172a, #020617);
--gradient-accent: linear-gradient(135deg, #05adc1, #3b82f6);
--gradient-glow: radial-gradient(circle at top right, rgba(5, 172, 193, 0.1), transparent 65%);
```

### Borders & Radius

```css
--radius-sm: 8px;      /* Small buttons, small elements */
--radius-md: 12px;     /* Medium cards, inputs */
--radius-lg: 16px;     /* Large cards, sections */
--radius-xl: 24px;     /* Extra large cards, modals */

--border-glass: 1px solid rgba(148, 163, 184, 0.25);           /* Subtle glass border */
--border-glass-highlight: 1px solid rgba(6, 217, 255, 0.2);   /* Cyan glass border */
```

---

## 🎯 Key CSS Classes & Patterns

### Glassmorphism Card

Use for all card-like elements:

```css
.glass-card {
  background: rgba(26, 37, 64, 0.4);
  backdrop-filter: blur(10px);
  border: var(--border-glass);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.glass-card:hover {
  border-color: var(--color-accent-cyan);
  box-shadow: var(--shadow-lg), var(--glow-cyan);
}
```

### Data Card (Dashboard Metrics)

```css
.data-card {
  background: rgba(26, 37, 64, 0.4);
  backdrop-filter: blur(10px);
  border: var(--border-glass);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
}

.data-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-accent-cyan);
  box-shadow: var(--shadow-lg), var(--glow-cyan);
  background: rgba(26, 37, 64, 0.6);
}
```

### Form Container

```css
.form-container {
  background: rgba(26, 37, 64, 0.6);
  backdrop-filter: blur(10px);
  border: var(--border-glass);
  border-radius: var(--radius-xl);
  padding: 30px;
  box-shadow: var(--shadow-lg), var(--glow-cyan);
}
```

### Input Fields

```css
input, textarea, select {
  background: rgba(15, 23, 42, 0.4);
  border: var(--border-glass);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  padding: 12px 14px;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: var(--color-accent-cyan);
  background: rgba(15, 23, 42, 0.6);
  box-shadow: var(--glow-cyan);
}
```

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: var(--gradient-accent);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  box-shadow: var(--shadow-lg), var(--glow-cyan-intense);
  transform: translateY(-2px);
}

.btn-primary:active {
  transform: translateY(0);
}
```

---

## 📐 Layout Structure

### Full-Screen Layout Hierarchy

```
html
  ↓ 100% width, 100% height
body
  ↓ 100% width, 100% height, gradient background
#root
  ↓ display: flex, flex-direction: column, min-height: 100vh
  ├── Navbar (sticky, z-index: 1000)
  ├── Layout Container
  │   ├── Sidebar (fixed, width: 260px)
  │   └── Main Content (flex: 1, margin-left: 260px)
  │       ├── Content Wrapper (overflow-y: auto)
  │       └── Content Container (width: 100%, padding: 40px 20px)
  └── Footer
```

### No Horizontal Scroll

- `overflow-x: hidden` on `body`, `html`, `#root`, and `.content`
- All elements use `width: 100%` or responsive percentages
- Maximum widths are 100% (no fixed max-width restrictions)
- Sidebar is fixed to avoid layout shifting

---

## 🎨 Design Patterns

### Hover Effects

1. **Lift Effect**: Cards translate up and glow
   ```css
   transform: translateY(-4px);
   box-shadow: var(--shadow-lg), var(--glow-cyan);
   ```

2. **Glow Border**: Borders change color on hover
   ```css
   border-color: var(--color-accent-cyan);
   box-shadow: var(--glow-cyan);
   ```

3. **Color Transition**: Text and backgrounds transition smoothly
   ```css
   transition: all 0.3s ease;
   ```

### Section Spacing

- Between major sections: `margin-bottom: 32px`
- Between cards in grid: `gap: 20px`
- Internal padding: `padding: 20px`
- Form spacing: `margin-bottom: 16px` for form groups

### Z-Index Hierarchy

```css
Navbar:        z-index: 1000
Sidebar:       z-index: 100
Modal Overlay: z-index: 1000
Default:       z-index: auto
```

---

## 📱 Responsive Breakpoints

### Desktop (1920px+)
- Content padding: `48px 32px`
- Grid gap: `24px`
- Full glassmorphism effects active

### Laptop (1366px - 1919px)
- Content padding: `40px 24px`
- Grid gap: `20px`
- All effects active

### Tablet (768px - 1024px)
- Sidebar collapses to 80px on some views
- Content padding: `32px 20px`
- Grid adjusts to 2 columns or 1 column
- Reduced gap: `16px`

### Mobile (< 640px)
- Single column layout
- Content padding: `24px 16px`
- Reduced shadows and glows
- Sidebar drawer behavior
- Touch-friendly sizes

---

## 🎯 Best Practices

### When Creating New Components

1. **Use CSS Variables**: Never hardcode colors
   ```css
   color: var(--color-text-primary);  /* ✓ Good */
   color: #e5e7eb;                     /* ✗ Avoid */
   ```

2. **Apply Glassmorphism**:
   ```css
   background: rgba(26, 37, 64, 0.4);
   backdrop-filter: blur(10px);
   border: var(--border-glass);
   ```

3. **Add Smooth Transitions**:
   ```css
   transition: all 0.3s ease;
   ```

4. **Use Semantic Shadows**:
   - Hover: `var(--shadow-lg), var(--glow-cyan)`
   - Default: `var(--shadow-md)`
   - Subtle: `var(--shadow-sm)`

### When Modifying Existing Components

1. Check if the component uses theme variables
2. Replace hardcoded colors with CSS variables
3. Maintain the glassmorphism effect
4. Keep hover/focus states consistent
5. Test on multiple screen sizes

### Accessibility

- Use `outline: 2px solid var(--color-accent-cyan)` for focus states
- Maintain sufficient contrast for text
- Support reduced motion with `@media (prefers-reduced-motion: reduce)`
- Use semantic HTML with proper ARIA labels

---

## 📁 File Structure

```
src/
  ├── index.css               # Global theme + base styles
  ├── App.css                 # Layout structure (dashboard, sidebar)
  ├── pages/
  │   ├── Dashboard.css       # Dashboard-specific styles
  │   ├── Home.css            # Home page (hero section)
  │   ├── Investments.css     # Investments page
  │   ├── Goals.css           # Goals page
  │   ├── Portfolio.css       # Portfolio tables
  │   ├── Transactions.css    # Transactions page
  │   ├── Reports.css         # Reports page
  │   ├── Settings.css        # Settings forms
  │   ├── Contact.css         # Contact page
  │   └── Auth.css            # Login/Register forms
  ├── components/
  │   ├── Navbar.css          # Navbar with glassy effect
  │   ├── Sidebar.css         # Sidebar navigation
  │   ├── Footer.css          # Footer styling
  │   └── InvestmentCard.css  # Investment card component
  └── styles/
      └── main.css            # Legacy/utility styles
```

---

## 🔄 Theme Customization

To change the theme colors globally, update the CSS variables in `src/index.css`:

```css
:root {
  --color-accent-cyan: #new-hex-color;
  --color-text-primary: #new-hex-color;
  /* etc... */
}
```

All components will automatically update due to CSS cascading.

---

## 📝 Testing Checklist

- [ ] Dark theme displays correctly on all pages
- [ ] No horizontal scrolling appears
- [ ] Full-screen layout fills viewport on desktop/laptop/tablet
- [ ] Responsive breakpoints work correctly
- [ ] Hover effects smooth and visible
- [ ] Glow effects appear on focus
- [ ] Forms and inputs styled consistently
- [ ] Navbar sticky and visible
- [ ] Sidebar navigation smooth
- [ ] Footer properly positioned
- [ ] Mobile layout single column
- [ ] Touch targets appropriately sized (48px+)

---

## 🚀 Performance Notes

- Backdrop filters have good performance on modern browsers
- Transitions use `transform` and `opacity` for GPU acceleration
- Shadows use box-shadow (GPU-optimized)
- CSS variables have minimal performance impact
- Animations respect `prefers-reduced-motion` setting

---

## 🎓 Resources

- CSS Variables Documentation: https://developer.mozilla.org/en-US/docs/Web/CSS/--*
- Glassmorphism Reference: https://css-glass.com/
- Accessibility: https://www.w3.org/WAI/fundamentals/accessibility-intro/
