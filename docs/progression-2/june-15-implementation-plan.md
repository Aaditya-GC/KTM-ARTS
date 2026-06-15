# Kathmandu Arts — Comprehensive Implementation Plan

> **Created:** 2026-06-15
> **Scope:** All known gaps except payment productionization and live masterclasses
> **For:** AI coding assistants to execute phase by phase

---

## Pre-Flight: Required Reading for ALL Agents

Every agent must read these before starting ANY phase:

1. `docs/PROJECT_RULES.md` — coding rules, conventions, anti-patterns
2. `docs/DESIGN_SYSTEM.md` — design tokens (sections 2-4), component catalog (sections 6.1-6.10)
3. `docs/ARCHITECTURE.md` — sections 3 (DB schema), 4 (routes), 6 (component architecture)
4. `docs/IMPLEMENTATION_PLAN.md` — current build state, comparison with original plan
5. `src/lib/db/schema.ts` — all 12 tables, enums, type exports
6. `src/app/globals.css` — all CSS custom properties and utility classes

---

## Current State Summary

### What's Fully Built (44+ files)
- Landing page (10 sections), marketplace (search/filter/pagination), artwork detail, artist directory/profiles, commission inquiry page, knowledge hub listing
- Auth flow (register/login/verify), dashboard with role-based routing, collapsible sidebar
- Cart drawer (Zustand + localStorage), checkout flow (shipping/payment/confirmation)
- Admin overview with stats, admin user/artist management
- Artist dashboard overview with stats + revenue + recent artworks
- Artist artwork list with server component + client wrapper
- Artist artwork upload form (new)
- Artist artwork edit page
- Artist profile edit page
- Search modal with debounced ILIKE queries
- Khalti + Stripe payment integration (test keys)
- API routes for auth callback, payment verification, Stripe webhook
- All server actions: artwork CRUD, order creation, artist profile, search
- All Zod validators: auth, artwork, artist
- All Supabase SQL: RLS policies, storage buckets, seed data, seed artworks
- 37+ components across art/, artist/, cart/, layout/, marketplace/, search/, shared/, ui/

### What's a STUB (returns placeholder text)
| Route | Current State |
|---|---|
| `/dashboard/artist/orders` | `<h1>Orders Received</h1>` |
| `/dashboard/customer/wishlist` | `<h1>My Wishlist</h1>` |

### What's Incomplete / Has Known Gaps
| Gap | Impact |
|---|---|
| No `middleware.ts` | Route-level auth protection missing; auth checked only in dashboard layout |
| No `src/types/` directory | Shared type definitions don't exist; types scattered across schema/validators |
| Drizzle migrations not generated | Schema never pushed via `drizzle-kit`; no migration history |
| RLS policies not applied to DB | SQL files exist but may not be executed in Supabase |
| Seed data not applied | `supabase/seed.sql` and `seed_artworks.sql` exist but may not be run |
| Filter sidebar price slider | Decorative only; not wired to URL params |
| Mobile filter FAB | Not implemented; filters only visible on desktop |
| Subject/deity filter naming | Sidebar uses "subject" param but DB column is "deity" |
| Cart DB sync | Cart is localStorage only; not persisted to Supabase for logged-in users |
| Wishlist | DB table exists but UI is a stub |
| Artist orders page | Stub; artists can't see who ordered their work |
| Knowledge hub articles | Pages exist but content may be thin; article detail not verified |
| `<img>` vs `next/image` | Raw `<img>` tags in art-card, artist-card, customer dashboard, artist dashboard |
| JSON-LD structured data | Missing on artwork detail pages (SEO) |
| Page metadata | Some pages lack `generateMetadata` exports |
| Error boundaries | Only global `error.tsx` exists; no route-group error boundaries |
| Loading states | `loading.tsx` exists for some routes but not all |
| Design system docs | Still describe the original dark theme (`#14140f`) not the current warm theme |
| Rate limiting | No rate limiting on server actions or API routes |
| Search API route | Planned but replaced by server action; `/api/search` doesn't exist |
| eSewa initiate route | Only verify route exists; initiation is inline redirect construction |

---

## Phase Dependency Graph

```
Phase 1: Foundation ──────┬──► Phase 3: Marketplace Polish
(infrastructure)          │
                          ├──► Phase 4: Dashboard Completion
Phase 2: Data & Content ──┤
(seeds, articles)         ├──► Phase 5: Commission System
                          │
                          ├──► Phase 6: Cart & Wishlist
                          │
                          └──► Phase 7: SEO & Performance
                                   │
                                   ▼
                              Phase 8: Error Handling & Loading
                                   │
                                   ▼
                              Phase 9: Production Hardening
                                   │
                                   ▼
                              Phase 10: E2E Verification
```

- **Phase 1 blocks nothing else** but should be done first (foundational)
- **Phase 2 blocks nothing** but provides data needed for testing Phases 3-6
- **Phases 3, 4, 5, 6 are independent** — can run in parallel
- **Phases 7, 8, 9 must be sequential** (each builds on the previous)

---

---

## Phase 1: Foundation & Infrastructure

**Goal:** Establish proper auth middleware, shared type definitions, database migration sync, RLS enforcement, and project structure hygiene.

**Time estimate:** 3-4 hours

**Prerequisites:** Read `src/lib/supabase/server.ts`, `src/lib/auth/roles.ts`, `src/lib/db/schema.ts`, `supabase/rls_policies.sql`, `drizzle.config.ts`

---

### Step 1.1 — Create `src/middleware.ts`

**File: `src/middleware.ts`** (NEW)

Create a Next.js middleware that protects dashboard routes at the edge. The current approach checks auth only in `dashboard/layout.tsx` — middleware provides defense-in-depth.

```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protected routes: /dashboard/* and /checkout/*
  const isProtected = request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/checkout");

  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Auth pages: redirect to dashboard if already logged in
  const isAuthPage = ["/login", "/register"].some(p =>
    request.nextUrl.pathname.startsWith(p)
  );

  if (isAuthPage && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/checkout/:path*", "/login", "/register"],
};
```

**Why:** Route-level protection before any component renders. The existing layout-level check in `dashboard/layout.tsx` stays as a safety net.

---

### Step 1.2 — Create `src/types/` directory with shared types

**Files to create:**

**`src/types/index.ts`** — barrel export
```typescript
export type * from "./user";
export type * from "./artwork";
export type * from "./artist";
export type * from "./order";
```

**`src/types/user.ts`**
```typescript
import type { Profile } from "@/lib/db/schema";

export type UserRole = "client" | "artist" | "admin";
export type SafeUser = Pick<Profile, "id" | "role" | "fullName" | "avatarUrl">;
export type { Profile };
```

**`src/types/artwork.ts`**
```typescript
import type { Artwork, ArtworkCategory, Certificate, CreationStep } from "@/lib/db/schema";
import type { ArtworkInput, CreationStepInput } from "@/lib/validators/artwork";

export type ArtworkStatus = "available" | "sold" | "reserved" | "draft";
export type ArtworkCardData = {
  slug: string;
  title: string;
  images: string[];
  priceNpr: number;
  priceUsd?: number | null;
  status: ArtworkStatus;
  isVerified: boolean;
  artist: { name: string; slug: string };
};
export type { Artwork, ArtworkCategory, Certificate, CreationStep, ArtworkInput, CreationStepInput };
```

**`src/types/artist.ts`**
```typescript
import type { Artist } from "@/lib/db/schema";
import type { ArtistProfileInput } from "@/lib/validators/artist";

export type ArtistCardData = {
  slug: string;
  fullName: string;
  specialization?: string[];
  imageUrl?: string;
  experienceYears?: number;
};
export type { Artist, ArtistProfileInput };
```

**`src/types/order.ts`**
```typescript
import type { Order, OrderItem, CartItem as DbCartItem } from "@/lib/db/schema";

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";
export type { Order, OrderItem, DbCartItem };
```

---

### Step 1.3 — Generate and run Drizzle migrations

The Drizzle config exists but migrations have never been generated. Let's fix that.

**Actions:**
1. Verify `drizzle.config.ts` points to correct schema and output:
   ```typescript
   // drizzle.config.ts should have:
   // schema: "src/lib/db/schema.ts"
   // out: "supabase/migrations"
   ```

2. Run migration generation:
   ```bash
   npx drizzle-kit generate
   ```

3. This creates SQL migration files in `supabase/migrations/`

4. Push to database (or provide SQL for manual execution):
   ```bash
   npx drizzle-kit push
   ```

**Note for agents:** Drizzle kit may detect schema drift. If `push` fails due to existing tables, use `drizzle-kit push --force` or provide the generated SQL for manual Supabase SQL Editor execution.

---

### Step 1.4 — Apply RLS policies

**File: `supabase/rls_policies.sql`** — already exists, needs to be executed.

**Actions:**
1. Read the existing `supabase/rls_policies.sql`
2. Execute in Supabase SQL Editor (or via `psql`)
3. Verify policies are active:
   ```sql
   SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
   ```

---

### Step 1.5 — Apply storage bucket policies

**File: `supabase/storage_buckets.sql`** — already exists.

**Actions:**
1. Execute in Supabase SQL Editor
2. Verify buckets exist in Supabase Storage dashboard
3. Verify `artworks` and `artists` buckets are public

---

### Step 1.6 — Verify Phase 1

- [ ] `src/middleware.ts` created and protects `/dashboard/*` and `/checkout/*`
- [ ] `src/types/` directory exists with `index.ts`, `user.ts`, `artwork.ts`, `artist.ts`, `order.ts`
- [ ] Drizzle migrations generated in `supabase/migrations/`
- [ ] Schema synced to Supabase (tables exist with correct columns)
- [ ] RLS policies active on all tables
- [ ] Storage buckets exist and are public
- [ ] `tsc --noEmit` passes with zero errors
- [ ] Unauthenticated requests to `/dashboard` redirect to `/login`
- [ ] Authenticated requests to `/login` redirect to `/dashboard`

---

---

## Phase 2: Data & Content Seeding

**Goal:** Populate the database with rich seed data — artists, artworks, knowledge hub articles, testimonials. An empty marketplace can't be tested.

**Time estimate:** 1-2 hours

**Prerequisites:** Phase 1.4 complete (RLS active). Read `supabase/seed.sql`, `supabase/seed_artworks.sql`

---

### Step 2.1 — Execute existing seed data

**Files:** `supabase/seed.sql`, `supabase/seed_artworks.sql` — both already exist with full content.

**Actions:**
1. Execute `supabase/seed.sql` in Supabase SQL Editor — creates admin user + 4 artist profiles
2. Execute `supabase/seed_artworks.sql` — creates 6 artworks with categories, certificates, creation steps
3. Verify counts:
   ```sql
   SELECT count(*) FROM profiles;
   SELECT count(*) FROM artists;
   SELECT count(*) FROM artworks;
   SELECT count(*) FROM certificates;
   SELECT count(*) FROM creation_steps;
   ```

---

### Step 2.2 — Create knowledge hub seed data

**File: `supabase/seed_articles.sql`** (NEW)

Create 4-6 articles for the knowledge hub covering Thangka topics.

```sql
INSERT INTO public.articles (slug, title, excerpt, content, image_url, category, author_name, is_published) VALUES
(
  'what-is-a-thangka',
  'What Is a Thangka? A Beginner''s Guide',
  'Discover the ancient art of Thangka painting — Tibetan Buddhist scroll art that has preserved spiritual teachings for over a millennium.',
  'Thangka (also spelled ''tangka,'' ''thanka,'' or ''tanka'') is a Tibetan Buddhist painting on cotton or silk that typically depicts a Buddhist deity, scene, or mandala. The word comes from the Tibetan ''thang yig,'' meaning ''a written record'' — and indeed, these paintings serve as visual scriptures, encoding complex spiritual teachings in a single composition.

Unlike Western paintings, Thangkas are not merely decorative. They are meditation tools, teaching aids, and sacred objects. A practitioner meditates on a Thangka to internalize the qualities of the depicted deity — compassion from Tara, wisdom from Manjushri, protection from Mahakala.

The creation of a Thangka is itself a spiritual practice. Artists follow strict iconometric guidelines preserved in ancient texts, measuring each element with precise proportions. The eyes of the deity are painted last, in a ceremony called ''eye-opening,'' at which point the Thangka is believed to become a living embodiment of the deity.

Traditional materials include:
- **Canvas:** Handwoven cotton or silk, stretched on a wooden frame
- **Ground:** A gesso-like mixture of chalk and hide glue, polished to a smooth finish
- **Pigments:** Crushed minerals and gemstones — lapis lazuli for blue, cinnabar for red, malachite for green
- **Gold:** 24K gold leaf applied in the ''cold gold'' technique, burnished with agate

A single Thangka can take months to complete. The Kalachakra Mandala, one of the most complex compositions, can take over six months of daily work.

At Kathmandu Arts, every Thangka is verified for authenticity and comes with a Certificate of Heritage, ensuring you receive a genuine sacred artwork created according to centuries-old traditions.',
  'https://images.pexels.com/photos/2408167/pexels-photo-2408167.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80',
  'Guides',
  'Kathmandu Arts Editorial',
  true
),
(
  'understanding-thangka-styles',
  'Understanding Thangka Styles: Karma Gadri, Newari & Tibetan',
  'Explore the distinct artistic traditions that define Himalayan Thangka painting — from the airy landscapes of Karma Gadri to the intricate detail of Newari work.',
  'The Himalayan region encompasses multiple artistic traditions, each with its own aesthetic philosophy, color palette, and spiritual emphasis. Understanding these styles helps collectors appreciate what they''re looking at — and find the tradition that resonates with them.

**Karma Gadri (Karma Gardri)**
Originating in the 16th century with the great master Namkha Tashi, Karma Gadri blends two earlier traditions: the spacious, landscape-heavy Menri style and the more iconographically precise Chinese-influenced style. The result is paintings with airy, luminous backgrounds — blue-green landscapes with distant mountains and clouds — surrounding precisely rendered central deities. Karma Gadri is often described as the most ''painterly'' of the Thangka traditions, with visible brushwork and atmospheric effects.

**Newari (Newar)**
The Newar people of the Kathmandu Valley have been painting for over a thousand years, and their Thangka tradition (also called ''Paubha'') predates Tibetan Buddhist painting. Newari work is characterized by:
- Intricate decorative detail — every surface is adorned
- Deep, saturated reds as the dominant background color
- Elaborate architectural framing with arches and pillars
- Fine gold detailing throughout
Newari artists are renowned for their precision and their mastery of gold work.

**Tibetan**
The broadest category, encompassing multiple sub-styles. Generally characterized by:
- Strong iconographic precision following strict canonical rules
- Bold color fields with less landscape integration than Karma Gadri
- Emphasis on the deity figure dominating the composition
- Extensive use of gold for halos, ornaments, and sacred elements

**Thangka (Contemporary Nepali)**
A modern evolution blending elements from multiple traditions. Contemporary Thangka artists in the Kathmandu Valley often train in multiple styles and bring personal expression while respecting iconographic rules. This is a living tradition, not a frozen museum piece.

At Kathmandu Arts, each artwork listing includes the specific style and tradition, so you can explore the full spectrum of Himalayan sacred art.',
  'https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80',
  'Guides',
  'Kathmandu Arts Editorial',
  true
),
(
  'iconography-of-buddhist-deities',
  'Iconography of Buddhist Deities: Symbols & Meanings',
  'Learn to read the visual language of Thangka art — mudras, attributes, colors, and postures that encode profound spiritual teachings.',
  'Every element in a Thangka carries meaning. The posture of the deity, the objects held in each hand, the colors, the surrounding figures — all of it forms a visual language that practitioners learn to read. This guide covers the most common symbolic elements.

**The Five Buddha Families (Colors)**
- **White:** Vairocana — wisdom of the dharmadhatu, ignorance transformed
- **Blue:** Akshobhya — mirror-like wisdom, anger transformed
- **Yellow:** Ratnasambhava — wisdom of equality, pride transformed
- **Red:** Amitabha — discriminating wisdom, attachment transformed
- **Green:** Amoghasiddhi — all-accomplishing wisdom, jealousy transformed

**Common Mudras (Hand Gestures)**
- **Bhumisparsha (Earth-Touching):** Right hand touching the earth — Buddha''s enlightenment moment
- **Dhyana (Meditation):** Both hands in lap, palms up — concentration, meditation
- **Abhaya (Fearlessness):** Right hand raised, palm out — protection, peace
- **Varada (Giving):** Right hand extended down, palm out — generosity, granting blessings
- **Dharmachakra (Teaching):** Both hands at chest, thumb and index finger touching — turning the wheel of Dharma

**Common Deities**
- **Shakyamuni Buddha:** The historical Buddha, often in earth-touching mudra, golden body
- **Avalokiteshvara (Chenrezig):** Bodhisattva of compassion, white, often with multiple arms
- **Tara:** Female bodhisattva, green or white, protector and guide
- **Manjushri:** Bodhisattva of wisdom, orange-yellow, holding a flaming sword
- **Mahakala:** Wrathful protector, dark blue/black, surrounded by flames
- **Vajrayogini:** Female deity, red, dancing posture, represents transformation

**Throne Types**
- **Lotus throne:** Purity — the deity rises above samsara
- **Lion throne:** Fearlessness and royal authority
- **Elephant throne:** Strength and stability

**Offerings & Objects**
- **Vajra (Dorje):** Diamond scepter — indestructible truth, masculine principle
- **Bell (Ghanta):** Wisdom, feminine principle
- **Wheel (Dharmachakra):** The Buddha''s teachings
- **Lotus (Padma):** Purity arising from the mud of samsara
- **Jewel (Ratna):** The preciousness of the Dharma

Understanding this iconography deepens the experience of owning a Thangka. Each time you look at your painting, new layers of meaning reveal themselves.',
  'https://images.pexels.com/photos/2505915/pexels-photo-2505915.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80',
  'Guides',
  'Kathmandu Arts Editorial',
  true
),
(
  'caring-for-your-thangka',
  'Caring for Your Thangka: Preservation & Display',
  'Practical guidance on displaying, protecting, and preserving your Thangka for generations — from mounting to environmental considerations.',
  'A Thangka is a sacred object and a fine art investment. Proper care ensures it remains vibrant for generations. Here is what you need to know.

**Traditional Display**
Historically, Thangkas were not permanently mounted. They were unrolled for specific ceremonies, teachings, or meditation sessions. The scroll format — with silk brocade mounting and a thin wooden rod at top and bottom — was designed for portability. Today, collectors have more options.

**Mounting Options**
- **Traditional brocade:** Silk border with wooden rollers. Authentic look, can be rolled for storage. Best for large pieces.
- **Framed behind glass:** Museum-quality UV-protective glass. Best protection against dust, smoke, and handling. Use spacers so the glass does not touch the painting surface.
- **Stretched canvas mount:** Modern presentation. The Thangka is mounted on a stretcher like a Western canvas. Good for contemporary displays.

**Environmental Hazards to Avoid**
- **Direct sunlight:** Mineral pigments are stable but direct UV exposure fades everything over decades. No direct sun. If the room is bright, use UV film on windows.
- **Humidity:** High humidity promotes mold and causes the canvas to expand/contract. Ideal: 45-55% relative humidity. Avoid bathrooms, kitchens, damp basements.
- **Heat:** Do not hang above radiators, fireplaces, or heating vents.
- **Smoke and incense:** Traditional Thangkas were often placed on altar rooms with butter lamps. Over centuries, this creates a darkened patina that some consider part of the painting''s history. For preservation, minimize exposure to smoke.

**Cleaning**
- **Do not use water, solvents, or cleaning products.**
- Dust gently with a soft, dry brush (sable or goat hair, like a makeup brush).
- For framed pieces behind glass, clean only the glass with a microfiber cloth.
- If the Thangka has been exposed to smoke or significant dust, consult a textile conservator.

**Handling**
- Always wash and dry hands before touching a Thangka.
- Touch only the brocade border or frame, never the painted surface.
- When rolling for storage, roll with the painting facing outward (away from the rod) to prevent cracking.

**Display Etiquette**
In Buddhist tradition, Thangkas are displayed at eye level or above. Never place them on the floor or below waist height. If displaying in a meditation space, the Thangka faces the practitioner — the deity gazes upon you as you practice.

Your Thangka carries the blessings of its creation — the months of meditation, the mantras recited during painting, the consecration ceremony. Treat it with the reverence it deserves.',
  'https://images.pexels.com/photos/2890387/pexels-photo-2890387.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80',
  'Guides',
  'Kathmandu Arts Editorial',
  true
),
(
  'gold-in-thangka-art',
  'The Role of Gold in Thangka Art',
  'Gold is not decoration — it is transformation. Understanding the sacred role of gold in Himalayan art and how master artists work with it.',
  'Gold in Thangka painting is not merely decorative. In Buddhist thought, gold represents the indestructible, luminous nature of enlightenment itself. When an artist applies gold to a Thangka, they are not decorating — they are revealing the true nature of the depicted deity.

**Two Gold Techniques**

**Hot Gold (Ser-Thang)**
The traditional Tibetan technique. Gold leaf is ground into a fine powder, mixed with hide glue and water, then applied with a brush. After drying, the gold surface is polished with an agate burnisher to bring out the luster. This technique produces a warm, satiny gold that seems to glow from within. It is used for:
- The body of golden deities (Shakyamuni Buddha, Ratnasambhava)
- Halos and aureoles
- Sacred ornaments and jewelry

**Cold Gold (Thang-Thang)**
Finer and more demanding. Gold leaf is ground even more finely, mixed with a minimal binder, and applied in thin, even layers. After drying, the surface is burnished with agate to a mirror finish. Cold gold is used for:
- Fine linear details (the ''gold line'' technique)
- The raised gold designs (''gold thread'' work) on deity robes
- Inscriptions and mantras

**Genuine Gold vs. Gold Paint**
Authentic Thangkas use 24K gold leaf. Gold-colored paint or metallic powder is not a substitute — it will tarnish, while real gold remains unchanged for centuries. At Kathmandu Arts, our Certificate of Heritage verifies that genuine 24K gold was used.

**The Spiritual Significance**
In Vajrayana Buddhism, gold is associated with:
- **Ratnasambhava Buddha** of the southern direction, whose wisdom transforms pride into equanimity
- The **Jambhala** wealth deities, who hold gold-offering mongooses
- The **third eye** of certain deities, sometimes depicted in gold
- **Offerings:** In many Thangkas, gold bowls filled with wish-fulfilling objects appear as offerings

When you own a gold-detailed Thangka, you hold not just a painting but a piece of the sacred — a surface that has been touched by an artist who likely recited mantras while applying each layer of gold leaf.',
  'https://images.pexels.com/photos/1097456/pexels-photo-1097456.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80',
  'Guides',
  'Kathmandu Arts Editorial',
  true
),
(
  'collecting-thangka-art',
  'Collecting Thangka Art: A Connoisseur''s Guide',
  'What to look for when acquiring a Thangka — from evaluating quality and authenticity to understanding market dynamics and investment potential.',
  'Building a meaningful collection of Himalayan art requires knowledge, patience, and discernment. This guide is for the serious collector.

**What Determines Quality**

**Mastery of Line**
Look at the fine details — the deity''s facial features, the delicate fingers, the ornamentation. A master artist draws these with single, confident strokes. Hesitation shows in uneven, broken lines. The finest Thangkas display ''hairline'' gold work — lines thinner than a human hair, applied with a single-hair brush.

**Pigment Quality**
Real mineral pigments have a depth and luminosity that synthetic paints cannot match. Lapis lazuli blue shifts subtly in different light. Cinnabar red has an almost velvety quality. Hold the painting at an angle to the light — genuine mineral pigments will show slight variations in surface texture.

**Gold Application**
Burnished gold should be mirror-smooth, not patchy. Run your eye along the gold lines — they should be even in width from end to end. The most demanding technique is ''ser zung'' (gold relief), where gold is built up in layers to create a three-dimensional raised design — this is the mark of a master.

**Composition**
A great Thangka balances strict iconographic rules with artistic expression. The central deity should command the composition. Supporting figures, landscape elements, and decorative details should guide the eye naturally through the painting without feeling cluttered.

**Provenance**
Who painted it? What tradition do they belong to? How long did they train? At Kathmandu Arts, we provide full artist profiles with lineage information. A Thangka with documented provenance is worth significantly more than an anonymous piece.

**Investment Considerations**
- Museum-quality Thangkas by recognized masters have appreciated significantly over the past decade
- The global market for Himalayan art has expanded beyond traditional collecting centers (Nepal, Tibet, Bhutan) to include serious collectors in North America, Europe, and East Asia
- Look for: documented provenance, Certificate of Heritage, artist recognition, and artistic merit
- Avoid: pieces with dubious provenance, machine-made reproductions passed off as hand-painted, and tourist-market quality work

At Kathmandu Arts, every artwork is verified, every artist is documented, and every purchase includes a Certificate of Heritage. We do the vetting so you can collect with confidence.',
  'https://images.pexels.com/photos/326716/pexels-photo-326716.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80',
  'Collecting',
  'Kathmandu Arts Editorial',
  true
);
```

---

### Step 2.3 — Create testimonials seed data

**File: `supabase/seed_testimonials.sql`** (NEW)

```sql
INSERT INTO public.testimonials (quote, author_name, author_location) VALUES
(
  'The Medicine Buddha Thangka I commissioned arrived yesterday, and I am without words. The gold leaf catches candlelight in a way photographs cannot capture. It has transformed my meditation space.',
  'Sarah Chen',
  'San Francisco, USA'
),
(
  'I visited three Thangka galleries in Kathmandu before finding Kathmandu Arts. The difference is the documentation — full artist lineage, materials audit, certificate. As a first-time collector, this gave me confidence I was buying something authentic.',
  'Marcus Weber',
  'Berlin, Germany'
),
(
  'My grandmother was Tibetan, and I grew up seeing Thangkas in her home. After she passed, I wanted one for my own family. The artist profile and creation story Kathmandu Arts provided made this purchase deeply meaningful — I know exactly who painted it and what tradition they carry.',
  'Tenzin Dolma',
  'Toronto, Canada'
),
(
  'The Kalachakra Mandala I purchased is museum quality. I have been collecting Himalayan art for 20 years, and the detail work on this piece is among the finest I have seen outside of monastery collections.',
  'Dr. James Harrison',
  'London, UK'
);
```

---

### Step 2.4 — Execute all seed data

Run in Supabase SQL Editor in order:
1. `supabase/seed.sql`
2. `supabase/seed_artworks.sql`
3. `supabase/seed_articles.sql`
4. `supabase/seed_testimonials.sql`

---

### Step 2.5 — Verify Phase 2

- [ ] 4+ artist profiles exist with complete bio/specialization/location data
- [ ] 6 artworks exist across 4 artists with images, categories, certificates, creation steps
- [ ] 6 knowledge hub articles published with full content
- [ ] 4 testimonials in the database
- [ ] Marketplace page (`/marketplace`) shows 6 artworks
- [ ] Knowledge hub (`/knowledge-hub`) shows 6 articles
- [ ] Landing page shows testimonials
- [ ] Each artwork detail page renders full info (story, materials, certificate, creation steps)
- [ ] Artist profile pages show their artwork counts

---

---

## Phase 3: Marketplace Polish

**Goal:** Wire the broken filter sidebar price slider, add mobile filter support, fix the subject/deity naming inconsistency, and improve search UX.

**Time estimate:** 2-3 hours

**Prerequisites:** Read `src/components/marketplace/filter-sidebar.tsx`, `src/components/marketplace/search-bar.tsx`, `src/app/(marketing)/marketplace/page.tsx`

---

### Step 3.1 — Wire price slider to URL search params

**File: `src/components/marketplace/filter-sidebar.tsx`** (MODIFY)

The `<Slider>` component is currently decorative. Wire it to update `price_min` and `price_max` URL params.

Implementation:
1. Add state for current slider values
2. Initialize from URL searchParams on mount
3. Add number inputs for min/max precision entry
4. On `onValueCommit` (drag end), push values to URL

```tsx
// Key additions to filter-sidebar.tsx:

const searchParams = useSearchParams();
const router = useRouter();
const pathname = usePathname();

const initialMin = Number(searchParams.get("price_min")) || 0;
const initialMax = Number(searchParams.get("price_max")) || 500000;
const [priceRange, setPriceRange] = useState([initialMin, initialMax]);
const [inputMin, setInputMin] = useState(String(initialMin || ""));
const [inputMax, setInputMax] = useState(String(initialMax || ""));

function applyPriceFilter(values: number[]) {
  const params = new URLSearchParams(searchParams.toString());
  if (values[0] > 0) params.set("price_min", String(values[0]));
  else params.delete("price_min");
  if (values[1] < 500000) params.set("price_max", String(values[1]));
  else params.delete("price_max");
  params.set("page", "1");
  router.push(`${pathname}?${params.toString()}`);
}
```

The marketplace page (`page.tsx`) already reads `price_min` and `price_max` from searchParams and applies `gte`/`lte` filters — no server-side changes needed.

---

### Step 3.2 — Fix subject/deity filter naming

**Files: `src/components/marketplace/filter-sidebar.tsx`, `src/app/(marketing)/marketplace/page.tsx`** (MODIFY)

The filter sidebar uses `subject` as the URL param key, but the DB column and marketplace page query use `deity`. These need to match.

In `filter-sidebar.tsx`:
- Search for all occurrences of `"subject"` in the filter update logic
- Change to `"deity"`
- Keep the UI label as "Subject / Deity"

In `marketplace/page.tsx`:
- Already uses `params.deity` — verify this is consistent
- If there are any `params.subject` references, change to `params.deity`

This is a simple find-and-replace across 2 files.

---

### Step 3.3 — Add mobile filter FAB and Sheet

**File: `src/app/(marketing)/marketplace/page.tsx`** (MODIFY)
**File: `src/components/marketplace/mobile-filter-sheet.tsx`** (NEW)

Mobile users need access to filters. Per the design system, implement:

1. **FAB button** — visible only on mobile (`lg:hidden`), fixed position bottom-right, gold-leaf-button styling:
```tsx
// In the marketplace page, add near the bottom of the JSX:
<div className="fixed bottom-6 right-6 z-40 lg:hidden">
  <Sheet>
    <SheetTrigger asChild>
      <button className="gold-leaf-button w-14 h-14 rounded-full flex items-center justify-center shadow-lg">
        <span className="material-symbols-outlined">tune</span>
      </button>
    </SheetTrigger>
    <SheetContent side="left" className="w-full sm:max-w-sm overflow-y-auto bg-background">
      <div className="pt-4">
        <FilterSidebar className="relative sticky top-0" />
      </div>
    </SheetContent>
  </Sheet>
</div>
```

2. The existing `FilterSidebar` renders inside the Sheet on mobile. No need to create a separate mobile filter component — reuse the existing one.

3. The desktop filter sidebar (hidden on mobile via `hidden lg:block`) stays as-is.

---

### Step 3.4 — Add search input debounce within the existing search bar

**File: `src/components/marketplace/search-bar.tsx`** (MODIFY)

The current search bar pushes to URL params on every keystroke. Add a 300ms debounce:

```tsx
import { useEffect, useState, useRef } from "react";

// Inside the component:
const [localValue, setLocalValue] = useState(initialQuery);
const debounceRef = useRef<ReturnType<typeof setTimeout>>();

function handleChange(value: string) {
  setLocalValue(value);
  clearTimeout(debounceRef.current);
  debounceRef.current = setTimeout(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("q", value);
    else params.delete("q");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, 300);
}
```

---

### Step 3.5 — Verify Phase 3

- [ ] Price slider updates `price_min` and `price_max` in URL on drag end
- [ ] Number inputs allow precise price entry
- [ ] Price slider reflects current URL params on page load
- [ ] Marketplace filters artworks by price range correctly
- [ ] Subject/deity filter naming is consistent (uses `deity` everywhere)
- [ ] Mobile FAB button visible below `lg` breakpoint
- [ ] FAB opens filters in a side Sheet
- [ ] Filters work inside the Sheet on mobile
- [ ] Search input has debounce; filters don't fire on every keystroke
- [ ] `tsc --noEmit` passes

---

---

## Phase 4: Dashboard Completion

**Goal:** Build out the two stub pages (artist orders, customer wishlist), enhance the customer dashboard with real data, and ensure all dashboard pages are functional.

**Time estimate:** 3-4 hours

**Prerequisites:** Phase 1 complete (middleware + types). Read `src/lib/db/schema.ts`, `src/lib/order-actions.ts`

---

### Step 4.1 — Build artist orders page

**File: `src/app/dashboard/artist/orders/page.tsx`** (REPLACE)

This is currently a stub (`<h1>Orders Received</h1>`). Build a functional Server Component:

```typescript
// The page should:
// 1. Get current user via getCurrentUser()
// 2. Query orderItems JOIN orders JOIN artworks WHERE artworks.artistId = user.id
// 3. Display as a table/card list with:
//    - Order ID (truncated)
//    - Artwork title
//    - Buyer name (join through profiles on orders.customerId)
//    - Price (NPR)
//    - Order status badge
//    - Order date
//    - Shipping info (city, country)
// 4. Filter by order status (All / Pending / Paid / Shipped / Delivered)
// 5. Empty state if no orders
// 6. Loading skeleton

// Query pattern:
const artistOrders = await db
  .select({
    orderId: orders.id,
    orderStatus: orders.status,
    orderTotal: orders.totalNpr,
    orderDate: orders.createdAt,
    shippingCity: orders.shippingAddress,
    shippingName: orders.shippingName,
    artworkTitle: artworks.title,
    artworkSlug: artworks.slug,
    priceNpr: orderItems.priceNpr,
    customerName: profiles.fullName,
  })
  .from(orderItems)
  .innerJoin(orders, eq(orderItems.orderId, orders.id))
  .innerJoin(artworks, eq(orderItems.artworkId, artworks.id))
  .innerJoin(profiles, eq(orders.customerId, profiles.id))
  .where(eq(artworks.artistId, user.id))
  .orderBy(desc(orders.createdAt));
```

Design:
- Section header: "Orders Received" with status filter tabs
- Each order: card with artwork thumbnail, title, buyer name, status badge, price, date
- Status badges color-coded: pending (gray), paid (gold), shipped (primary), delivered (primary), cancelled (error/red)
- Empty state: "No orders received yet" with icon
- Use design tokens throughout (`bg-surface-container-low`, `border-outline-variant`, etc.)

---

### Step 4.2 — Build customer wishlist page

**File: `src/app/dashboard/customer/wishlist/page.tsx`** (REPLACE)

This is currently a stub (`<h1>My Wishlist</h1>`). Build a functional page:

The wishlist has:
- Database table `wishlistItems` with `userId`, `artworkId`, `addedAt`
- No existing UI beyond the stub page
- No existing server actions for wishlist operations

**Step 4.2a — Create wishlist server actions**

**File: `src/lib/wishlist-actions.ts`** (NEW)

```typescript
"use server";

import { db } from "@/lib/db";
import { wishlistItems, artworks, artists, profiles } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addToWishlist(artworkId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const existing = await db
    .select()
    .from(wishlistItems)
    .where(and(
      eq(wishlistItems.userId, user.id),
      eq(wishlistItems.artworkId, artworkId)
    ))
    .limit(1);

  if (existing.length > 0) return { error: "Already in wishlist" };

  await db.insert(wishlistItems).values({
    userId: user.id,
    artworkId,
  });

  revalidatePath("/dashboard/customer/wishlist");
}

export async function removeFromWishlist(artworkId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  await db
    .delete(wishlistItems)
    .where(and(
      eq(wishlistItems.userId, user.id),
      eq(wishlistItems.artworkId, artworkId)
    ));

  revalidatePath("/dashboard/customer/wishlist");
}

export async function getWishlist() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const items = await db
    .select({
      artworkId: artworks.id,
      slug: artworks.slug,
      title: artworks.title,
      images: artworks.images,
      priceNpr: artworks.priceNpr,
      status: artworks.status,
      artistName: profiles.fullName,
      artistSlug: artists.slug,
      addedAt: wishlistItems.addedAt,
    })
    .from(wishlistItems)
    .innerJoin(artworks, eq(wishlistItems.artworkId, artworks.id))
    .innerJoin(artists, eq(artworks.artistId, artists.id))
    .innerJoin(profiles, eq(artists.id, profiles.id))
    .where(eq(wishlistItems.userId, user.id))
    .orderBy(desc(wishlistItems.addedAt));

  return items;
}

export async function isInWishlist(artworkId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const [item] = await db
    .select()
    .from(wishlistItems)
    .where(and(
      eq(wishlistItems.userId, user.id),
      eq(wishlistItems.artworkId, artworkId)
    ))
    .limit(1);

  return !!item;
}
```

**Step 4.2b — Build wishlist page UI**

```typescript
// Server component that:
// 1. Calls getWishlist()
// 2. Renders wishlist items in an art grid layout
// 3. Each item: thumbnail, title, artist, price, status badge, remove button
// 4. Remove button is a client component calling removeFromWishlist()
// 5. Empty state: "Your wishlist is empty" with link to marketplace
// 6. Loading skeleton via loading.tsx
```

**File: `src/app/dashboard/customer/wishlist/loading.tsx`** (NEW)

---

### Step 4.3 — Add wishlist button to artwork pages

**File: `src/components/cart/add-to-cart-button.tsx`** (MODIFY or create companion)

Add a heart/bookmark button next to "Add to Cart" on artwork cards and the artwork detail page. This calls `addToWishlist` / `removeFromWishlist` and shows filled vs outlined icon state.

**File: `src/components/cart/add-to-wishlist-button.tsx`** (NEW)

```tsx
"use client";

import { addToWishlist, removeFromWishlist, isInWishlist } from "@/lib/wishlist-actions";
import { useState, useEffect } from "react";

export function AddToWishlistButton({ artworkId }: { artworkId: string }) {
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    isInWishlist(artworkId).then(setInWishlist).finally(() => setLoading(false));
  }, [artworkId]);

  async function handleClick() {
    if (inWishlist) {
      await removeFromWishlist(artworkId);
      setInWishlist(false);
    } else {
      await addToWishlist(artworkId);
      setInWishlist(true);
    }
  }

  if (loading) return null; // or skeleton

  return (
    <button
      onClick={handleClick}
      className="p-2 hover:text-primary transition-colors"
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <span className="material-symbols-outlined">
        {inWishlist ? "favorite" : "favorite"}
      </span>
    </button>
  );
}
```

---

### Step 4.4 — Enhance customer dashboard with real order data

**File: `src/app/dashboard/customer/page.tsx`** (MODIFY)

Currently shows only cart items from Zustand. Enhance to also show:
1. Recent orders (top 3) fetched via Supabase/Drizzle
2. Quick links: Browse Marketplace, View Wishlist, Order History
3. Account summary (member since date)

Make it a Server Component (currently "use client" — it only needed client for Zustand cart). Split into server data fetch + client cart section.

---

### Step 4.5 — Verify Phase 4

- [ ] Artist orders page shows all orders for their artworks with buyer info
- [ ] Artist orders can be filtered by status
- [ ] Wishlist page shows saved items with remove functionality
- [ ] Wishlist button appears on artwork cards and detail page
- [ ] Wishlist add/remove works and persists across page loads
- [ ] Customer dashboard shows recent orders
- [ ] Empty states display for all new pages
- [ ] Loading skeletons work for all new pages
- [ ] `tsc --noEmit` passes

---

---

## Phase 5: Commission System

**Goal:** Build backend for the commission inquiry page — it's currently a static page with a `mailto:` link. Add a proper form with database persistence.

**Time estimate:** 2-3 hours

**Prerequisites:** Phase 1 complete. Read `src/app/(marketing)/commissions/page.tsx`

---

### Step 5.1 — Create commission requests table

**Add to `src/lib/db/schema.ts`** (MODIFY)

```typescript
export const commissionRequests = pgTable("commission_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  deity: text("deity"),
  style: text("style"),
  sizeDescription: text("size_description"),
  budgetNpr: integer("budget_npr"),
  description: text("description").notNull(),
  status: text("status").default("new").notNull(), // 'new', 'contacted', 'in_progress', 'completed', 'cancelled'
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type CommissionRequest = typeof commissionRequests.$inferSelect;
export type NewCommissionRequest = typeof commissionRequests.$inferInsert;
```

Don't forget to run `drizzle-kit generate` after adding, then `drizzle-kit push`.

---

### Step 5.2 — Create commission Zod schema

**File: `src/lib/validators/commission.ts`** (NEW)

```typescript
import { z } from "zod";

export const commissionSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Valid email required"),
  phone: z.string().max(20).optional(),
  deity: z.string().max(100).optional(),
  style: z.string().max(100).optional(),
  sizeDescription: z.string().max(500).optional(),
  budgetNpr: z.number().int().min(5000).optional(),
  description: z.string().min(20, "Please share more about your vision").max(3000),
});

export type CommissionInput = z.infer<typeof commissionSchema>;
```

---

### Step 5.3 — Create commission server action

**File: `src/lib/commission-actions.ts`** (NEW)

```typescript
"use server";

import { db } from "@/lib/db";
import { commissionRequests } from "@/lib/db/schema";
import { commissionSchema } from "@/lib/validators/commission";
import { revalidatePath } from "next/cache";

export async function submitCommission(formData: FormData) {
  const parsed = commissionSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    deity: formData.get("deity") || undefined,
    style: formData.get("style") || undefined,
    sizeDescription: formData.get("sizeDescription") || undefined,
    budgetNpr: formData.get("budgetNpr") ? Number(formData.get("budgetNpr")) : undefined,
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await db.insert(commissionRequests).values(parsed.data);
  revalidatePath("/commissions");
  return { success: true };
}
```

---

### Step 5.4 — Replace the commission page CTA with a working form

**File: `src/app/(marketing)/commissions/page.tsx`** (MODIFY)

Replace the bottom CTA section (`mailto:commissions@kathmanduarts.com`) with a proper inquiry form:

```tsx
// Replace the CTA section at the bottom with:

<section className="border border-primary/20 bg-surface-container-high p-8 md:p-12 rounded-sm mt-section-gap max-w-3xl mx-auto">
  <h2 className="text-headline-md text-on-background mb-4">Ready to Begin?</h2>
  <p className="text-body-lg text-on-surface-variant mb-8 max-w-xl mx-auto text-center">
    Share your vision below and our curation team will respond within 48 hours
    with artist recommendations and a preliminary timeline.
  </p>
  <CommissionForm />
</section>
```

**File: `src/components/commission/commission-form.tsx`** (NEW)

```tsx
"use client";

// Client form with:
// - name, email, phone inputs
// - deity preference (select or input)
// - preferred style (select: Karma Gadri, Newari, Tibetan, Thangka, Any)
// - size description (textarea: e.g., "Approximately 90cm x 60cm")
// - budget range (NPR number input)
// - detailed description (textarea, required, min 20 chars)
// - Submit button (GoldButton)
// - Loading/error/success states
// - On success: show confirmation message in-page (no redirect)
// - Uses React Hook Form + Zod validation
```

Form fields:
1. **Name** (Input, required)
2. **Email** (Input type="email", required)
3. **Phone** (Input, optional, for WhatsApp contact)
4. **Preferred Deity/Subject** (Input, optional — "Buddha", "Tara", "Mandala", "Other")
5. **Preferred Style** (Select, optional: Any, Karma Gadri, Newari, Tibetan, Thangka)
6. **Approximate Size** (Input, optional — e.g., "90cm x 60cm")
7. **Budget (NPR)** (Number input, optional, min 5000)
8. **Your Vision** (Textarea, required, min 20 chars — "Describe the deity, composition, colors, and intention...")
9. **Submit button** — "Submit Inquiry" with loading state

Design: Use the same form styling patterns as the checkout page and artwork upload form. `bg-surface-dim` inputs, `border-outline`, `h-11`, `focus-visible:border-primary`.

---

### Step 5.5 — Add admin commission management (optional)

If time permits, add a simple list at `/dashboard/admin/commissions` showing all inquiries with status management. This can be deferred to a future phase but should be noted.

---

### Step 5.6 — Verify Phase 5

- [ ] Commission form renders with all fields
- [ ] Client-side validation prevents empty/invalid submissions
- [ ] Successful submission shows confirmation message
- [ ] Commission request saved to `commission_requests` table in DB
- [ ] Form uses design system tokens
- [ ] Responsive on mobile
- [ ] `tsc --noEmit` passes

---

---

## Phase 6: Cart & Wishlist Database Sync

**Goal:** Sync cart state to Supabase for logged-in users (currently localStorage only). This prevents cart loss across devices and provides a persistent shopping experience.

**Time estimate:** 2 hours

**Prerequisites:** Phase 1 complete (middleware). Read `src/hooks/use-cart.ts`, `src/lib/db/schema.ts` (cartItems table)

---

### Step 6.1 — Create cart sync server actions

**File: `src/lib/cart-actions.ts`** (NEW)

```typescript
"use server";

import { db } from "@/lib/db";
import { cartItems, artworks, artists, profiles } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function syncCartToDb(items: Array<{ artworkId: string }>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Get existing cart items for this user
  const existing = await db
    .select({ artworkId: cartItems.artworkId })
    .from(cartItems)
    .where(eq(cartItems.userId, user.id));

  const existingIds = new Set(existing.map(e => e.artworkId));
  const newIds = new Set(items.map(i => i.artworkId));

  // Remove items no longer in cart
  for (const id of existingIds) {
    if (!newIds.has(id)) {
      await db
        .delete(cartItems)
        .where(and(
          eq(cartItems.userId, user.id),
          eq(cartItems.artworkId, id)
        ));
    }
  }

  // Add new items
  for (const item of items) {
    if (!existingIds.has(item.artworkId)) {
      await db
        .insert(cartItems)
        .values({ userId: user.id, artworkId: item.artworkId })
        .onConflictDoNothing();
    }
  }
}

export async function getCartFromDb() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  return db
    .select({
      artworkId: artworks.id,
      slug: artworks.slug,
      title: artworks.title,
      images: artworks.images,
      priceNpr: artworks.priceNpr,
      artistName: profiles.fullName,
      artistSlug: artists.slug,
    })
    .from(cartItems)
    .innerJoin(artworks, eq(cartItems.artworkId, artworks.id))
    .innerJoin(artists, eq(artworks.artistId, artists.id))
    .innerJoin(profiles, eq(artists.id, profiles.id))
    .where(eq(cartItems.userId, user.id));
}

export async function clearCartFromDb() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await db.delete(cartItems).where(eq(cartItems.userId, user.id));
}
```

---

### Step 6.2 — Update Zustand cart store to sync with DB

**File: `src/hooks/use-cart.ts`** (MODIFY)

Add a `syncWithServer` method and call it when:
- User logs in (merge localStorage cart into DB cart)
- Cart changes (add/remove items) while logged in
- User opens page while already logged in

```typescript
// Add to the CartState interface:
syncWithServer: () => Promise<void>;
loadFromServer: () => Promise<void>;

// Implementation:
syncWithServer: async () => {
  const { items } = get();
  await syncCartToDb(items.map(i => ({ artworkId: i.artworkId })));
},

loadFromServer: async () => {
  const serverItems = await getCartFromDb();
  if (serverItems.length > 0) {
    set({
      items: serverItems.map(item => ({
        artworkId: item.artworkId,
        slug: item.slug,
        title: item.title,
        image: item.images?.[0] ?? "",
        priceNpr: item.priceNpr,
        artistName: item.artistName ?? "",
        addedAt: Date.now(),
      }))
    });
  }
},
```

The sync is triggered from appropriate places (after login, after cart actions, on app load). This is a "best effort" sync — localStorage remains the source of truth, DB is the backup.

---

### Step 6.3 — Verify Phase 6

- [ ] Cart syncs to Supabase when logged-in user adds/removes items
- [ ] Cart loads from Supabase on login (merges with localStorage)
- [ ] Cart persists across browser sessions for logged-in users
- [ ] Guest (unauthenticated) users still have localStorage-only cart
- [ ] No errors when cart is empty
- [ ] `tsc --noEmit` passes

---

---

## Phase 7: SEO & Performance

**Goal:** Add proper metadata, structured data (JSON-LD), `next/image` optimization, ISR caching, and sitemap improvements.

**Time estimate:** 2-3 hours

**Prerequisites:** Phase 1-6 complete (need content to optimize)

---

### Step 7.1 — Add `generateMetadata` to all public pages

**Files to modify (check and add where missing):**
- `src/app/(marketing)/artists/[slug]/page.tsx`
- `src/app/(marketing)/marketplace/[slug]/page.tsx`
- `src/app/(marketing)/knowledge-hub/page.tsx`
- `src/app/(marketing)/knowledge-hub/[slug]/page.tsx`
- `src/app/(marketing)/artists/page.tsx`

Pattern:
```typescript
import type { Metadata } from "next";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // Fetch data for title/description
  return {
    title: `${artwork.title} — Kathmandu Arts`,
    description: artwork.description.slice(0, 160),
    openGraph: {
      title: artwork.title,
      description: artwork.description.slice(0, 160),
      images: artwork.images?.[0] ? [{ url: artwork.images[0] }] : [],
    },
  };
}
```

---

### Step 7.2 — Add JSON-LD structured data to artwork detail pages

**File: `src/app/(marketing)/marketplace/[slug]/page.tsx`** (MODIFY)

Add `Product` schema.org structured data:

```typescript
// Add to the page component after fetching artwork data:

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": artwork.title,
  "description": artwork.description,
  "image": artwork.images,
  "offers": {
    "@type": "Offer",
    "price": artwork.priceUsd ?? Math.round(artwork.priceNpr / 134),
    "priceCurrency": artwork.priceUsd ? "USD" : "NPR",
    "availability": artwork.status === "available"
      ? "https://schema.org/InStock"
      : "https://schema.org/SoldOut",
  },
  // Add artist as "creator"
  "creator": {
    "@type": "Person",
    "name": artistProfile.fullName,
  },
};

// In the JSX:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

Also add `BreadcrumbList` schema on the artwork detail and marketplace pages, and `Organization` schema on the root layout.

---

### Step 7.3 — Replace raw `<img>` tags with `next/image`

**Files to scan and fix:**

1. **`src/components/art/art-card.tsx`** — primary image (currently uses `<img>` with grayscale filter)
2. **`src/components/artist/artist-card.tsx`** — artist portrait
3. **`src/app/dashboard/artist/page.tsx`** — artwork thumbnails in recent list (line 117, uses `<img>`)
4. **`src/app/dashboard/customer/page.tsx`** — cart item thumbnails (line 42, uses `<img>`)
5. **`src/app/(marketing)/marketplace/[slug]/page.tsx`** — main gallery image and thumbnails
6. **`src/components/cart/cart-drawer.tsx`** — cart item thumbnails
7. **`src/components/search/search-modal.tsx`** — search result thumbnails

Pattern for replacement:
```tsx
// Before:
<img src={image} alt={title} className="w-full h-full object-cover" />

// After:
<Image
  src={image}
  alt={title}
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

For fixed-size images (thumbnails):
```tsx
<Image
  src={image}
  alt={title}
  width={80}
  height={80}
  className="object-cover"
/>
```

The `next.config.ts` already has `*.supabase.co` in `remotePatterns`, so Supabase Storage images are covered.

---

### Step 7.4 — Add ISR revalidation for public pages

**Pages to update:**

1. **`src/app/(marketing)/artists/page.tsx`** — currently `force-dynamic`. Change to:
   ```typescript
   export const revalidate = 300; // 5 minutes
   ```

2. **`src/app/(marketing)/artists/[slug]/page.tsx`** — add ISR if currently `force-dynamic`

3. **`src/app/(marketing)/knowledge-hub/page.tsx`** — add ISR (1 hour for articles):
   ```typescript
   export const revalidate = 3600;
   ```

4. **`src/app/(marketing)/knowledge-hub/[slug]/page.tsx`** — add ISR

5. **Landing page** — currently `force-dynamic`. Add ISR:
   ```typescript
   export const revalidate = 120; // 2 minutes
   ```

Ensure `revalidatePath()` is called in all relevant server actions so ISR pages are purged on mutations.

---

### Step 7.5 — Add `generateStaticParams` to dynamic routes

**Files to create/modify:**
- `src/app/(marketing)/marketplace/[slug]/page.tsx`
- `src/app/(marketing)/artists/[slug]/page.tsx`
- `src/app/(marketing)/knowledge-hub/[slug]/page.tsx`

```typescript
export async function generateStaticParams() {
  const slugs = await db
    .select({ slug: artworks.slug })
    .from(artworks)
    .where(eq(artworks.status, "available"));

  return slugs.map(({ slug }) => ({ slug }));
}
```

This enables static generation for known pages at build time, with ISR for new ones.

---

### Step 7.6 — Verify Phase 7

- [ ] All public pages have `generateMetadata` with title, description, OG tags
- [ ] JSON-LD structured data on artwork detail pages (Product schema)
- [ ] JSON-LD Organization schema on root layout
- [ ] JSON-LD BreadcrumbList on marketplace and artwork pages
- [ ] All `<img>` tags replaced with `next/image` (7 components checked)
- [ ] Images have proper `sizes` attribute for responsive loading
- [ ] ISR revalidation set on all public pages
- [ ] `generateStaticParams` on all dynamic routes
- [ ] `pnpm build` succeeds with no image-related warnings
- [ ] Lighthouse score 80+ on mobile, 90+ on desktop

---

---

## Phase 8: Error Handling & Loading States

**Goal:** Add proper error boundaries for route groups, consistent loading skeletons, and empty state handling across all pages.

**Time estimate:** 2 hours

**Prerequisites:** All previous phases complete

---

### Step 8.1 — Add route-group error boundaries

**Files to create:**
- `src/app/(marketing)/error.tsx` — already exists at root, verify it handles marketing pages
- `src/app/(auth)/error.tsx` (NEW) — auth-specific error boundary
- `src/app/checkout/error.tsx` (NEW) — checkout-specific error boundary

The root `error.tsx` already exists. Each route group that needs special error UI should get its own.

Pattern:
```tsx
"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md px-6">
        <span className="material-symbols-outlined text-6xl text-error/40">error_outline</span>
        <h2 className="text-headline-md text-on-background mt-4">Something went wrong</h2>
        <p className="text-body-md text-on-surface-variant mt-2">
          {error.message || "An unexpected error occurred"}
        </p>
        <button
          onClick={reset}
          className="mt-6 px-8 py-3 bg-secondary text-on-secondary text-label-sm uppercase tracking-widest rounded-full hover:bg-accent transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
```

---

### Step 8.2 — Add loading skeletons for pages that lack them

**Files to create or verify:**

**Create if missing:**
- `src/app/(marketing)/artists/loading.tsx` — if missing
- `src/app/(marketing)/commissions/loading.tsx` — if missing
- `src/app/(marketing)/knowledge-hub/loading.tsx` — if missing
- `src/app/(marketing)/knowledge-hub/[slug]/loading.tsx` — if missing
- `src/app/dashboard/artist/orders/loading.tsx` (NEW)
- `src/app/dashboard/customer/wishlist/loading.tsx` (NEW)
- `src/app/dashboard/customer/orders/loading.tsx` — if missing
- `src/app/(auth)/verify/loading.tsx` — if missing

Pattern: Use the `Skeleton` component from `src/components/ui/skeleton.tsx` plus an `animate-pulse` grid of placeholder blocks matching the page layout.

---

### Step 8.3 — Audit empty states across all pages

Check every page for empty state handling:

| Page | Status | Action |
|---|---|---|
| `/marketplace` | Has empty state ("No artworks match...") | OK |
| `/artists` | Check — should say "No artists found" if empty | Verify |
| `/knowledge-hub` | Check | Verify |
| `/dashboard/artist` | Has empty state ("Welcome to Your Studio") | OK |
| `/dashboard/artist/artworks` | Check (passes to client component) | Verify |
| `/dashboard/artist/orders` | New page — add empty state | Add |
| `/dashboard/customer` | Has empty cart state | OK |
| `/dashboard/customer/orders` | Needs verification | Verify |
| `/dashboard/customer/wishlist` | New page — add empty state | Add |
| `/dashboard/admin/users` | Needs verification | Verify |
| `/dashboard/admin/artists` | Needs verification | Verify |
| `/dashboard/admin/artworks` | Needs verification | Verify |

Pattern for empty states:
```tsx
<div className="text-center py-20 bg-surface-container-low border border-outline-variant rounded-sm">
  <span className="material-symbols-outlined text-6xl text-on-surface-variant/20">
    {/* relevant icon */}
  </span>
  <p className="text-body-lg text-on-surface-variant mt-4">
    {/* empty message */}
  </p>
  {/* optional CTA button */}
</div>
```

---

### Step 8.4 — Add toast notifications for key user actions

Ensure toast notifications (Sonner) are used for:
- Artwork created/updated/deleted (already may exist)
- Artwork published
- Added to cart
- Added to wishlist / removed from wishlist
- Order placed
- Profile updated
- Commission submitted

The `<Toaster>` is already in root layout. Import `toast` from `sonner` and call in client components:
```typescript
import { toast } from "sonner";
toast.success("Artwork published");
toast.error("Failed to save changes");
```

---

### Step 8.5 — Verify Phase 8

- [ ] Error boundaries exist for all route groups
- [ ] Loading skeletons appear during page transitions for all routes
- [ ] All pages handle empty state with helpful messaging
- [ ] No white screens or unhandled crashes
- [ ] Toast notifications appear for key actions
- [ ] `tsc --noEmit` passes

---

---

## Phase 9: Production Hardening

**Goal:** Add rate limiting, input sanitization, fix the design system docs, create the search API route, and ensure build passes clean.

**Time estimate:** 2-3 hours

**Prerequisites:** All previous phases complete

---

### Step 9.1 — Add rate limiting to server actions

No external rate-limiting library needed for MVP. Use a simple in-memory approach or Supabase-based rate limiting.

Simple approach: Add a `request_count` check using a Supabase table or just use Vercel's built-in rate limiting via `vercel.json`:

**File: `vercel.json`** (NEW or MODIFY)
```json
{
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

For server actions, add a simple rate limit wrapper:

**File: `src/lib/rate-limit.ts`** (NEW)

```typescript
const rateLimit = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(key: string, limit = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = rateLimit.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimit.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}
```

Apply to mutation server actions (create, update, delete) in:
- `src/lib/artwork-actions.ts`
- `src/lib/order-actions.ts`
- `src/lib/auth/actions.ts` (signIn/signUp)
- `src/lib/commission-actions.ts`
- `src/lib/wishlist-actions.ts`

---

### Step 9.2 — Create search API route

**File: `src/app/api/search/route.ts`** (NEW)

The architecture docs planned for this but it was never built. The search modal currently uses `searchArtworks()` server action directly. An API route provides a proper REST endpoint for external consumers and future client-side search use.

```typescript
import { NextRequest, NextResponse } from "next/server";
import { searchArtworks } from "@/lib/search-actions";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchArtworks(q);
    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
```

---

### Step 9.3 — Update design system docs to match current theme

**File: `docs/DESIGN_SYSTEM.md`** (MODIFY)

Section 2 ("Color System") currently describes the original dark theme (`#14140f` background). Update to match the actual warm cream theme in `globals.css`:

- Replace the color token table (Section 2) with the current warm palette values
- Update the `dark` mode note: The base theme is warm cream, not dark
- Verify component specs in Section 6 match the actual built components
- Update GoldButton description: Solid `secondary` background (not gradient), hover shifts to `accent`
- Update Side Drawer background: `#F5F1E8` cream (already correct)

---

### Step 9.4 — Add input sanitization

Add a simple sanitization utility for user-provided text:

**File: `src/lib/utils/sanitize.ts`** (NEW)

```typescript
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, "") // Strip HTML tags
    .replace(/[<>]/g, "")     // Remove angle brackets
    .trim();
}

export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
```

Apply to all places where user text is stored:
- `createArtwork` — title, description, deity, style, medium
- `submitCommission` — description, name
- `signUp` — fullName
- `updateArtistProfile` — bio, lineage

---

### Step 9.5 — Verify the build

```bash
pnpm build
```

Expected: zero errors, zero warnings. Address any issues before marking Phase 9 complete.

---

### Step 9.6 — Verify Phase 9

- [ ] Rate limiting in place on mutation server actions
- [ ] `/api/search?q=term` returns JSON results
- [ ] `docs/DESIGN_SYSTEM.md` updated with current theme colors
- [ ] Input sanitization applied to user-provided text fields
- [ ] `pnpm build` passes with zero errors and zero warnings
- [ ] `tsc --noEmit` passes with zero errors

---

---

## Phase 10: End-to-End Verification

**Goal:** Walk through all user flows, verify every page renders correctly, and confirm the system works as a whole.

**Time estimate:** 1-2 hours

**Prerequisites:** ALL previous phases complete

---

### Step 10.1 — Public visitor flow

1. Visit `/` — landing page renders with 10 sections, images load, animations work
2. Visit `/marketplace` — 6 artworks shown, search works, deity/style filter works, price slider works
3. Click an artwork — detail page shows: image gallery, title, artist link, price, materials, certificate, creation steps
4. Visit `/artists` — 4 artists shown
5. Click an artist — profile page shows bio, lineage, specializations, artwork count
6. Visit `/knowledge-hub` — 6 articles shown
7. Click an article — full content renders with images
8. Visit `/commissions` — inquiry form renders and submits successfully
9. Mobile: FAB filter button appears, opens Sheet, filters work
10. Open search modal (Ctrl+K or click search icon) — search returns results, clicking navigates to artwork

---

### Step 10.2 — Authentication flow

1. Visit `/dashboard` while logged out — redirect to `/login`
2. Visit `/login` while logged in — redirect to `/dashboard`
3. Register new account — redirected to `/verify`
4. Login — redirected to customer dashboard
5. Logout — redirected to `/`

---

### Step 10.3 — Artist flow

1. Admin upgrades a user to artist via `/dashboard/admin/users`
2. Login as artist — artist dashboard shows stats (0 artworks initially)
3. Edit artist profile — set bio, lineage, specializations, awards, upload studio images
4. View public profile at `/artists/{slug}` — updated info shown
5. Create new artwork (draft) — fill form, upload 3 images, save as draft
6. Verify draft appears in artwork list
7. Edit artwork — change price, add creation steps (5 steps), generate certificate
8. Publish artwork — appears in marketplace
9. Check artist orders page — shows orders (or empty state)
10. View artist dashboard stats — reflect correct counts

---

### Step 10.4 — Customer flow

1. Browse marketplace, open search modal, search for an artwork
2. Add artwork to cart — toast notification appears
3. Add artwork to wishlist — heart icon fills
4. View cart drawer — item shows with thumbnail, title, price
5. Go to checkout — shipping form
6. Fill shipping info and proceed
7. View wishlist page — saved items shown with remove option
8. View customer dashboard — cart items and recent orders shown
9. Check orders page — empty state or order history shown

---

### Step 10.5 — Admin flow

1. Login as admin — redirected to admin overview with stats
2. Navigate to Users — list shows all profiles
3. Upgrade a client to artist — verify artist profile appears
4. Navigate to Artists — list shows pending and verified
5. Approve an artist
6. Navigate to Artworks — moderation queue visible

---

### Step 10.6 — Technical verification

- [ ] `tsc --noEmit` passes with zero errors
- [ ] `pnpm build` passes with zero errors and zero warnings
- [ ] No console errors in browser during any flow
- [ ] All images load without broken URLs
- [ ] All forms submit without errors
- [ ] Database has correct data after all operations
- [ ] Supabase Storage has uploaded images
- [ ] RLS policies enforce access control correctly
- [ ] Middleware protects `/dashboard/*` and `/checkout/*`
- [ ] All pages responsive at 375px, 768px, 1024px, 1440px

---

---

## Summary: Files Changed Per Phase

| Phase | New Files | Modified Files | Description |
|---|---|---|---|
| 1: Foundation | 5 | 0 | middleware.ts, types/ (4 files) |
| 2: Data & Content | 2 | 0 | seed_articles.sql, seed_testimonials.sql |
| 3: Marketplace | 1 | 3 | mobile-filter-sheet, filter-sidebar, search-bar, marketplace page |
| 4: Dashboard | 4 | 2 | artist orders, wishlist page + actions + loading, customer dashboard |
| 5: Commission | 4 | 2 | commission table migration, validator, action, form, page update |
| 6: Cart & Wishlist | 1 | 1 | cart-actions.ts, use-cart.ts |
| 7: SEO & Perf | 0 | 8+ | metadata, JSON-LD, next/image, ISR, generateStaticParams |
| 8: Errors & Loading | 3 | 8+ | error boundaries, loading skeletons, empty states, toasts |
| 9: Hardening | 4 | 5+ | rate-limit, search API, sanitize, design docs, vercel.json |
| 10: E2E | 0 | 0 | Manual testing checklist |
| **Total** | **~24 new** | **~29 modified** | |

---

## Agent Prompt Templates

### For Phase 1:
```
You are working on Kathmandu Arts (ThangkaHub), a premium marketplace for Nepali Thangka art.

Read first: docs/PROJECT_RULES.md, docs/IMPLEMENTATION_PLAN.md, src/lib/supabase/server.ts, src/lib/auth/roles.ts

Task: Phase 1 — Foundation & Infrastructure
From docs/progression-2/june-15-implementation-plan.md, execute Steps 1.1-1.6.

Create:
1. src/middleware.ts — route-level auth protection
2. src/types/ directory — shared type definitions

Also: run drizzle-kit generate, verify RLS policies, verify storage buckets.
```

### For Phase 3:
```
You are working on Kathmandu Arts (ThangkaHub).

Read: docs/DESIGN_SYSTEM.md (sections 2-4, 6.9), src/components/marketplace/filter-sidebar.tsx, src/app/(marketing)/marketplace/page.tsx

Task: Phase 3 — Marketplace Polish
From docs/progression-2/june-15-implementation-plan.md, execute Steps 3.1-3.5.

Wire the price slider, fix subject/deity naming, add mobile filter FAB with Sheet, add search debounce.
```

### For Phase 4:
```
You are working on Kathmandu Arts (ThangkaHub).

Read: src/lib/db/schema.ts, src/lib/order-actions.ts, src/hooks/use-cart.ts

Task: Phase 4 — Dashboard Completion
From docs/progression-2/june-15-implementation-plan.md, execute Steps 4.1-4.5.

Build artist orders page (stub), wishlist page with full CRUD (stub), enhance customer dashboard.
```

### For Phase 5:
```
You are working on Kathmandu Arts (ThangkaHub).

Read: src/lib/db/schema.ts, src/app/(marketing)/commissions/page.tsx, src/lib/validators/artwork.ts (for pattern)

Task: Phase 5 — Commission System
From docs/progression-2/june-15-implementation-plan.md, execute Steps 5.1-5.6.

Add commission_requests table, create Zod validator, create server action, build inquiry form.
```

### For Phase 7:
```
You are working on Kathmandu Arts (ThangkaHub).

Task: Phase 7 — SEO & Performance
From docs/progression-2/june-15-implementation-plan.md, execute Steps 7.1-7.6.

Add generateMetadata to all public pages, add JSON-LD structured data, replace <img> with next/image, add ISR, add generateStaticParams.
```

### For Phase 9:
```
You are working on Kathmandu Arts (ThangkaHub).

Task: Phase 9 — Production Hardening
From docs/progression-2/june-15-implementation-plan.md, execute Steps 9.1-9.6.

Add rate limiting, create /api/search route, update design docs, add input sanitization, run pnpm build.
```

---

## Quick Reference

| Need | Location |
|---|---|
| Design tokens | `src/app/globals.css` |
| Component patterns | `docs/DESIGN_SYSTEM.md` section 6 |
| Route structure | `docs/ARCHITECTURE.md` section 4 |
| DB schema | `src/lib/db/schema.ts` |
| Auth flow | `src/lib/auth/actions.ts` + `src/lib/auth/roles.ts` |
| Server actions | `src/lib/` directory |
| Zod validators | `src/lib/validators/` |
| ShadCN components | `src/components/ui/` |
| Coding rules | `docs/PROJECT_RULES.md` |
| Current build state | `docs/IMPLEMENTATION_PLAN.md` |
