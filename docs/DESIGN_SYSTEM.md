# Kathmandu Arts / ThangkaHub — Design System

## 1. Brand Identity

- **Brand Name:** Kathmandu Arts (consumer-facing), ThangkaHub (platform/backend)
- **Tagline:** "The Sacred Archive" / "Preserving Himalayan Heritage"
- **Tone:** Luxurious, reverent, scholarly, elite. Museum-meets-high-fashion.
- **Core Metaphor:** Gold leaf on aged parchment — warmth, rarity, craftsmanship, spiritual depth.

---

## 2. Color System

### Semantic Tokens (Warm / Light Theme — default)

| Token | Hex | Role |
|---|---|---|
| `background` | `#F5F0E8` | Page background (warm cream) |
| `surface` | `#F5F0E8` | Base surface |
| `surface-dim` | `#EDE5D8` | Dimmed surface |
| `surface-container-lowest` | `#EDE5D8` | Section alt background |
| `surface-container-low` | `#EDE5D8` | Card backgrounds |
| `surface-container` | `#EDE5D8` | Elevated containers |
| `surface-container-high` | `#EDE5D8` | Higher elevation |
| `surface-container-highest` | `#E0D5C5` | Highest elevation |
| `surface-bright` | `#F5F0E8` | Bright surface accent |
| `surface-variant` | `#EDE5D8` | Variant surface |
| `on-background` | `#1C1008` | Primary text (espresso brown) |
| `on-surface` | `#1C1008` | Text on surface |
| `on-surface-variant` | `#8C6A4E` | Secondary text (warm brown) |
| `primary` | `#7A5C00` | Deep brass / gold |
| `primary-container` | `#A08230` | Gold container |
| `primary-fixed` | `#C4A44D` | Light gold |
| `primary-fixed-dim` | `#8B6B1A` | Dim gold |
| `on-primary` | `#F5F0E8` | Text on gold (cream) |
| `on-primary-container` | `#F5F0E8` | Text on gold container |
| `on-primary-fixed` | `#1C1008` | Text on light gold |
| `on-primary-fixed-variant` | `#F5F0E8` | Variant text on gold |
| `accent` | `#5C3317` | Deep rust (buttons, links) |
| `accent-foreground` | `#F5F0E8` | Text on accent |
| `secondary` | `#1C1008` | Near-black for buttons |
| `secondary-container` | `#EDE5D8` | Secondary container |
| `secondary-fixed` | `#F5F0E8` | Light secondary |
| `secondary-fixed-dim` | `#DDD0BC` | Dim secondary |
| `on-secondary` | `#F5F0E8` | Text on secondary |
| `on-secondary-container` | `#8C6A4E` | Text on secondary container |
| `on-secondary-fixed` | `#1C1008` | Text on secondary fixed |
| `on-secondary-fixed-variant` | `#8C6A4E` | Variant |
| `tertiary` | `#c4a882` | Warm beige |
| `tertiary-container` | `#EDE5D8` | Tertiary container |
| `tertiary-fixed` | `#F5F0E8` | Light tertiary |
| `tertiary-fixed-dim` | `#DDD0BC` | Dim tertiary |
| `on-tertiary` | `#1C1008` | Text on tertiary |
| `on-tertiary-container` | `#8C6A4E` | Text on tertiary container |
| `on-tertiary-fixed` | `#1C1008` | Text on tertiary fixed |
| `on-tertiary-fixed-variant` | `#8C6A4E` | Variant |
| `error` | `#a0522d` | Sienna / terracotta |
| `error-container` | `#f5e6d8` | Error container (cream) |
| `on-error` | `#F5F0E8` | Text on error |
| `on-error-container` | `#5C3317` | Text on error container |
| `outline` | `#DDD0BC` | Borders/outlines |
| `outline-variant` | `#E8DFD0` | Subtle borders |
| `inverse-surface` | `#1C1008` | Inverse surface (dark) |
| `inverse-primary` | `#7A5C00` | Inverse primary |
| `inverse-on-surface` | `#F5F0E8` | Inverse text |
| `surface-tint` | `#7A5C00` | Surface tint (gold) |

### Side Drawer (Mobile Menu) Override
- Background: `#F5F0E8` (warm cream)
- Text: `#1C1008` (espresso brown)

---

## 3. Typography

### Font Families

| Token | Font Stack | Usage |
|---|---|---|
| `display-xl` | Playfair Display, serif | Hero headline (84px) |
| `headline-lg` | Playfair Display, serif | Section headlines (48px) |
| `headline-lg-mobile` | Playfair Display, serif | Section headlines mobile (32px) |
| `headline-md` | Playfair Display, serif | Card titles, subheads (32px) |
| `body-lg` | Inter, sans-serif | Lead paragraphs (18px) |
| `body-md` | Inter, sans-serif | Body copy (16px) |
| `label-sm` | Inter, sans-serif | Labels, badges, CTAs (12px, 0.1em letter-spacing, 600 weight) |

### Type Scale

| Token | Size / Line | Weight | Letter | Use |
|---|---|---|---|---|
| `display-xl` | 84/92px | 700 | -0.02em | Hero only |
| `headline-lg` | 48/56px | 600 | — | Section headers |
| `headline-md` | 32/40px | 500 | — | Card titles, subheads |
| `body-lg` | 18/32px | 400 | — | Lead paragraphs |
| `body-md` | 16/24px | 400 | — | Body copy |
| `label-sm` | 12/16px | 600 | 0.1em | Labels, CTAs, badges |

---

## 4. Spacing System

| Token | Value | Usage |
|---|---|---|
| `unit` | 8px | Base unit |
| `gutter` | 32px | Grid gaps |
| `margin-mobile` | 24px | Mobile page margins |
| `margin-desktop` | 80px | Desktop page margins |
| `container-max` | 1440px | Max content width |
| `section-gap` | 120px | Vertical section spacing |

---

## 5. Border Radius

| Token | Value | Usage |
|---|---|---|
| `DEFAULT` | 2px (0.125rem) | Sharp, architectural — default |
| `lg` | 4px (0.25rem) | Slightly rounded |
| `xl` | 8px (0.5rem) | Cards, images |
| `full` | 12px (0.75rem) | Pills, badges, buttons |

---

## 6. Component Catalog

### 6.1 Top Navigation Bar
- **State:** Fixed, top-0, z-50
- **Background:** `background/90` + `backdrop-blur-md`
- **Border-bottom:** `outline-variant/20`
- **Content:** Logo (Playfair Display, gold, uppercase, tracking-widest) + Nav links + Icon buttons (search, cart with badge, account, hamburger)
- **Active link:** Gold text + gold underline border-b-2
- **Inactive link:** `on-surface-variant`, hover → `primary`
- **Mobile:** Hamburger triggers side drawer

### 6.2 Side Drawer (Mobile Menu)
- **Position:** Fixed, full-height, right side
- **Width:** Full mobile, 384px (w-96) desktop
- **Transform:** `translate-x-full` (hidden) → `translate-x-0` (visible)
- **Transition:** 500ms ease-in-out
- **Background:** Cream `#F5F1E8`
- **Links:** Large Playfair Display, black, hover → italic

### 6.3 Gold Leaf Button (Primary CTA)
```css
background: linear-gradient(145deg, #d4af37, #b8860b);
box-shadow: inset 0 0 10px rgba(255,255,255,0.1);
transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
```
- **Hover:** brightness(1.1) + translateY(-2px)
- **Padding:** px-10 py-4 (desktop), full rounding
- **Text:** `on-primary` color, label-sm, uppercase, bold

### 6.4 Outline Button (Secondary CTA)
- **Border:** `primary/40`
- **Text:** Gold, label-sm, uppercase, bold
- **Hover:** `bg-primary/10`

### 6.5 Art Card
- **Aspect ratio:** 4/5 or 3/4
- **Image:** object-cover, grayscale(20%) → grayscale-0 on hover
- **Zoom:** scale(1.05-1.08) on hover, 0.8-1.2s cubic-bezier(0.16, 1, 0.3, 1)
- **Overlay:** Gradient from background/40 at bottom, fade in on hover
- **Container:** `surface-container-low` background, p-4
- **Badge (top-left):** `background/90`, gold text, tiny uppercase label
- **Content below:** Title (headline-md), artist (body-md italic, on-surface-variant), price (headline-md, gold)

### 6.6 Artist Card
- **Aspect ratio:** 3/4 portrait
- **Image:** grayscale → full color on hover (group-hover:grayscale-0)
- **Overlay:** Black gradient from bottom, reveals specialty label on hover
- **Content:** Name + Specialty line

### 6.7 Platform Overview Cards
- **Layout:** 3-column grid, middle card offset (md:-mt-12)
- **Background:** `surface-container-low`
- **Border:** `outline-variant/10`, hover → `primary/40`
- **Height:** 500px, flex-col, justify-end
- **Watermark icon:** Huge (text-9xl), low opacity (5%), grows on hover
- **Link:** Gold text, arrow icon, translates right on hover

### 6.8 Creation Process Steps
- **Layout:** 5-column horizontal with connecting line (desktop)
- **Step circle:** 64x64, background bg, border primary/30
- **Hover:** bg → gold, text → on-primary
- **Number:** Headline-md inside circle
- **Below:** Label + short description

### 6.9 Filter Sidebar (Marketplace)
- **Width:** 288px (w-72), sticky at top-32
- **Sections:** Subject (checkboxes), Artist Grade (radio), Size (button grid), Price Range (range slider)
- **Checkbox/Radio:** bg-transparent, border-outline-variant, accent-primary
- **Size buttons:** border, hover → gold border/text

### 6.10 Certificate of Heritage
- **Container:** `surface-container-high` + `primary/20` border, p-12/p-24
- **Card mockup:** 3/4 aspect, dark, decorative circle, QR placeholder, ref number
- **Gold accents throughout**

### 6.11 Live Session Card
- **Aspect:** 450px height, image background with gradient overlay
- **Badge:** Red "Live" pill with pulse animation, or gold "Workshop" pill
- **Content:** Title, host info, CTA button overlaid at bottom
- **Image hover:** scale(1.05)

### 6.12 Knowledge Hub Article Card
- **Image:** 16/9, grayscale → color on hover
- **Title:** 24px, hover → gold
- **Description:** line-clamp-2

### 6.13 Testimonial
- **Large quote mark:** 160px, primary/5 opacity, decorative background
- **Quote text:** headline-lg, italic, font-normal
- **Attribution:** Name in gold + location in label-sm uppercase

### 6.14 Footer
- **Background:** `surface-container-lowest`
- **Border-top:** `outline-variant/30`
- **Brand:** Large gold Playfair Display, bold, tracking-[0.2em]
- **Links:** label-sm uppercase in a row
- **Social icons:** Material symbols
- **Copyright:** label-sm, 60% opacity

---

## 7. Iconography

- **Library:** Google Material Symbols Outlined
- **Weight:** 300 (light), FILL 0
- **Size:** 24px default
- **Key icons used:** search, shopping_bag, account_circle, menu, close, verified, brush, temple_hindu, person_pin, edit_note, trending_flat, auto_awesome, history_edu, verified_user, ac_unit, west, east, tune, public, share, mail

---

## 8. Animation & Motion

| Animation | Duration | Easing | Trigger |
|---|---|---|---|
| Image zoom (art cards) | 0.8-1.2s | cubic-bezier(0.16, 1, 0.3, 1) | Hover |
| Gold button lift | 0.5s | cubic-bezier(0.4, 0, 0.2, 1) | Hover |
| Float (badge) | 6s | ease-in-out, infinite | Page load |
| Side drawer | 500ms | ease-in-out | Click |
| Color transition | 0.5-0.7s | ease | Hover |
| Grayscale → color | 0.7s | ease | Hover |
| Translate on hover | — | — | Hover (group) |
| Section fade-in | 1s | ease | Scroll (IntersectionObserver) |
| Pulse (live badge) | — | — | Infinite |

---

## 9. Responsive Design

- **Breakpoints:** Tailwind defaults (md: 768px, lg: 1024px, xl: 1280px)
- **Mobile first:** Hero stacks vertically, grids collapse to single column
- **Navigation:** Desktop horizontal links, mobile hamburger → side drawer
- **Sections:** `section-gap` (120px) on all, `margin-desktop` (80px) → `margin-mobile` (24px)
- **Typography:** Headline scales down (display-xl → headline-lg-mobile)
- **Filter sidebar:** Desktop static, mobile floating FAB triggering overlay

---

## 10. Interaction Patterns

1. **Hover reveals** — grayscale images bloom to color; overlays fade in with additional info
2. **Gold glow text** — `text-shadow: 0 0 15px rgba(212, 175, 55, 0.3)` on key headings
3. **Group hover** — parent hover triggers child animations (image zoom, link translation)
4. **Sticky nav** — transparent at top, gains backdrop-blur on scroll
5. **Smooth scroll** — anchor links use `scrollIntoView({ behavior: 'smooth' })`
6. **Intersection Observer** — sections fade up on enter
7. **Selection color** — `selection:bg-primary selection:text-on-primary`

---

## 11. Assets & Image Guidelines

- **Style:** Cinematic, editorial, high-contrast, museum-quality photography
- **Tone:** Dark backgrounds, warm spotlighting, emphasis on texture (gold, canvas, weathered hands)
- **Alt text pattern:** Detailed descriptive alt text provided via `data-alt` attributes
- **Placeholder images:** Google-hosted AIDA-generated images (lh3.googleusercontent.com/aida-public)
- **Aspect ratios:** Hero (varied), art cards (4/5, 3/4), artist portraits (3/4), editorial (21/9, 16/9, 1/1)

---

## 12. CSS Patterns

- **Custom scrollbar:** 4px wide, `#4d4635` thumb, `#14140f` track
- **Glass effect:** `backdrop-blur-md` + semi-transparent backgrounds
- **Gradient overlays:** `bg-gradient-to-t from-black/80 via-transparent to-transparent` for text readability on images
- **Split layout mask:** `clip-path: polygon(0 0, 100% 0, 85% 100%, 0% 100%)` (available utility)
- **Gold text gradient:** `background: linear-gradient(135deg, #d4af37, #f2ca50, #d4af37); -webkit-background-clip: text; -webkit-text-fill-color: transparent`
