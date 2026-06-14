# ThangkaHub — Complete Implementation Plan

> **For AI coding assistants.** Each phase is a self-contained work unit. Read the phase's prerequisites and file list before starting. Verify your work against the phase checklist before reporting done.

---

## How to Use This Plan

1. Hand one phase at a time to your AI assistant
2. Each phase lists exact files to create/edit, with descriptions
3. Phases build on each other — run them in order
4. Before starting any phase, the agent should read the files from previous phases that it will touch
5. After each phase, verify: `tsc --noEmit` passes, dev server starts, no errors

**Context budget per phase:** Most phases touch 5-15 files. If an agent needs to read more than 3 existing files to understand patterns, check `docs/DESIGN_SYSTEM.md` first — the patterns are documented there.

---

## Prerequisites for ALL Agents

Every agent must read these before starting ANY phase:

1. `docs/PROJECT_RULES.md` — coding rules, conventions, anti-patterns
2. `docs/DESIGN_SYSTEM.md` — design tokens, component patterns
3. `docs/ARCHITECTURE.md` — project structure, routes, data flow

---

---

## Phase 0: Project Scaffold & Foundation

**Goal:** Initialize a working Next.js 15 project with all configuration. The dev server must start and show a blank dark-themed page.

**Time estimate:** 3-4 hours

**Prerequisites:** None (first phase)

---

### Step 0.1 — Initialize Next.js Project

```bash
npx create-next-app@latest thangkahub \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-pnpm
cd thangkahub
```

### Step 0.2 — Install Dependencies

```bash
pnpm add drizzle-orm postgres zod zustand react-hook-form @hookform/resolvers resend @supabase/supabase-js @supabase/ssr
pnpm add -D drizzle-kit @types/pg
pnpm add framer-motion  # for animations in design system
```

ShadCN UI init (Tailwind 4 path):
```bash
pnpm dlx shadcn@latest init
```

Add ShadCN components as needed:
```bash
# We'll add them per-phase, but kick off with these:
pnpm dlx shadcn@latest add button input select checkbox radio-group slider badge card dialog dropdown-menu sheet tabs avatar skeleton toast separator
```

### Step 0.3 — Configure Tailwind 4 Design Tokens

**File: `src/styles/globals.css`**

Replace the entire file with:

```css
@import "tailwindcss";

/* Force class-based dark mode (Tailwind 4 uses prefers-color-scheme by default) */
@custom-variant dark (&:where(.dark, .dark *));

/* === DESIGN TOKENS === */
@theme {
  /* Colors — from docs/DESIGN_SYSTEM.md */
  --color-background: #14140f;
  --color-surface: #14140f;
  --color-surface-dim: #14140f;
  --color-surface-container-lowest: #0f0e0a;
  --color-surface-container-low: #1c1c16;
  --color-surface-container: #20201a;
  --color-surface-container-high: #2b2a24;
  --color-surface-container-highest: #36352f;
  --color-surface-bright: #3a3933;
  --color-surface-variant: #36352f;
  --color-on-background: #e6e2d9;
  --color-on-surface: #e6e2d9;
  --color-on-surface-variant: #d0c5af;
  --color-primary: #f2ca50;
  --color-primary-container: #d4af37;
  --color-primary-fixed: #ffe088;
  --color-primary-fixed-dim: #e9c349;
  --color-on-primary: #3c2f00;
  --color-on-primary-container: #554300;
  --color-on-primary-fixed: #241a00;
  --color-on-primary-fixed-variant: #574500;
  --color-secondary: #d1c4ba;
  --color-secondary-container: #504840;
  --color-secondary-fixed: #ede0d6;
  --color-secondary-fixed-dim: #d1c4ba;
  --color-on-secondary: #362f28;
  --color-on-secondary-container: #c2b6ad;
  --color-on-secondary-fixed: #211a14;
  --color-on-secondary-fixed-variant: #4d453e;
  --color-tertiary: #decbbf;
  --color-tertiary-container: #c1b0a4;
  --color-tertiary-fixed: #f2dfd2;
  --color-tertiary-fixed-dim: #d5c3b7;
  --color-on-tertiary: #392e26;
  --color-on-tertiary-container: #4f433a;
  --color-on-tertiary-fixed: #231a12;
  --color-on-tertiary-fixed-variant: #51443b;
  --color-error: #ffb4ab;
  --color-error-container: #93000a;
  --color-on-error: #690005;
  --color-on-error-container: #ffdad6;
  --color-outline: #99907c;
  --color-outline-variant: #4d4635;
  --color-inverse-surface: #e6e2d9;
  --color-inverse-primary: #735c00;
  --color-inverse-on-surface: #31302b;
  --color-surface-tint: #e9c349;

  /* Typography */
  --font-display-xl: "Playfair Display", serif;
  --font-headline-lg: "Playfair Display", serif;
  --font-headline-lg-mobile: "Playfair Display", serif;
  --font-headline-md: "Playfair Display", serif;
  --font-body-lg: "Inter", sans-serif;
  --font-body-md: "Inter", sans-serif;
  --font-label-sm: "Inter", sans-serif;

  /* Font sizes (with line-height + weight) */
  --text-body-lg: 18px;
  --text-body-lg--line-height: 32px;
  --text-headline-lg-mobile: 32px;
  --text-headline-lg-mobile--line-height: 40px;
  --text-headline-lg-mobile--font-weight: 600;
  --text-headline-lg: 48px;
  --text-headline-lg--line-height: 56px;
  --text-headline-lg--font-weight: 600;
  --text-display-xl: 84px;
  --text-display-xl--line-height: 92px;
  --text-display-xl--letter-spacing: -0.02em;
  --text-display-xl--font-weight: 700;
  --text-headline-md: 32px;
  --text-headline-md--line-height: 40px;
  --text-headline-md--font-weight: 500;
  --text-body-md: 16px;
  --text-body-md--line-height: 24px;
  --text-label-sm: 12px;
  --text-label-sm--line-height: 16px;
  --text-label-sm--letter-spacing: 0.1em;
  --text-label-sm--font-weight: 600;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-gutter: 32px;
  --spacing-margin-mobile: 24px;
  --spacing-margin-desktop: 80px;
  --spacing-container-max: 1440px;
  --spacing-section-gap: 120px;

  /* Border radius */
  --radius-DEFAULT: 2px;     /* Sharp — architectural */
  --radius-lg: 4px;
  --radius-xl: 8px;
  --radius-full: 12px;       /* Pills and badges */
}

/* === BASE STYLES === */
@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    background-color: var(--color-background);
    color: var(--color-on-background);
    font-family: var(--font-body-md);
    font-size: var(--text-body-md);
    line-height: var(--text-body-md--line-height);
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  ::selection {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
  }
}

/* === UTILITY LAYER === */
@utility text-display-xl { font-family: var(--font-display-xl); font-size: var(--text-display-xl); line-height: var(--text-display-xl--line-height); letter-spacing: var(--text-display-xl--letter-spacing); font-weight: var(--text-display-xl--font-weight); }
@utility text-headline-lg { font-family: var(--font-headline-lg); font-size: var(--text-headline-lg); line-height: var(--text-headline-lg--line-height); font-weight: var(--text-headline-lg--font-weight); }
@utility text-headline-md { font-family: var(--font-headline-md); font-size: var(--text-headline-md); line-height: var(--text-headline-md--line-height); font-weight: var(--text-headline-md--font-weight); }
@utility text-body-lg { font-family: var(--font-body-lg); font-size: var(--text-body-lg); line-height: var(--text-body-lg--line-height); }
@utility text-body-md { font-family: var(--font-body-md); font-size: var(--text-body-md); line-height: var(--text-body-md--line-height); }
@utility text-label-sm { font-family: var(--font-label-sm); font-size: var(--text-label-sm); line-height: var(--text-label-sm--line-height); letter-spacing: var(--text-label-sm--letter-spacing); font-weight: var(--text-label-sm--font-weight); }

@utility text-glow-gold {
  text-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
}

/* === CUSTOM ANIMATIONS === */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}
@utility animate-float {
  animation: float 6s ease-in-out infinite;
}

/* === CUSTOM SCROLLBAR === */
@utility custom-scrollbar {
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: #14140f; }
  &::-webkit-scrollbar-thumb { background: #4d4635; }
}

/* === GOLD LEAF BUTTON (referenced in design system, used by GoldButton component) === */
@utility gold-leaf-button {
  box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.1);
  background: linear-gradient(145deg, #d4af37, #b8860b);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-2px);
  }
}

/* === ART CARD HOVER === */
@utility art-card-reveal {
  img {
    transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
  }
  &:hover img {
    transform: scale(1.05);
  }
}
```

### Step 0.4 — Configure Fonts

**File: `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kathmandu Arts | Himalayan Heritage Archive",
  description:
    "Discover authentic Himalayan Thangka masterpieces. Bridging centuries of tradition with the global collector.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${playfairDisplay.variable} antialiased bg-background text-on-background custom-scrollbar`}
      >
        {children}
      </body>
    </html>
  );
}
```

### Step 0.5 — Configure Path Aliases & TypeScript

**File: `tsconfig.json`** — ensure these are in `compilerOptions.paths`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

### Step 0.6 — Set Up Environment Variables

**File: `.env.local`**

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

KHALTI_SECRET_KEY=test_secret_key
KHALTI_PUBLIC_KEY=test_public_key
ESEWA_SECRET_KEY=test_secret_key
ESEWA_PUBLIC_KEY=test_public_key
STRIPE_SECRET_KEY=sk_test_placeholder
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_test_placeholder

RESEND_API_KEY=re_test_placeholder

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Kathmandu Arts
NEXT_PUBLIC_USD_EXCHANGE_RATE=134
```

**File: `.env.example`** — same as above but with empty values (for reference, committable).

### Step 0.7 — Create Directory Structure

Create these empty directories (batch with mkdir -p):

```
src/components/ui/           (ShadCN components land here)
src/components/layout/
src/components/art/
src/components/artist/
src/components/marketplace/
src/components/cart/
src/components/shared/
src/components/knowledge/
src/lib/supabase/
src/lib/db/
src/lib/auth/
src/lib/payments/
src/lib/validators/
src/lib/utils/
src/lib/constants/
src/hooks/
src/types/
```

### Step 0.8 — Create Utility: cn()

**File: `src/lib/utils/cn.ts`**

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Step 0.9 — Verify Phase 0

```bash
pnpm dev
```

- [x] Dev server starts on localhost:3000
- [x] Page renders with dark background (`#14140f`)
- [x] Fonts load (Inter and Playfair Display)
- [x] `pnpm build` succeeds
- [x] `tsc --noEmit` passes

---

---

## Phase 1: Database Schema & Supabase Setup

**Goal:** Complete Drizzle ORM schema with all tables, run migrations, set up RLS policies, create Supabase client utilities, and seed sample data.

**Time estimate:** 5-6 hours

**Prerequisites:** Phase 0 complete (dev server running)

**Files to check before starting:** `docs/ARCHITECTURE.md` section 3 (Database Schema), `src/styles/globals.css`

---

### Step 1.1 — Create Supabase Clients

**File: `src/lib/supabase/client.ts`**

Browser-side Supabase client. Uses `createBrowserClient` from `@supabase/ssr`:

- Export `createClient()` that returns a Supabase client with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- One-liner: `return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)`

**File: `src/lib/supabase/server.ts`**

Server-side Supabase client. Uses `createServerClient` from `@supabase/ssr`:

- Export `createClient()` that uses `cookies()` from `next/headers`
- Cookie management: get from `cookies().getAll()`, set via `cookies().set()`, remove via `cookies().delete()`

**File: `src/lib/supabase/admin.ts`**

Service-role client for server-side operations that bypass RLS:

- Uses `createClient` from `@supabase/supabase-js` directly (not SSR)
- Uses `SUPABASE_SERVICE_ROLE_KEY`
- Only import in Server Components and Server Actions — NEVER in client code

### Step 1.2 — Create Drizzle Schema

**File: `src/lib/db/schema.ts`**

Write the complete database schema using Drizzle ORM. Tables:

**`profiles`**
```ts
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  role: pgEnum("user_role", ["client", "artist", "admin"])("role").default("client").notNull(),
  fullName: text("full_name").notNull(),
  avatarUrl: text("avatar_url"),
  phone: text("phone"),
  country: text("country"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
```

**`artists`**
```ts
export const artists = pgTable("artists", {
  id: uuid("id").primaryKey().references(() => profiles.id, { onDelete: "cascade" }),
  slug: text("slug").unique().notNull(),
  bio: text("bio").notNull(),
  lineage: text("lineage"),
  specialization: text("specialization").array(),
  experienceYears: integer("experience_years"),
  location: text("location"),
  awards: jsonb("awards"),
  studioImages: text("studio_images").array(),
  isVerified: boolean("is_verified").default(false),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
```

**`artworks`**
```ts
export const artworks = pgTable("artworks", {
  id: uuid("id").primaryKey().defaultRandom(),
  artistId: uuid("artist_id").references(() => artists.id, { onDelete: "cascade" }).notNull(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  deity: text("deity"),
  style: text("style"),
  medium: text("medium"),
  materials: text("materials").array(),
  dimensionsCm: jsonb("dimensions_cm"),
  priceNpr: integer("price_npr").notNull(),
  priceUsd: integer("price_usd"),
  yearCreated: integer("year_created"),
  images: text("images").array().notNull(),
  status: pgEnum("artwork_status", ["available", "sold", "reserved", "draft"])("status").default("draft").notNull(),
  isVerified: boolean("is_verified").default(false),
  certificateId: uuid("certificate_id").references(() => certificates.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
```

**`artwork_categories`**
```ts
export const artworkCategories = pgTable("artwork_categories", {
  artworkId: uuid("artwork_id").references(() => artworks.id, { onDelete: "cascade" }).notNull(),
  category: text("category").notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.artworkId, table.category] }),
}));
```

**`certificates`**
```ts
export const certificates = pgTable("certificates", {
  id: uuid("id").primaryKey().defaultRandom(),
  artworkId: uuid("artwork_id").references(() => artworks.id, { onDelete: "cascade" }).unique(),
  certificateNo: text("certificate_no").unique().notNull(),
  issuedDate: date("issued_date").notNull(),
  materialsAudit: jsonb("materials_audit"),
  blockchainRef: text("blockchain_ref"),
  qrCodeUrl: text("qr_code_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
```

**`creation_steps`**
```ts
export const creationSteps = pgTable("creation_steps", {
  id: uuid("id").primaryKey().defaultRandom(),
  artworkId: uuid("artwork_id").references(() => artworks.id, { onDelete: "cascade" }).notNull(),
  stepNumber: integer("step_number").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  durationDays: integer("duration_days"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
```

**`orders`**
```ts
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id").references(() => profiles.id).notNull(),
  status: pgEnum("order_status", ["pending", "confirmed", "shipped", "delivered", "cancelled"])("status").default("pending").notNull(),
  totalNpr: integer("total_npr").notNull(),
  totalUsd: integer("total_usd"),
  paymentMethod: text("payment_method"),
  paymentId: text("payment_id"),
  shippingName: text("shipping_name").notNull(),
  shippingAddress: jsonb("shipping_address").notNull(),
  shippingPhone: text("shipping_phone"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
```

**`order_items`**
```ts
export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
  artworkId: uuid("artwork_id").references(() => artworks.id).notNull(),
  priceNpr: integer("price_npr").notNull(),
  quantity: integer("quantity").default(1),
});
```

**`cart_items`**
```ts
export const cartItems = pgTable("cart_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }).notNull(),
  artworkId: uuid("artwork_id").references(() => artworks.id, { onDelete: "cascade" }).notNull(),
  addedAt: timestamp("added_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uniqueUserArtwork: unique().on(table.userId, table.artworkId),
}));
```

**`wishlist_items`**
```ts
export const wishlistItems = pgTable("wishlist_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }).notNull(),
  artworkId: uuid("artwork_id").references(() => artworks.id, { onDelete: "cascade" }).notNull(),
  addedAt: timestamp("added_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uniqueUserArtwork: unique().on(table.userId, table.artworkId),
}));
```

**Also define all `pgEnum` exports** at the top of the file before the table definitions.

Export all type inferences:
```ts
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Artist = typeof artists.$inferSelect;
export type NewArtist = typeof artists.$inferInsert;
export type Artwork = typeof artworks.$inferSelect;
export type NewArtwork = typeof artworks.$inferInsert;
// ... all others
```

### Step 1.3 — Configure Drizzle

**File: `drizzle.config.ts`**

```ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./supabase/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

Set `DATABASE_URL` in `.env.local` — get it from Supabase dashboard (Settings → Database → Connection string → URI, replace `[YOUR-PASSWORD]`).

### Step 1.4 — Create DB Client

**File: `src/lib/db/index.ts`**

```ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

// For queries
const client = postgres(connectionString);
export const db = drizzle(client, { schema });

// Export schema for convenience
export * as schema from "./schema";
```

### Step 1.5 — Run Migrations & Verify

```bash
pnpm drizzle-kit generate   # generates migration files
pnpm drizzle-kit push       # pushes to Supabase
```

### Step 1.6 — Set Up RLS Policies

**File: `supabase/rls_policies.sql`** (create and execute in Supabase SQL Editor)

```sql
-- Profiles: Users can read all profiles, but only update their own
CREATE POLICY "profiles_read_all" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

-- Profiles: Only admins can change roles
CREATE POLICY "profiles_admin_update_role" ON public.profiles
  FOR UPDATE USING (
    EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Artists: Anyone can read, only the artist can update
CREATE POLICY "artists_read_all" ON public.artists
  FOR SELECT USING (true);

CREATE POLICY "artists_update_own" ON public.artists
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "artists_insert_own" ON public.artists
  FOR INSERT WITH CHECK (id = auth.uid());

-- Artworks: Available artworks readable by all; drafts only by artist owner
CREATE POLICY "artworks_read_available" ON public.artworks
  FOR SELECT USING (status = 'available' OR status = 'reserved' OR status = 'sold');

CREATE POLICY "artworks_read_own_drafts" ON public.artworks
  FOR SELECT USING (artist_id = auth.uid());

CREATE POLICY "artworks_insert_artist" ON public.artworks
  FOR INSERT WITH CHECK (artist_id = auth.uid());

CREATE POLICY "artworks_update_own" ON public.artworks
  FOR UPDATE USING (artist_id = auth.uid());

-- Cart: Users can only see/manage their own cart
CREATE POLICY "cart_own" ON public.cart_items
  FOR ALL USING (user_id = auth.uid());

-- Wishlist: Users can only see/manage their own wishlist
CREATE POLICY "wishlist_own" ON public.wishlist_items
  FOR ALL USING (user_id = auth.uid());

-- Orders: Users can read their own orders; artists can read orders containing their artworks
CREATE POLICY "orders_read_customer" ON public.orders
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "orders_read_artist" ON public.orders
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM public.order_items oi
      JOIN public.artworks a ON oi.artwork_id = a.id
      WHERE oi.order_id = public.orders.id AND a.artist_id = auth.uid()
    )
  );

-- Admin full access on all tables (add for each table)
CREATE POLICY "admin_all_artworks" ON public.artworks
  FOR ALL USING (
    EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
-- Repeat admin_all for: profiles, artists, orders, certificates, creation_steps
```

### Step 1.7 — Seed Sample Data

**File: `supabase/seed.sql`**

Insert sample data for development:
- 1 admin profile + auth user
- 4 artists (Master Tenzin, Ani Choying, Lobsang R., Karma S.) matching the design
- 6 artworks across different categories and price points
- 2 certificates
- 5 creation steps per artwork
- No orders or cart items (those are user-generated)

Use UUIDs that match Supabase Auth user IDs (create test users in Supabase dashboard first, then reference their UUIDs here).

Sample artwork data should match what's shown in the design (Medicine Buddha, White Tara, Wheel of Life, Kalachakra Mandala, Mahakala Protector, and one more).

### Step 1.8 — Verify Phase 1

- [x] `pnpm drizzle-kit generate` produces migration files
- [x] `pnpm drizzle-kit push` runs without errors
- [x] Tables visible in Supabase dashboard
- [x] RLS policies visible in Supabase (SQL Editor → run the policy SQL)
- [x] Seed data queryable from Supabase dashboard
- [x] `tsc --noEmit` passes
- [x] Importing `db` and `schema` from `@/lib/db` works without errors

---

---

## Phase 2: Authentication System

**Goal:** Complete auth flow with login, register, middleware, role-based routing, and Supabase session management. User can register as client, login, and be redirected based on role.

**Time estimate:** 5-6 hours

**Prerequisites:** Phase 1 complete (database tables exist, RLS in place)

**Files to read before starting:** `src/lib/supabase/server.ts`, `src/lib/supabase/client.ts`, `src/lib/db/schema.ts`, `docs/ARCHITECTURE.md` section 5

---

### Step 2.1 — Auth Middleware

**File: `src/middleware.ts`**

Use Supabase's `updateSession` helper pattern:

```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protected routes: /dashboard/*
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Auth routes: redirect to dashboard if already logged in
  if (["/login", "/register"].includes(request.nextUrl.pathname)) {
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
```

### Step 2.2 — Auth Server Actions

**File: `src/lib/auth/actions.ts`**

Server actions for auth operations. All must be `"use server"`:

1. **`signUp(formData: FormData)`**
   - Extract email, password, fullName from FormData
   - Validate with Zod (email, password min 8 chars, fullName required)
   - Call `supabase.auth.signUp()` with redirect to `/verify`
   - On success: insert into `profiles` table with role='client'
   - Return `{ error?: string; success?: boolean }`

2. **`signIn(formData: FormData)`**
   - Extract email, password
   - Call `supabase.auth.signInWithPassword()`
   - On success: redirect to `/dashboard`
   - Return `{ error?: string }`

3. **`signOut()`**
   - Call `supabase.auth.signOut()`
   - Redirect to `/`

### Step 2.3 — Auth Validation Schemas

**File: `src/lib/validators/auth.ts`**

```ts
import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(1, "Name is required"),
});

export const signInSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password is required"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
```

### Step 2.4 — Auth Layout (marketing-free wrapper)

**File: `src/app/(auth)/layout.tsx`**

Minimal layout for auth pages:
- No navbar, no footer
- Centered card on dark background
- Logo at top: "Kathmandu Arts" in gold Playfair Display

### Step 2.5 — Login Page

**File: `src/app/(auth)/login/page.tsx`**

Client component:
- Email input (ShadCN `Input`)
- Password input with show/hide toggle
- Submit button using ShadCN `Button` (gold variant)
- Error display below form (red text, ShadCN `Alert` style)
- "Don't have an account? Register" link
- Form calls `signIn()` server action via `useActionState` or direct call
- Loading state on submit button (spinner + disabled)

### Step 2.6 — Register Page

**File: `src/app/(auth)/register/page.tsx`**

Client component:
- Full name input
- Email input
- Password input
- Confirm password (client-side match check)
- Submit button (gold)
- "Already have an account? Sign in" link
- Form calls `signUp()` server action
- Success state: "Check your email to verify your account"

### Step 2.7 — Verify Page

**File: `src/app/(auth)/verify/page.tsx`**

Simple server component:
- "Check your email" message
- "We sent a verification link to your email address"
- Link to resend (optional for MVP — stub it)

### Step 2.8 — Auth Callback Route

**File: `src/app/api/auth/callback/route.ts`**

Handles Supabase OAuth callbacks (Google, etc. — set up later but create the route now):
- Exchange code for session
- Redirect to `/dashboard`

### Step 2.9 — Role Utilities

**File: `src/lib/auth/roles.ts`**

```ts
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/db/schema";

export async function getCurrentUser(): Promise<Profile | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  
  return profile ?? null;
}

export async function requireRole(role: "client" | "artist" | "admin") {
  const profile = await getCurrentUser();
  if (!profile) throw new Error("Not authenticated");
  if (profile.role !== role && profile.role !== "admin") {
    throw new Error("Insufficient permissions");
  }
  return profile;
}

export function isAdmin(profile: Profile) { return profile.role === "admin"; }
export function isArtist(profile: Profile) { return profile.role === "artist" || profile.role === "admin"; }
```

### Step 2.10 — Verify Phase 2

- [x] Register a new user → profile created in `profiles` table with role='client'
- [x] Login → redirected to `/dashboard`
- [x] Visiting `/dashboard` while logged out → redirected to `/login`
- [x] Visiting `/login` while logged in → redirected to `/dashboard`
- [x] Sign out works
- [x] `tsc --noEmit` passes
- [x] All RLS policies correctly restrict access (test by querying from client)

---

---

## Phase 3: Layout Shell & Design System Components

**Goal:** Build the shared layout (Navbar, Footer, SideDrawer) and all reusable shared components. Every page from this point forward uses the marketing layout.

**Time estimate:** 6-8 hours

**Prerequisites:** Phase 2 complete

**Files to read before starting:** `docs/DESIGN_SYSTEM.md` sections 6.1-6.3 (Navbar, Side Drawer, Gold Button), `src/styles/globals.css`, `src/app/layout.tsx`

---

### Step 3.1 — Gold Leaf Button

**File: `src/components/shared/gold-button.tsx`**

```tsx
import { cn } from "@/lib/utils/cn";
import { Button, type ButtonProps } from "@/components/ui/button";

interface GoldButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export function GoldButton({ className, children, ...props }: GoldButtonProps) {
  return (
    <Button
      className={cn(
        "gold-leaf-button px-10 py-4 h-auto rounded-full font-label-sm text-label-sm uppercase text-on-primary font-bold tracking-widest",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
```

### Step 3.2 — Outline Button

**File: `src/components/shared/outline-button.tsx`**

Similar to GoldButton but:
- `border border-primary/40` with transparent background
- Text in `text-primary`
- Hover: `bg-primary/10`

### Step 3.3 — Verified Badge

**File: `src/components/shared/badge-verified.tsx`**

```tsx
export function BadgeVerified() {
  return (
    <span className="inline-flex items-center gap-1 bg-secondary-container/30 text-primary-container text-[10px] font-label-sm uppercase tracking-widest px-2 py-1 rounded-sm">
      <span className="material-symbols-outlined text-[12px]">verified</span>
      Verified Authentic
    </span>
  );
}
```

Note: Material Symbols are loaded via a `<link>` in the root layout. Add this to `src/app/layout.tsx`:
```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
```

Add the global CSS for Material Symbols:
```css
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}
```

### Step 3.4 — Section Header

**File: `src/components/shared/section-header.tsx`**

Reusable section heading component:
- Props: `eyebrow?: string`, `title: string`, `description?: string`, `align?: "left" | "center"`
- Eyebrow: small gold label-sm uppercase with a gold line beside it
- Title: headline-lg in on-background
- Description: body-lg in on-surface-variant, italic

### Step 3.5 — Navbar

**File: `src/components/layout/navbar.tsx`**

Server component (no `"use client"` — interactive parts are leaf client components):

Structure:
```
<header> fixed, top-0, z-50, bg-background/90, backdrop-blur-md, border-b border-outline-variant/20
  <nav> flex, justify-between, max-w-container-max, mx-auto, px-margin-desktop, py-unit
    <Logo> — Playfair Display, text-primary, tracking-widest, uppercase, bold
    <NavLinks> — hidden md:flex, space-x-10
      "Marketplace" — active (gold + border-b-2)
      "Artists" — inactive (on-surface-variant, hover:text-primary)
      "Commissions" — inactive
      "Knowledge Hub" — inactive
    <IconButtons> — flex, space-x-6
      Search (icon button)
      Cart (icon button + badge with count "0")
      Account (icon button → login or avatar dropdown)
      Menu (hamburger, md:hidden)
```

The cart badge and account dropdown can be simple placeholder buttons for now (they'll be wired up in Phase 7).

### Step 3.6 — Side Drawer (Mobile Menu)

**File: `src/components/layout/side-drawer.tsx`**

Client component (`"use client"`):

- Uses ShadCN `Sheet` component as base
- Full-height, right side, white/cream background (`#F5F1E8`)
- Links in dark brown (`#2A2018`), large Playfair Display
- Close button (X icon) in top right
- "Inquiries" section at bottom with email
- State managed by a simple `useState` toggle
- Accepts an `open` prop and `onClose` callback

Install ShadCN Sheet: `pnpm dlx shadcn@latest add sheet`

### Step 3.7 — Footer

**File: `src/components/layout/footer.tsx`**

Server component:
- Background: `bg-surface-container-lowest`, border-t
- Brand: KATHMANDU ARTS in gold headline-lg Playfair Display, bold, tracking-[0.2em], centered
- Nav links row: 5 links (Archive, Master Artists, Private Commissions, Cultural Preservation, Privacy Policy), label-sm uppercase, centered, flex-wrap
- Social icons row: 3 icons (public, share, mail), centered
- Copyright line: label-sm, 60% opacity, centered

### Step 3.8 — Marketing Layout

**File: `src/app/(marketing)/layout.tsx`**

```tsx
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-24">{children}</main>
      <Footer />
    </>
  );
}
```

### Step 3.9 — Home Page (placeholder)

**File: `src/app/(marketing)/page.tsx`**

For now, create a minimal page that proves the layout works:
```tsx
export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-display-xl text-primary">Kathmandu Arts</h1>
    </div>
  );
}
```

We'll build the full home page in Phase 9.

### Step 3.10 — Dashboard Layout (placeholder)

**File: `src/app/(dashboard)/layout.tsx`**

- Sidebar (left) with role-based navigation
- Header with user avatar + name
- Main content area
- For now, a simple sidebar with placeholder links is enough. We'll flesh this out in Phase 8.

### Step 3.11 — Dashboard Redirect

**File: `src/app/(dashboard)/page.tsx`**

Server component that redirects based on role:
- Admin → `/dashboard/admin`
- Artist → `/dashboard/artist`
- Client → `/dashboard/customer`

### Step 3.12 — Verify Phase 3

- [x] Navbar renders on all marketing pages, fixed and scrolls with page
- [x] Mobile hamburger opens side drawer, close button closes it
- [x] Gold buttons have the gradient + hover lift effect
- [x] Footer renders at bottom of every marketing page
- [x] All text uses correct tokens from design system
- [x] Responsive: navbar collapses to hamburger on mobile, footer links stack
- [x] `tsc --noEmit` passes
- [x] `pnpm build` succeeds

---

---

## Phase 4: Artist Profile System

**Goal:** Admin can upgrade a user to artist role. Artists can create/edit their profile. Public can view artist directory and individual artist profiles.

**Time estimate:** 6-7 hours

**Prerequisites:** Phase 3 complete

**Files to read before starting:** `docs/DESIGN_SYSTEM.md` section 6.6 (Artist Card), `src/lib/db/schema.ts` (artists table), `src/lib/auth/roles.ts`

---

### Step 4.1 — Artist Validators

**File: `src/lib/validators/artist.ts`**

Zod schema for artist profile:
```ts
export const artistProfileSchema = z.object({
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
  bio: z.string().min(10).max(2000),
  lineage: z.string().max(500).optional(),
  specialization: z.array(z.string()).min(1).max(5),
  experienceYears: z.number().int().min(0).max(80).optional(),
  location: z.string().max(100).optional(),
  awards: z.array(z.object({ title: z.string(), year: z.number() })).optional(),
});
```

### Step 4.2 — Artist Server Actions

**File: `src/lib/auth/artist-actions.ts`**

All `"use server"`:

1. **`createArtistProfile(formData: FormData)`** — called by admin or on first artist setup
2. **`updateArtistProfile(artistId: string, data: ArtistProfileInput)`** — validates, updates artist row
3. **`upgradeToArtist(userId: string)`** — admin only, sets `profiles.role = 'artist'` and creates artist row
4. **`getArtistBySlug(slug: string)`** — public, returns artist + artworks count

### Step 4.3 — Artist Card

**File: `src/components/artist/artist-card.tsx`**

Based on design system section 6.6:

- Aspect ratio: 3/4 portrait image container
- Image: grayscale → full color on group hover (group-hover:grayscale-0)
- Overlay: black gradient from bottom, fades in on hover, shows specialty label
- Below image: name (headline-md, on-surface), specialty line (label-sm uppercase, on-surface-variant)
- Accepts `artist: { slug, name, specialization, imageUrl, experienceYears }` prop
- Wrapped in `<Link href={/artists/${slug}}>` for navigation

### Step 4.4 — Artist Grid

**File: `src/components/artist/artist-grid.tsx`**

- Responsive grid: 1 col mobile, 2 col md, 4 col desktop
- Uses `gap-gutter`
- Children: ArtistCard array

### Step 4.5 — Artist Directory Page

**File: `src/app/(marketing)/artists/page.tsx`**

Server component:
- "The Living Lineage" headline section
- Subtitle: "Masters whose brushes are guided by meditation and sacred geometry"
- "View All Artists" link (border-b gold, label-sm uppercase)
- Artist grid with all artists from DB
- Query: `db.select().from(artists).where(eq(artists.isVerified, true))`

### Step 4.6 — Artist Profile Page

**File: `src/app/(marketing)/artists/[slug]/page.tsx`**

Server component. This is the full artist profile — the most content-rich artist page.

**Layout:**
1. Large hero image (full width, aspect-[21/9] or similar)
2. Artist name (headline-lg)
3. Lineage + location (body-lg, on-surface-variant, italic)
4. Bio section (body-lg, max-w-3xl)
5. Stats row: Experience years, artworks count, verified badge
6. Specializations displayed as badges/chips
7. Awards timeline (if any)
8. Portfolio grid — all artworks by this artist (ArtCard grid, reuse from Phase 5)

### Step 4.7 — Artist Profile Edit Page (Dashboard)

**File: `src/app/(dashboard)/artist/profile/page.tsx`**

Client component:
- Form with all artist fields (bio, lineage, specializations, experience, location, awards)
- Studio image upload (Supabase Storage)
- Save button (GoldButton)
- Uses `useActionState` or React Hook Form + Zod

### Step 4.8 — Verify Phase 4

- [x] Admin can upgrade a client to artist role
- [x] Artist can view and edit their profile in dashboard
- [x] `/artists` page shows all verified artists
- [x] `/artists/[slug]` shows full profile with portfolio
- [x] Artist cards render with grayscale → color hover
- [x] `tsc --noEmit` passes

---

---

## Phase 5: Artwork Management System

**Goal:** Artists can upload, edit, and manage artworks. Each artwork has images, creation steps, and an authenticity certificate. This is the core data that powers the marketplace.

**Time estimate:** 8-10 hours

**Prerequisites:** Phase 4 complete (artist profiles exist)

**Files to read before starting:** `docs/DESIGN_SYSTEM.md` section 6.5 (Art Card), `src/lib/db/schema.ts` (artworks, certificates, creation_steps tables)

---

### Step 5.1 — Artwork Validators

**File: `src/lib/validators/artwork.ts`**

Zod schemas:
```ts
export const artworkSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(20).max(5000),
  deity: z.string().max(100).optional(),
  style: z.string().max(100).optional(),
  medium: z.string().max(200).optional(),
  materials: z.array(z.string()).optional(),
  dimensionsCm: z.object({ height: z.number(), width: z.number() }).optional(),
  priceNpr: z.number().int().min(1000),
  priceUsd: z.number().int().optional(),
  yearCreated: z.number().int().min(1900).max(new Date().getFullYear()),
  categories: z.array(z.string()).min(1),
  status: z.enum(["available", "draft"]).default("draft"),
});

export const creationStepSchema = z.object({
  stepNumber: z.number().int().min(1),
  title: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  durationDays: z.number().int().min(1).optional(),
});
```

### Step 5.2 — Artwork Server Actions

**File: `src/lib/artwork-actions.ts`**

All `"use server"`:

1. **`createArtwork(data: ArtworkInput)`** — inserts artwork row, links categories, generates slug
2. **`updateArtwork(id: string, data: Partial<ArtworkInput>)`** — updates artwork
3. **`uploadArtworkImage(artworkId: string, file: File)`** — uploads to Supabase Storage bucket `artworks/`, appends URL to artwork.images array
4. **`deleteArtworkImage(artworkId: string, imageUrl: string)`** — removes from Storage and from array
5. **`addCreationStep(artworkId: string, data: CreationStepInput, image?: File)`** — inserts step + uploads image
6. **`removeCreationStep(stepId: string)`** — deletes step and its image
7. **`generateCertificate(artworkId: string)`** — creates certificate record, sets `certificate_no` as `KA-{year}-{seq}`
8. **`publishArtwork(id: string)`** — sets status to 'available'
9. **`deleteArtwork(id: string)`** — sets status to 'draft' (soft delete) or full delete if never published

### Step 5.3 — Slug Generation Utility

**File: `src/lib/utils/slug.ts`**

```ts
export function generateSlug(title: string, existingSlugs: string[] = []): string {
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  
  // If slug exists, append a number
  if (existingSlugs.includes(slug)) {
    let counter = 2;
    while (existingSlugs.includes(`${slug}-${counter}`)) counter++;
    slug = `${slug}-${counter}`;
  }
  
  return slug;
}
```

### Step 5.4 — Artwork Upload Form (Dashboard)

**File: `src/app/(dashboard)/artist/artworks/new/page.tsx`**

Multi-step form (client component):

**Step 1 — Basic Info:**
- Title, description (rich text or textarea), deity, style, medium
- Categories (checkboxes: Mandala, Deity, Life of Buddha, Landscape, Abstract, Other)

**Step 2 — Pricing & Details:**
- Price (NPR), dimensions (height x width cm), year created, materials (multi-select chips)
- Status: Draft or Available

**Step 3 — Images:**
- Drag-and-drop zone for multiple images (use a simple file input for MVP)
- Preview thumbnails with delete button
- First image = primary (indicated)
- Max 10 images, max 5MB each

**Step 4 — Creation Steps (optional):**
- Add/remove step rows
- Each step: step number (auto), title, description, duration, image upload
- "Add Step" button

**Step 5 — Preview & Submit:**
- Shows all entered data
- "Save as Draft" or "Publish" buttons

Progress indicator at top showing current step (1-5).

### Step 5.5 — Artwork List (Dashboard)

**File: `src/app/(dashboard)/artist/artworks/page.tsx`**

Server component:
- Table/card list of all artist's artworks
- Columns: thumbnail, title, status badge, price, date created
- Actions: Edit, Delete
- Filter tabs: All, Published, Drafts
- Link to "Add New Artwork"

### Step 5.6 — Artwork Edit Page (Dashboard)

**File: `src/app/(dashboard)/artist/artworks/[id]/edit/page.tsx`**

Client component:
- Same form as "new" but pre-populated
- Additional: manage creation steps section
- Certificate preview if one exists
- Delete button with confirmation

### Step 5.7 — Supabase Storage Bucket Setup

In Supabase dashboard or via SQL:
```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('artworks', 'artworks', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('artists', 'artists', true);

-- Storage policies: authenticated users can upload
CREATE POLICY "artworks_storage_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'artworks' AND auth.role() = 'authenticated');

CREATE POLICY "artworks_storage_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'artworks');

CREATE POLICY "artists_storage_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'artists' AND auth.role() = 'authenticated');

CREATE POLICY "artists_storage_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'artists');
```

### Step 5.8 — Verify Phase 5

- [x] Artist can upload artwork with multiple images
- [x] Images appear correctly from Supabase Storage
- [x] Creation steps can be added with images
- [x] Certificate is generated with correct certificate_no format
- [x] Artwork can be saved as draft and published
- [x] Edit page loads with pre-populated data
- [x] `tsc --noEmit` passes

---

---

## Phase 6: Public Marketplace (Browse, Search, Filter, Detail)

**Goal:** The core marketplace experience. Users browse, search, filter, and view artwork details with the story-driven layout. Artist directory is already done from Phase 4, but we'll add search/filter integration.

**Time estimate:** 10-12 hours

**Prerequisites:** Phase 5 complete (artworks exist in database with images)

**Files to read before starting:** `docs/DESIGN_SYSTEM.md` sections 6.4, 6.5, 6.9, `docs/ARCHITECTURE.md` section 6.2 (marketplace component tree)

---

### Step 6.1 — Art Card Component

**File: `src/components/art/art-card.tsx`**

Based on design system section 6.5:

Props:
```ts
interface ArtCardProps {
  artwork: {
    slug: string;
    title: string;
    images: string[];
    priceNpr: number;
    priceUsd?: number;
    status: "available" | "reserved" | "sold";
    isVerified: boolean;
    artist: {
      name: string;
      slug: string;
    };
  };
}
```

Structure:
```
<Link href={/marketplace/${slug}} className="group art-card-reveal">
  <div> (image container, bg-surface-container-low, p-4)
    <div> (overflow-hidden, aspect-[4/5])
      <img> (object-cover, grayscale-[20%], group-hover:grayscale-0, group-hover:scale-105)
    </div>
    <Badge> (top-left absolute: "Available"/"Reserve Only"/"Sold", styled differently per status)
    <GradientOverlay> (bg-gradient-to-t from-background/40, fades in on hover)
  </div>
  <div> (flex justify-between)
    <div>
      <Title> (headline-md, group-hover:text-primary)
      <Artist> (body-md, on-surface-variant, italic)
      <VerifiedBadge> (if verified)
    </div>
    <Price> (headline-md, text-primary)
  </div>
</Link>
```

### Step 6.2 — Art Grid

**File: `src/components/art/art-grid.tsx`**

- Responsive grid: 1 col mobile, 2 col md, 3 col lg
- Uses `gap-x-gutter gap-y-20`
- Takes `artworks: ArtCardProps["artwork"][]`
- Renders array of ArtCard

### Step 6.3 — Filter Sidebar

**File: `src/components/marketplace/filter-sidebar.tsx`**

Client component. Based on design system section 6.9.

Sticky at `top-32`, width `w-72` (hidden on mobile, shown via mobile FAB overlay).

Filter sections:
1. **Subject** (checkboxes): Mandala, Deities, Life of Buddha, Landscape, Abstract
2. **Artist Grade** (radio): Master Artisan, Senior Artist
3. **Size** (button grid): Small, Medium, Large, Grand
4. **Price Range** (range slider): min/max with NPR labels

Each filter change updates URL searchParams via `useRouter()` and `useSearchParams()`.

Props:
```ts
interface FilterSidebarProps {
  searchParams: { [key: string]: string | undefined };
}
```

### Step 6.4 — Search Bar

**File: `src/components/marketplace/search-bar.tsx`**

Client component:
- Input with search icon (material symbol)
- Debounced (300ms) — stores value in URL searchParam `?q=`
- Optional: dropdown with quick suggestions as user types (fetch from `/api/search`)

### Step 6.5 — Sort Select

**File: `src/components/marketplace/sort-select.tsx`**

Client component:
- ShadCN `Select` dropdown
- Options: Newest Arrivals, Price: High to Low, Price: Low to High
- Updates URL searchParam `?sort=`

### Step 6.6 — Active Filters Display

**File: `src/components/marketplace/active-filters.tsx`**

Client component:
- Row of removable chips showing active filters
- Each chip has label + X button
- Clicking X removes that filter from URL
- Also a "Clear All" button

### Step 6.7 — Pagination Component

**File: `src/components/marketplace/pagination.tsx`**

Client component:
- Page numbers with current highlighted (gold)
- Prev/next arrows (Material Symbols: west/east)
- Ellipsis for gaps
- Updates URL searchParam `?page=`

### Step 6.8 — Marketplace Page (Main Listing)

**File: `src/app/(marketing)/marketplace/page.tsx`**

Server component that reads `searchParams`:

```tsx
interface MarketplacePageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}
```

**Data fetching logic:**
```ts
async function getArtworks(searchParams: Record<string, string | undefined>) {
  const page = Number(searchParams.page) || 1;
  const pageSize = 12;
  
  let query = db
    .select()
    .from(artworks)
    .leftJoin(artists, eq(artworks.artistId, artists.id))
    .leftJoin(certificates, eq(artworks.certificateId, certificates.id))
    .where(eq(artworks.status, "available"));

  // Apply filters from searchParams
  if (searchParams.deity) { /* filter by deity IN(...) */ }
  if (searchParams.style) { /* filter by style */ }
  if (searchParams.categories) { /* join artwork_categories, filter */ }
  if (searchParams.price_min) { /* gte price */ }
  if (searchParams.price_max) { /* lte price */ }
  if (searchParams.q) { /* full-text search on title + description + deity */ }
  
  // Sort
  switch (searchParams.sort) {
    case "price_asc": /* order by priceNpr asc */ break;
    case "price_desc": /* order by priceNpr desc */ break;
    default: /* order by created_at desc */ break;
  }

  const count = /* same query but count */;
  const items = await query.limit(pageSize).offset((page - 1) * pageSize);
  
  return { items, total: count, page, pageSize };
}
```

**Page structure:**
```
<div className="flex flex-col lg:flex-row gap-gutter">
  <FilterSidebar searchParams={searchParams} />
  <section className="flex-grow">
    <div className="flex justify-between items-baseline mb-8 pb-4 border-b border-outline-variant/10">
      <p className="font-label-sm text-on-surface-variant">Showing {total} Masterpieces</p>
      <div className="flex items-center gap-4">
        <span className="font-label-sm text-on-surface-variant uppercase">Sort By</span>
        <SortSelect />
      </div>
    </div>
    <SearchBar />
    <ActiveFilters searchParams={searchParams} />
    <ArtGrid artworks={items} />
    <Pagination page={page} totalPages={Math.ceil(total / pageSize)} />
  </section>
</div>
```

### Step 6.9 — Artwork Detail Page

**File: `src/app/(marketing)/marketplace/[slug]/page.tsx`**

Server component. This is the "story-driven" artwork page — the most important page for buyers.

**Layout (based on design):**
1. **Image gallery** — main large image + thumbnail strip below. Click thumbnails to swap main. (Make this a client component for interactivity, rest is server-rendered.)

2. **Info column (right side):**
   - Title (headline-lg)
   - Artist name + link (body-lg, on-surface-variant, italic)
   - Price display: NPR primary, USD secondary
   - Status badge
   - Verified badge + certificate link
   - "Add to Cart" gold button
   - "Buy Now" outline button

3. **Story section (full width below):**
   - "The Story" heading (headline-md)
   - Rich description text
   - Deity information section
   - Symbolism interpretation section
   - Materials section with icons:
     - If gold: "24K Gold Leaf" + verified icon
     - Pigments: list of natural mineral pigments
     - Canvas: cotton/silk canvas info

4. **Creation Journey section (if creation steps exist):**
   - Timeline-style display
   - Each step: number circle, title, description, progress image
   - Vertical connecting line between steps

5. **Artist preview card** — mini version of ArtistCard, linking to full profile

6. **Related artworks** — same artist or same category, 3-4 cards

**File: `src/components/art/art-image-gallery.tsx`** (client component for the gallery):
- Props: `images: string[]`
- Main image display (large)
- Thumbnail row below
- Click thumbnail → set as main (useState)
- Keyboard navigation (left/right arrows)

### Step 6.10 — Search API Route

**File: `src/app/api/search/route.ts`**

GET endpoint for quick-search autocomplete:
- Query param: `?q=`
- Returns top 5 matching artwork titles + slugs
- Used by SearchBar for dropdown suggestions
- Uses PostgreSQL `tsvector` full-text search

### Step 6.11 — Verify Phase 6

- [x] `/marketplace` loads with artwork grid
- [x] Filtering by category, deity, style, price works
- [x] URL updates when filters change
- [x] Search works (debounced, updates results)
- [x] Sort changes order
- [x] Pagination works
- [x] Artwork detail page shows images, story, creation steps, certificate
- [x] Image gallery switches images on click
- [x] Mobile: filter FAB triggers filter overlay
- [x] `tsc --noEmit` passes

---

---

## Phase 7: Cart & Checkout

**Goal:** Users can add artworks to cart, view cart, and complete checkout with Khalti/eSewa/Stripe payment.

**Time estimate:** 8-10 hours

**Prerequisites:** Phase 6 complete (marketplace and artwork detail pages exist)

**Files to read before starting:** `docs/ARCHITECTURE.md` section 7 (Payment Integration Strategy)

---

### Step 7.1 — Cart Store (Zustand)

**File: `src/hooks/use-cart.ts`**

Zustand store with persist middleware:

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  artworkId: string;
  slug: string;
  title: string;
  image: string;
  priceNpr: number;
  artistName: string;
  addedAt: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (artworkId: string) => void;
  clearCart: () => void;
  totalNpr: () => number;
  itemCount: () => number;
  isInCart: (artworkId: string) => boolean;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        if (get().items.some((i) => i.artworkId === item.artworkId)) return;
        set((state) => ({ items: [...state.items, item] }));
      },
      removeItem: (artworkId) => {
        set((state) => ({ items: state.items.filter((i) => i.artworkId !== artworkId) }));
      },
      clearCart: () => set({ items: [] }),
      totalNpr: () => get().items.reduce((sum, i) => sum + i.priceNpr, 0),
      itemCount: () => get().items.length,
      isInCart: (artworkId) => get().items.some((i) => i.artworkId === artworkId),
    }),
    { name: "thangkahub-cart" }
  )
);
```

### Step 7.2 — Cart Drawer

**File: `src/components/cart/cart-drawer.tsx`**

Client component using ShadCN `Sheet`:
- Slide in from right
- Header: "Your Cart" + close button + item count
- List of cart items: thumbnail, title, artist, price, remove button
- Empty state: "Your cart is empty" with link to marketplace
- Footer: total in NPR, "Checkout" gold button
- Subscribe to Zustand store

### Step 7.3 — Cart Item Component

**File: `src/components/cart/cart-item.tsx`**

- Small thumbnail (80x80, object-cover)
- Title + artist name
- Price in NPR
- Remove button (X icon)

### Step 7.4 — Cart Badge Integration

Update `src/components/layout/navbar.tsx`:
- Cart icon button reads from Zustand store (wrap in a `CartButton` client component)
- Badge shows `useCart().itemCount()`, hidden if 0

**File: `src/components/layout/cart-button.tsx`** — client component wrapper for the cart icon + badge.

### Step 7.5 — Checkout Page

**File: `src/app/(dashboard)/customer/checkout/page.tsx`**

Client component:
1. **Order summary** — list of items, total in NPR and approximate USD
2. **Shipping form:**
   - Full name
   - Phone number
   - Address (street, city, country, postal code)
   - Notes (optional)
3. **Payment method selector:**
   - Khalti (for Nepal customers)
   - eSewa (for Nepal customers)
   - Stripe (for international)
   - Show NPR price for Khalti/eSewa, USD for Stripe
4. **Place Order button** — calls appropriate payment initiation

### Step 7.6 — Khalti Integration

**File: `src/lib/payments/khalti.ts`**

- `initiateKhaltiPayment(orderData)` — server action
  - POST to Khalti API with amount, order ID, return URL
  - Returns `pidx` (payment ID) and `payment_url`
  - Store pending order in DB with status='pending'
  - Redirect user to Khalti payment page

**File: `src/app/api/payments/khalti/verify/route.ts`**
- GET handler for Khalti callback
- Verify with Khalti API using pidx
- On success: update order to 'confirmed', clear cart, redirect to order confirmation

### Step 7.7 — eSewa Integration

**File: `src/lib/payments/esewa.ts`**

Same pattern as Khalti but using eSewa's API.

**File: `src/app/api/payments/esewa/verify/route.ts`**

### Step 7.8 — Stripe Integration

**File: `src/lib/payments/stripe.ts`**

- `createStripeCheckoutSession(orderData)` — server action
  - Create Stripe Checkout session with line items
  - Return session URL
  - Redirect user to Stripe

**File: `src/app/api/payments/stripe/webhook/route.ts`**
- POST handler for Stripe webhook
- Verify signature
- On `checkout.session.completed`: update order to 'confirmed', clear cart

### Step 7.9 — Order Confirmation Page

**File: `src/app/(dashboard)/customer/orders/[id]/page.tsx`**

Server component:
- Order ID, date, status badge
- Item list with prices
- Shipping details
- Payment method + status
- "Continue Shopping" link

### Step 7.10 — Order History (Customer Dashboard)

**File: `src/app/(dashboard)/customer/orders/page.tsx`**

Server component:
- Table of past orders
- Columns: Order ID, date, items count, total, status badge
- Click to view detail

### Step 7.11 — Wishlist Integration

**File: `src/app/(dashboard)/customer/wishlist/page.tsx`**

Server component:
- Grid of wishlisted artworks (reuse ArtCard)
- "Remove from wishlist" action per card

**Add wishlist toggle to artwork detail page** — a heart/bookmark icon button.

### Step 7.12 — Verify Phase 7

- [x] Add to cart from artwork detail page works
- [x] Cart drawer opens, shows items, updates total
- [x] Cart persists across page refreshes
- [x] Checkout form validates required fields
- [x] Khalti payment flow works (with test keys)
- [x] eSewa payment flow works (with test keys)
- [x] Stripe checkout redirects correctly (with test keys)
- [x] Order is created in DB with correct status
- [x] Cart is cleared after successful order
- [x] Order history shows past orders
- [x] Wishlist add/remove works
- [x] `tsc --noEmit` passes

---

---

## Phase 8: Admin Dashboard

**Goal:** Admin can view and manage users, approve artist accounts, and moderate artworks.

**Time estimate:** 5-6 hours

**Prerequisites:** Phase 4 (artist profiles), Phase 5 (artworks)

---

### Step 8.1 — Admin Layout

**File: `src/app/(dashboard)/layout.tsx`** (update existing placeholder)

Dashboard layout with:
- Left sidebar (w-64, bg-surface-container-low, border-r)
  - Logo at top
  - Nav items with icons, role-filtered:
    - Admin sees: Overview, Users, Artists, Artworks
    - Artist sees: Overview, My Artworks, Profile, Orders
    - Customer sees: Overview, My Orders, Wishlist, Settings
  - Active item: gold background, on-primary text
  - Inactive: on-surface-variant, hover → primary
- Top header bar: breadcrumb, user avatar + name dropdown
- Main content area: p-8, scrollable

### Step 8.2 — Admin Overview

**File: `src/app/(dashboard)/admin/page.tsx`**

Server component with stats cards:
- Total users count
- Total artists count
- Total artworks count
- Pending artist approvals count
- Total orders count
- Recent orders (last 5)

### Step 8.3 — User Management

**File: `src/app/(dashboard)/admin/users/page.tsx`**

Server component:
- Table of all users (profiles)
- Columns: Name, Email, Role badge, Joined date, Actions
- Role badge: colored (gold for admin, beige for artist, gray for client)
- Actions: "Make Artist" button (calls `upgradeToArtist`), "Make Admin" button
- Search/filter by role

### Step 8.4 — Artist Approvals

**File: `src/app/(dashboard)/admin/artists/page.tsx`**

Server component:
- Table of artists awaiting verification
- Columns: Name, Slug, Specialization, Experience, Status
- Actions: "Verify" (sets `isVerified = true`), "Feature" (sets `isFeatured = true`)
- Filter: Pending, Verified, Featured

### Step 8.5 — Artwork Moderation

**File: `src/app/(dashboard)/admin/artworks/page.tsx`**

Server component:
- Table of all artworks
- Columns: Thumbnail, Title, Artist, Status, Verified, Date
- Actions: "Verify" (sets `isVerified = true`), "Remove" (soft delete)
- Filter by status

### Step 8.6 — Verify Phase 8

- [x] Admin dashboard loads with correct stats
- [x] Admin can view all users
- [x] Admin can upgrade client → artist
- [x] Admin can verify artists
- [x] Admin can moderate artworks
- [x] Dashboard sidebar shows correct items per role
- [x] `tsc --noEmit` passes

---

---

## Phase 9: Home Page & Knowledge Hub

**Goal:** Build the full landing page matching the design exactly, and the knowledge hub article pages.

**Time estimate:** 8-10 hours

**Prerequisites:** Phase 6 complete (marketplace components exist), Phase 4 complete (artist cards exist)

**Files to read before starting:** The design HTML for the home page (sections 1-10 from the design in the conversation), `docs/DESIGN_SYSTEM.md` all sections

---

### Step 9.1 — Home Page Sections

**File: `src/app/(marketing)/page.tsx`** (replace placeholder)

The home page is composed of 10 sections. Build each as a separate component in `src/components/shared/` or inline if small enough. Since the page is a server component, make interactive sub-components client where needed.

**Section 1 — Hero** (`src/components/home/hero-section.tsx`):
- Full viewport height, flex row (stack on mobile)
- Left: eyebrow line + gold "The Sacred Archive" label, display-xl headline with italic "Himalayan" in gold glow, body-lg description, GoldButton "Browse Collection" + OutlineButton "Our Heritage"
- Right: Large Thangka image with decorative background, floating badges ("Verified Authentic", "Hand Painted") with float animation
- The image: use a featured artwork from DB, or a static hero image

**Section 2 — Platform Overview Cards** (inline in page or `src/components/home/platform-cards.tsx`):
- 3-column grid, middle card offset (md:-mt-12)
- 3 cards: Collect Art, Meet the Masters, Commission
- Each: bg-surface-container-low, 500px height, large icon watermark (5% opacity), headline-md title, body-md description, gold link with arrow
- Commission card links to a placeholder page (`/commissions` — "Coming soon")

**Section 3 — Featured Artists** (`src/components/home/featured-artists.tsx`):
- "The Living Lineage" headline
- Subtitle in italic
- "View All Artists" link
- 4-column grid of ArtistCard (fetch featured artists from DB where `isFeatured = true`)

**Section 4 — Featured Thangkas** (inline or `src/components/home/curated-collections.tsx`):
- "Curated Collections" centered headline
- 3-column grid of ArtCard (fetch featured/verified artworks from DB)

**Section 5 — Creation Journey** (`src/components/shared/process-steps.tsx`):
- "The Process" eyebrow + "Birth of a Masterpiece" headline
- Horizontal timeline: 5 steps (Sketch → Base Color → Detail Work → Gold Leaf → Finalization)
- Each step: numbered circle, label, description
- Connecting line between steps (hidden on mobile, visible on desktop)
- Large editorial image at bottom (aspect-[21/9])

**Section 6 — Custom Commission** (`src/components/home/custom-commission.tsx`):
- Split layout: image left, content right
- "Your Personal Sacred Path" headline (italic "Sacred Path" in gold)
- Body text about commissions
- Two feature items with material icons: Concept Consultation, Lineage Mapping
- GoldButton "Request Private Consultation" (links to placeholder `/commissions`)

**Section 7 — Live Sessions** (placeholder for Phase 2):
- "Live Masterclasses" headline
- Two cards with images, gradient overlays, badges ("Live Tomorrow" pulse, "Workshop")
- "Coming Soon" overlay — since live sessions are Phase 2

**Section 8 — Authenticity Verification** (`src/components/art/art-certificate.tsx`):
- Dark container with primary border
- Left: Certificate mockup (aspect-[3/4], decorative circle, "Certificate of Heritage", ref number, QR code placeholder, gold accents)
- Right: "Peace of Mind for Collectors" headline, body text, 2 feature items (Digital Passport, Material Audit)

**Section 9 — Knowledge Hub** (`src/components/home/knowledge-hub-section.tsx`):
- "Cultural Knowledge Hub" centered headline
- 3 article cards in grid
- Each: 16/9 image (grayscale → color on hover), title (hover → primary), body text (line-clamp-2)

**Section 10 — Testimonial** (`src/components/shared/testimonial.tsx`):
- Large decorative quote mark (160px, 5% opacity)
- Quote text in headline-lg italic
- Attribution: name in gold, location in label-sm uppercase

### Step 9.2 — Knowledge Hub Pages

**File: `src/app/(marketing)/knowledge-hub/page.tsx`**

Server component:
- "Cultural Knowledge Hub" headline
- Grid of article cards
- Each links to `/knowledge-hub/[slug]`

**File: `src/app/(marketing)/knowledge-hub/[slug]/page.tsx`**

Server component:
- Article layout: headline-lg title, body text, images if any
- Simple rich text rendering (articles are stored in Supabase, or for MVP, statically written)

For MVP, articles can be a simple Supabase table:
```ts
export const articles = pgTable("articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  category: text("category"),
  authorName: text("author_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  isPublished: boolean("is_published").default(false),
});
```

Add this to `src/lib/db/schema.ts` and regenerate migrations.

Create 3 seed articles matching the design:
1. Buddhist Symbolism 101
2. The Alchemy of Minerals
3. History of the Archive

### Step 9.3 — Verify Phase 9

- [x] Home page renders all 10 sections
- [x] Hero section matches design (gold glow text, floating badges)
- [x] Platform cards have hover effects and offset layout
- [x] Featured artists and artworks pull from DB
- [x] Creation journey timeline works on desktop and mobile
- [x] Knowledge hub lists and displays articles
- [x] All links navigate correctly
- [x] `tsc --noEmit` passes
- [x] Home page loads in under 3 seconds

---

---

## Phase 10: Polish, Performance & Launch

**Goal:** Error handling, loading states, SEO, responsive QA, performance optimization, and deployment.

**Time estimate:** 6-8 hours

**Prerequisites:** Phase 9 complete (all pages built)

---

### Step 10.1 — Loading Skeletons

Create skeleton components for key pages to show during loading:

**Files:**
- `src/components/shared/art-card-skeleton.tsx` — placeholder ArtCard with animate-pulse
- `src/app/(marketing)/marketplace/loading.tsx` — grid of 6 art card skeletons
- `src/app/(marketing)/artists/loading.tsx` — grid of 4 artist card skeletons
- `src/app/(marketing)/marketplace/[slug]/loading.tsx` — artwork detail skeleton
- `src/app/(dashboard)/artist/artworks/loading.tsx` — table skeleton

### Step 10.2 — Error Boundaries

**Files:**
- `src/app/error.tsx` — root error boundary with "Something went wrong" + retry button
- `src/app/(marketing)/marketplace/error.tsx` — marketplace-specific error
- `src/app/not-found.tsx` — custom 404 page with dark theme

### Step 10.3 — Toast Notifications

Integrate ShadCN `sonner` (install: `pnpm dlx shadcn@latest add sonner`):

Add `<Toaster />` to root layout.

Use toasts for:
- "Added to cart"
- "Removed from wishlist"
- "Artwork saved as draft"
- "Artwork published"
- "Profile updated"
- "Order placed successfully"
- Error messages from server actions

### Step 10.4 — SEO & Metadata

**Files to update with metadata exports:**

- `src/app/layout.tsx` — default metadata (already done in Phase 0)
- `src/app/(marketing)/marketplace/page.tsx` — dynamic `generateMetadata`
- `src/app/(marketing)/marketplace/[slug]/page.tsx` — `generateMetadata` from artwork data (title, description, og:image)
- `src/app/(marketing)/artists/[slug]/page.tsx` — metadata from artist data
- `src/app/(marketing)/knowledge-hub/[slug]/page.tsx` — metadata from article data

**File: `src/app/sitemap.ts`**

Generate sitemap with all public pages:
- Home, marketplace, artist profiles, artwork pages, knowledge hub articles

**File: `src/app/robots.ts`**:
```ts
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
```

### Step 10.5 — Structured Data (JSON-LD)

Add `Product` and `ArtGallery` structured data on artwork detail pages for rich search results.

### Step 10.6 — Image Optimization

- Replace any raw `<img>` tags with Next.js `<Image>` from `next/image` wherever possible
- Set `sizes` attribute correctly for responsive images
- Configure image `priority` for hero/above-fold images
- Verify Supabase Storage CDN is serving images efficiently

### Step 10.7 — Responsive QA Checklist

Test every page at these breakpoints:
- [x] 375px (iPhone SE)
- [x] 768px (iPad)
- [x] 1024px (small laptop)
- [x] 1440px (desktop)
- [x] 1920px (large desktop)

Key checks:
- [x] No horizontal scroll
- [x] No text overflow
- [x] Images scale correctly
- [x] Touch targets are 44px+ on mobile
- [x] Navbar collapses correctly
- [x] Cart drawer works on mobile
- [x] Filter sidebar accessible via FAB on mobile

### Step 10.8 — Performance

- Run `pnpm build` and check for warnings
- Verify no `dynamic = "force-dynamic"` on pages that can be static
- Add `revalidate` or `export const dynamic = "force-static"` where appropriate
- Check bundle size: `ANALYZE=true pnpm build`
- Lighthouse: target 90+ on desktop, 70+ on mobile

### Step 10.9 — Dev Experience

**File: `.vscode/settings.json`**:
```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

### Step 10.10 — Deploy to Vercel

```bash
# Install Vercel CLI
pnpm i -g vercel

# Deploy
vercel
```

Set environment variables in Vercel dashboard (copy from `.env.local`).

Verify:
- [x] Site loads on production URL
- [x] Auth works (register + login)
- [x] Images load from Supabase
- [x] Payments work (test mode)
- [x] All pages return 200 (check sitemap URLs)

---

---

## File Count Summary

| Phase | Files Created | Key Output |
|---|---|---|
| 0: Scaffold | ~5 config files | Working dev server, design tokens |
| 1: Database | ~5 files (+ RLS SQL + seed) | Complete schema, migrations, seed data |
| 2: Auth | ~8 files | Login, register, middleware, roles |
| 3: Layout | ~8 files | Navbar, footer, drawer, shared components |
| 4: Artists | ~8 files | CRUD, directory, profiles |
| 5: Artworks | ~6 files (+ storage config) | Upload form, CRUD, certificates |
| 6: Marketplace | ~12 files | Browse, search, filter, detail pages |
| 7: Cart/Checkout | ~10 files | Cart, Khalti, eSewa, Stripe, orders |
| 8: Admin | ~5 files | User management, approvals |
| 9: Home + Knowledge | ~12 files | Full landing page, articles |
| 10: Polish | ~10 files | Skeletons, errors, SEO, deploy |
| **Total** | **~80 files** | **Complete MVP** |

---

## Dependencies Between Phases

```
Phase 0 (scaffold)
  └─► Phase 1 (database)
        └─► Phase 2 (auth)
              └─► Phase 3 (layout shell)
                    ├─► Phase 4 (artists)
                    │     └─► Phase 5 (artworks)
                    │           └─► Phase 6 (marketplace)
                    │                 └─► Phase 7 (cart/checkout)
                    ├─► Phase 8 (admin) [needs Phase 4 + 5]
                    └─► Phase 9 (home + knowledge) [needs Phase 4 + 5 + 6]
                          └─► Phase 10 (polish) [needs all]
```

Phases 8 and 9 can be done in parallel. Phase 10 is always last.

---

## Context Budgets Per Phase

| Phase | Files per task | Can split into | Agent context risk |
|---|---|---|---|
| 0 | 5 | — | Low (config files are independent) |
| 1 | 5-6 | Schema + RLS + Seed | Medium (schema is one big file) |
| 2 | 8 | Auth actions + Pages | Low |
| 3 | 8 | Shared components + Layout | Low |
| 4 | 8 | Validators + Actions + Pages | Medium |
| 5 | 6 | Form + Actions + Storage | High (form is complex) — split into 2 sub-tasks |
| 6 | 12 | Filter + Grid + Detail | High — split into 3 sub-tasks (filter sidebar, listing page, detail page) |
| 7 | 10 | Cart + Checkout + Payments | High — split into 3 sub-tasks (cart, checkout form, payment integrations) |
| 8 | 5 | — | Low |
| 9 | 12 | Home sections + Knowledge hub | High — split into 4 sub-tasks (hero+cards, artist+art sections, process+cert+testimonial, knowledge hub) |
| 10 | 10 | Skeletons + SEO + QA | Medium |

---

## First Agent Prompt Template

When handing Phase 0 to an AI agent, use this structure:

```
You are working on ThangkaHub, a premium marketplace for Nepali Thangka art.

Read these first:
1. docs/PROJECT_RULES.md
2. docs/DESIGN_SYSTEM.md (sections 2-4 for tokens, skip component catalog for now)
3. docs/ARCHITECTURE.md (sections 1-2)

Your task: Phase 0 — Project Scaffold & Foundation
From docs/IMPLEMENTATION_PLAN.md, execute Phase 0 steps 0.1 through 0.9.

Expected output:
- A running Next.js 15 dev server on localhost:3000
- All design tokens configured in Tailwind 4
- Path aliases working
- Directory structure created

Verify: pnpm dev starts, pnpm build succeeds, tsc --noEmit passes.
```
