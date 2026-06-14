# Marketplace & Artist System — Production Update Plan

> **For AI coding assistants.** Each phase is a self-contained work unit. Read the prerequisites before starting. Verify each phase before moving on.

---

## Prerequisites for ALL Agents

Every agent must read these before starting ANY phase:

1. `docs/PROJECT_RULES.md` — coding rules, conventions, anti-patterns
2. `docs/DESIGN_SYSTEM.md` — design tokens (sections 2-4), component catalog (sections 6.1-6.10)
3. `docs/ARCHITECTURE.md` — sections 3 (DB schema), 4 (routes), 6 (component architecture)
4. `docs/PROGRESSION-1.md` — what was already built, known gaps
5. Read at least one existing similar file before creating a new one

---

## Current State Summary

**What works (read path):** Marketplace browsing, artwork detail, artist directory, artist profiles, filter sidebar (partial), search, sort, pagination, cart.

**What's broken (write path):** 5 artist dashboard pages are empty stubs. Artists cannot upload, list, or manage artworks. No artwork seed data exists. Several bugs in server actions. Filter sidebar price slider is decorative only.

**Server actions exist but are orphans:** `createArtwork`, `updateArtwork`, `uploadArtworkImage`, `addCreationStep`, `generateCertificate`, `publishArtwork`, `deleteArtwork` — all implemented in `src/lib/artwork-actions.ts` but never called from any real UI form.

**Key files to reference:**
- `src/lib/db/schema.ts` — all 14 tables, enums, type exports
- `src/lib/artwork-actions.ts` — artwork CRUD server actions (already built)
- `src/lib/auth/artist-actions.ts` — artist profile CRUD (already built)
- `src/lib/validators/artwork.ts` — Zod schemas for artwork + creation steps
- `src/lib/validators/artist.ts` — Zod schema for artist profile
- `src/lib/utils/slug.ts` — `generateSlug()` utility
- `src/components/art/art-card.tsx` — ArtCard component (existing pattern)
- `src/components/ui/` — ShadCN components available

---

---

## Phase A: Artwork Upload Form (The Critical Path)

**Goal:** Artist can create a complete artwork with all fields, upload images to Supabase Storage, and publish it to the marketplace. This is the single most important piece — without it, the marketplace has zero content.

**Time estimate:** 4-5 hours

**Prerequisites:** Read `src/lib/validators/artwork.ts`, `src/lib/artwork-actions.ts`, `src/lib/db/schema.ts` (artworks table), `src/app/(dashboard)/layout.tsx`

---

### Step A.1 — Replace the artwork upload stub

**File: `src/app/dashboard/artist/artworks/new/page.tsx`**

Replace the entire file. Build a single-page form (not multi-step wizard — keep it practical):

```
"use client";

Form sections (all on one page, scrollable):

1. BASIC INFO
   - Title (Input, required)
   - Description (textarea, required, min 3-4 lines height)
   - Deity (Input, optional)
   - Style (Select or Input: Karma Gadri, Newari, Tibetan, Thangka, Other)
   - Medium (Input: "Mineral pigments on cotton canvas", etc.)

2. CATEGORIES (checkboxes)
   - Mandala, Deities, Life of Buddha, Landscape, Abstract, Thangka, Other

3. PRICING
   - Price NPR (Input type="number", required, min 1000)
   - Price USD (Input type="number", optional)
   - Dimensions: height (cm) + width (cm) (2 number inputs, optional)
   - Year Created (Input type="number", optional, max current year)

4. MATERIALS
   - Multi-select chips or comma-separated input
   - Common suggestions as clickable chips: "24K Gold", "Lapis Lazuli", "Vermilion", "Mineral Pigments", "Cotton Canvas", "Silk Canvas"

5. IMAGES (the critical part)
   - File input: accept="image/*", multiple
   - Preview thumbnails grid as files are selected
   - First image marked as "Primary"
   - Max 10 images, max 5MB each (client-side check + error message)
   - Upload button that calls uploadArtworkImage() for each file
   - Show upload progress per image (at minimum: "Uploading... 3/5")
   - Server action: import { uploadArtworkImage } from "@/lib/artwork-actions"
   - Flow: Create artwork first (gets ID), then upload images one by one to that ID

6. SUBMISSION
   - Two buttons: "Save as Draft" (OutlineButton) and "Publish" (GoldButton)
   - Save as Draft → status = "draft", redirect to /dashboard/artist/artworks
   - Publish → status = "available", redirect to /dashboard/artist/artworks
   - Loading state on submit button (disabled + "Creating..." text)
   - Error display: show error message from server action in red text below form
   - Success: redirect to artwork list

FLOW:
  1. User fills form
  2. Clicks "Save as Draft" or "Publish"
  3. Form calls createArtwork() → gets back { slug } or { error }
  4. If error, show error message, stop
  5. If images were selected, upload them one by one via uploadArtworkImage(artworkId, formData)
  6. On success, redirect to /dashboard/artist/artworks
```

**Validation rules to enforce client-side before calling server action:**
- Title required, min 3 chars
- Description required, min 20 chars
- Price NPR required, min 1000
- At least one category selected
- If images selected, max 10, max 5MB each
- Show inline validation errors, not alerts

**Design notes:**
- Use `bg-surface-container-low` for form sections, with `border border-outline-variant` and `p-6` spacing
- Section labels in `text-label-sm uppercase tracking-widest text-primary`
- Inputs use ShadCN `Input` with dark theme styling: `className="bg-surface border-outline-variant text-on-surface"`
- GoldButton for publish, OutlineButton for save draft
- Form width: max-w-3xl

---

### Step A.2 — Add image upload progress feedback

The `uploadArtworkImage` server action takes `(artworkId: string, formData: FormData)`. The client needs to:

1. Create the artwork first → get the artwork ID
2. For each selected file, create a new FormData, append the file, call `uploadArtworkImage(id, formData)`
3. Track progress: show "Uploading image 3 of 7..." with a simple counter
4. On any upload failure, show which image failed and allow retry

Implementation pattern:
```ts
// After createArtwork succeeds and returns { slug }
// We need the ID. createArtwork currently returns { slug }. 
// Either: change createArtwork to also return { id }, OR
// fetch the artwork by slug to get its ID, OR
// modify createArtwork to return { id, slug }
```

**Action: Modify `createArtwork` in `src/lib/artwork-actions.ts` to also return `id`:**
```ts
return { id: artwork.id, slug: artwork.slug };
```

---

### Step A.3 — Verify Phase A

- [x] Artist can navigate to `/dashboard/artist/artworks/new`
- [x] Form renders with all fields, checkboxes, image upload
- [x] Client-side validation prevents empty/invalid submissions
- [x] "Save as Draft" creates artwork with status "draft" in DB
- [x] "Publish" creates artwork with status "available" in DB
- [x] Images upload to Supabase Storage and URLs are stored in artwork.images
- [x] After successful creation, redirects to artwork list
- [x] Error from server action displays in form (not alert())
- [x] `tsc --noEmit` passes
- [x] Form looks dark-themed and uses design system tokens

---

---

## Phase B: Artist Artwork List & Management

**Goal:** Artist can see all their artworks (drafts + published), filter by status, and perform actions (edit, publish, delete).

**Time estimate:** 2-3 hours

**Prerequisites:** Phase A complete (artworks can be created)

**Files to read:** `src/lib/artwork-actions.ts`, `src/app/dashboard/artist/artworks/[id]/edit/page.tsx`

---

### Step B.1 — Build the artwork list page

**File: `src/app/dashboard/artist/artworks/page.tsx`**

Replace the entire file. Server Component that:

1. Gets current user via `getCurrentUser()` from `@/lib/auth/roles`
2. Queries artworks WHERE `artistId = user.id`, ordered by `createdAt DESC`
3. Displays as a card grid or table:

```
HEADER:
  <h1>My Artworks</h1>
  <GoldButton as Link to /dashboard/artist/artworks/new>Add New Artwork</GoldButton>

FILTER TABS (client component):
  [All (count)] [Published (count)] [Drafts (count)]
  - Each tab filters the displayed artworks client-side
  - Use useState to track active tab

ARTWORK LIST:
  For each artwork, render a row/card:
  - Thumbnail (first image, 80x80, object-cover, or placeholder icon if no images)
  - Title (headline-md)
  - Status badge: "Published" (green/gold) or "Draft" (gray)
  - Price: NPR formatted
  - Date: created_at formatted as "Jan 15, 2026"
  - Actions:
    - Edit button → /dashboard/artist/artworks/{id}/edit
    - If draft: "Publish" button → calls publishArtwork(id) server action
    - Delete button → calls deleteArtwork(id) server action, with confirmation

EMPTY STATE (when no artworks):
  <div className="text-center py-20">
    <span className="material-symbols-outlined text-6xl text-on-surface-variant/20">brush</span>
    <p className="text-body-lg text-on-surface-variant mt-4">You haven't created any artworks yet</p>
    <GoldButton as Link to /dashboard/artist/artworks/new className="mt-6">Create Your First Artwork</GoldButton>
  </div>

LOADING STATE:
  Create src/app/dashboard/artist/artworks/loading.tsx
  - 3-4 skeleton rows with pulsing placeholders
```

**Important:** Server actions called from this page (publish, delete) need to be invoked via forms with `action` prop pointing to the server action, or via client component wrappers.

Since `revalidatePath` is called inside the server actions, the page will refresh automatically after mutations.

**Publish button pattern:**
```tsx
// In a client component or inline form:
<form action={async () => {
  "use server";
  await publishArtwork(artworkId);
}}>
  <button type="submit">Publish</button>
</form>
```

Or import `publishArtwork` directly in a `"use client"` button component and call it on click.

**Delete button pattern:**
- Wrap in a client component with a confirmation state
- Show "Are you sure?" with Yes/No before calling deleteArtwork

---

### Step B.2 — Create loading skeleton

**File: `src/app/dashboard/artist/artworks/loading.tsx`**

```tsx
export default function ArtworksLoading() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex gap-4 p-4 bg-surface-container-low rounded-sm animate-pulse">
          <div className="w-20 h-20 bg-surface-container-higher rounded-sm" />
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-surface-container-higher rounded-sm w-1/3" />
            <div className="h-4 bg-surface-container-higher rounded-sm w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

### Step B.3 — Verify Phase B

- [x] `/dashboard/artist/artworks` shows all artworks for logged-in artist
- [x] Filter tabs (All / Published / Drafts) work client-side
- [x] Empty state shows when artist has no artworks
- [x] Edit button navigates to edit page
- [x] Publish button changes status to "available"
- [x] Delete button shows confirmation then soft-deletes (sets to draft)
- [x] "Add New Artwork" button navigates to upload form
- [x] Loading skeleton appears during page load
- [x] `tsc --noEmit` passes

---

---

## Phase C: Artwork Edit Page — Full Upgrade

**Goal:** Artist can edit all artwork fields, manage images (add/remove/reorder), manage creation steps, and generate certificates.

**Time estimate:** 3-4 hours

**Prerequisites:** Phase A complete, Phase B complete

**Files to read:** `src/app/dashboard/artist/artworks/[id]/edit/page.tsx` (existing basic version), `src/lib/artwork-actions.ts`

---

### Step C.1 — Rebuild the edit page

**File: `src/app/dashboard/artist/artworks/[id]/edit/page.tsx`**

Replace entirely. The page must be a Client Component (`"use client"`) because it has forms and interactivity.

Requirements:

```
FETCH EXISTING DATA:
  - useEffect to fetch artwork data OR use a server component wrapper
  - Use route params to get the artwork ID
  - Query the artwork from DB via a new simple fetch or direct DB call

Better approach: Make the page a Server Component that fetches data, then pass to a client form:

page.tsx (server):
  - Get artwork by ID from DB (join with creationSteps, certificates)
  - Pass data as props to <EditArtworkForm />

edit-artwork-form.tsx (client):
  - Receives existing artwork data as props
  - All the form UI

FORM SECTIONS (same structure as upload form, but pre-populated):

1. BASIC INFO — pre-filled with current values
2. CATEGORIES — checkboxes pre-checked based on current categories
3. PRICING — pre-filled
4. MATERIALS — pre-filled

5. CURRENT IMAGES SECTION:
   - Grid of current images with:
     - Thumbnail preview
     - "Primary" badge on first image
     - Delete button (X) on each image → calls a server action to remove from images array
   - "Add More Images" file input
   - Upload new images one by one

6. CREATION STEPS SECTION:
   - List of existing steps with: step number, title, description, duration
   - "Add Step" button → appends a new empty step row
   - Each step row has:
     - Step number (auto-incremented)
     - Title input
     - Description input
     - Duration (days) number input
   - Delete step button (X)
   - "Save Steps" button → batch-upserts creation steps
   - Note: The existing server action `addCreationStep` handles single step insertion. For editing, you may need to:
     a) Delete all existing steps and re-insert, OR
     b) Create an `updateCreationSteps` action
     - Simpler approach: add a "Save Steps" that deletes existing and re-inserts

7. CERTIFICATE SECTION (if artwork is published):
   - If certificate exists: show certificate number, issue date, QR placeholder
   - If no certificate: "Generate Certificate" button → calls generateCertificate(artworkId)
   - Show success/error feedback

8. SAVE CHANGES:
   - "Save Changes" GoldButton → calls updateArtwork(id, data)
   - "Cancel" → back to artwork list
   - Loading/error states
```

**New server action needed — batch update creation steps:**

Add to `src/lib/artwork-actions.ts`:

```ts
export async function saveCreationSteps(artworkId: string, steps: CreationStepInput[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Delete existing steps
  await db.delete(creationSteps).where(eq(creationSteps.artworkId, artworkId));

  // Insert new ones
  if (steps.length > 0) {
    await db.insert(creationSteps).values(
      steps.map((step) => ({ artworkId, ...step }))
    );
  }

  revalidatePath(`/dashboard/artist/artworks/${artworkId}/edit`);
  revalidatePath(`/marketplace/${artworkId}`);
}
```

**New server action — remove single artwork image:**

Add to `src/lib/artwork-actions.ts`:

```ts
export async function removeArtworkImage(artworkId: string, imageUrl: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const artwork = await db.select().from(artworks).where(eq(artworks.id, artworkId)).limit(1);
  if (artwork.length === 0) return { error: "Artwork not found" };

  const currentImages = artwork[0].images ?? [];
  await db.update(artworks)
    .set({ images: currentImages.filter((url) => url !== imageUrl) })
    .where(eq(artworks.id, artworkId));

  // Attempt to delete from storage (don't fail if this errors — the file might already be gone)
  try {
    const path = imageUrl.split("/").pop();
    if (path) await supabase.storage.from("artworks").remove([path]);
  } catch {}

  revalidatePath(`/dashboard/artist/artworks/${artworkId}/edit`);
}
```

---

### Step C.2 — Verify Phase C

- [x] Edit page loads with all existing data pre-populated
- [x] All form fields can be edited and saved
- [x] Current images displayed with delete button
- [x] New images can be added to existing artwork
- [x] Creation steps can be added, edited, and removed
- [x] Certificate can be generated for published artwork
- [x] "Save Changes" persists to DB
- [x] Cancel returns to artwork list
- [x] `tsc --noEmit` passes

---

---

## Phase D: Artist Profile Edit

**Goal:** Artist can edit their public profile — bio, lineage, specializations, location, experience, awards, studio images.

**Time estimate:** 2 hours

**Prerequisites:** Read `src/lib/auth/artist-actions.ts`, `src/lib/validators/artist.ts`

---

### Step D.1 — Build artist profile edit page

**File: `src/app/dashboard/artist/profile/page.tsx`**

Replace the entire file. Client Component with React Hook Form or plain form:

```
FORM FIELDS:
  - Slug (Input, pre-filled, read-only after creation) — URL identifier
  - Bio (textarea, 2000 char max, show char count)
  - Lineage (Input, optional — "4th generation Karma Gadri tradition")
  - Specializations (multi-select chips from: Mandala, Deities, Life of Buddha, Landscape, Abstract, Other)
  - Experience Years (number input, optional, 0-80)
  - Location (Input, optional — "Boudha, Kathmandu")
  - Awards (dynamic list):
    - "Add Award" button
    - Each award: Title input + Year number input + Remove button
    - Stored as JSONB array: [{title: "...", year: 2024}]

  - Studio Images (file input, optional):
    - Show current studio images if any
    - Upload to Supabase Storage bucket "artists"
    - Need a server action for artist image upload (add to artist-actions.ts)

SAVE BUTTON:
  - GoldButton "Save Profile"
  - Calls updateArtistProfile(artistId, data)
  - Shows success toast or redirect
```

**New server action needed — upload artist image:**

Add to `src/lib/auth/artist-actions.ts`:

```ts
export async function uploadArtistImage(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const file = formData.get("file") as File;
  if (!file) return { error: "No file provided" };

  const ext = file.name.split(".").pop();
  const fileName = `${user.id}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("artists")
    .upload(fileName, file, { upsert: true });

  if (error) return { error: error.message };

  const { data: { publicUrl } } = supabase.storage
    .from("artists")
    .getPublicUrl(fileName);

  // Append to studio_images array
  const artist = await db.select().from(artists).where(eq(artists.id, user.id)).limit(1);
  const currentImages = artist[0]?.studioImages ?? [];
  await db.update(artists)
    .set({ studioImages: [...currentImages, publicUrl] })
    .where(eq(artists.id, user.id));

  revalidatePath("/dashboard/artist/profile");
  return { url: publicUrl };
}
```

---

### Step D.2 — Verify Phase D

- [x] Profile edit page loads with current artist data pre-populated
- [x] All fields can be edited and saved
- [x] Specializations display as selectable chips
- [x] Awards can be added/removed dynamically
- [x] Studio images can be uploaded
- [x] Save persists to DB
- [x] `tsc --noEmit` passes

---

---

## Phase E: Artist Dashboard Overview

**Goal:** Replace the stub artist dashboard page with a real overview showing stats (total artworks, published count, draft count, recent orders, total revenue).

**Time estimate:** 1.5 hours

**Prerequisites:** Phase B complete (artworks can be created)

---

### Step E.1 — Build artist dashboard overview

**File: `src/app/dashboard/artist/page.tsx`**

Replace the entire file. Server Component:

```
STATS CARDS (4 cards in a 2x2 or 4-col grid):
  - Total Artworks: count of all artworks by this artist
  - Published: count where status = 'available'
  - Drafts: count where status = 'draft'
  - Total Revenue: sum of totalNpr from orders where status = 'confirmed' (join through order_items)

RECENT ARTWORKS (list of last 5):
  - Same row/card style as artwork list page
  - Link to full artwork list

QUICK ACTIONS:
  - "Add New Artwork" button → /dashboard/artist/artworks/new
  - "Edit Profile" button → /dashboard/artist/profile
  - "View Public Profile" link → /artists/{artistSlug}

EMPTY STATE (if no artworks):
  - Welcome message
  - "Create Your First Artwork" CTA
```

**Data query approach:**
```ts
const artworks = await db.select().from(artworks).where(eq(artworks.artistId, user.id));
const totalArtworks = artworks.length;
const published = artworks.filter(a => a.status === "available").length;
const drafts = artworks.filter(a => a.status === "draft").length;

// Revenue: join orders → order_items → artworks by this artist
const revenueResult = await db
  .select({ total: sql<number>`COALESCE(SUM(${orderItems.priceNpr}), 0)` })
  .from(orderItems)
  .innerJoin(orders, eq(orderItems.orderId, orders.id))
  .innerJoin(artworks, eq(orderItems.artworkId, artworks.id))
  .where(and(
    eq(artworks.artistId, user.id),
    eq(orders.status, "confirmed")
  ));
```

---

### Step E.2 — Verify Phase E

- [x] Artist dashboard shows stats for their artworks
- [x] Revenue stat calculates correctly
- [x] Recent artworks list shown
- [x] Quick action buttons work
- [x] Empty state shows for new artists
- [x] `tsc --noEmit` passes

---

---

## Phase F: Bug Fixes & Server Action Hardening

**Goal:** Fix all known bugs in the existing code and harden server actions with proper auth checks.

**Time estimate:** 2 hours

**Prerequisites:** All previous phases complete

---

### Step F.1 — Fix `upgradeToArtist` to create artists row

**File: `src/lib/auth/artist-actions.ts`**

Current code only sets `profiles.role = 'artist'`. Fix:
```ts
export async function upgradeToArtist(userId: string) {
  // Check if artists row already exists
  const existing = await db.select().from(artists).where(eq(artists.id, userId)).limit(1);
  
  if (existing.length === 0) {
    // Get profile for name-based slug generation
    const [profile] = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1);
    const slug = generateSlug(profile.fullName);
    
    await db.insert(artists).values({
      id: userId,
      slug,
      bio: "",  // Artist will fill this in later via profile edit
      specialization: [],
      isVerified: false,
    });
  }
  
  await db.update(profiles)
    .set({ role: "artist" })
    .where(eq(profiles.id, userId));
  
  revalidatePath("/dashboard/admin/users");
}
```

Import `generateSlug` from `@/lib/utils/slug` and `artists` from `@/lib/db/schema`.

---

### Step F.2 — Fix fragile JSON parsing in `createArtistProfile`

**File: `src/lib/auth/artist-actions.ts`**

Current code: `JSON.parse(formData.get("specialization") as string)` — crashes on empty/null.

Fix with safe parsing:
```ts
let specialization: string[] = [];
try {
  const raw = formData.get("specialization") as string;
  specialization = raw ? JSON.parse(raw) : [];
} catch {
  specialization = [];
}
```

---

### Step F.3 — Add auth checks to all artwork server actions

**File: `src/lib/artwork-actions.ts`**

Currently only `createArtwork` checks auth. Add auth checks to:
- `updateArtwork` — verify the user owns this artwork (`artistId === user.id`) or is admin
- `uploadArtworkImage` — verify the user owns this artwork or is admin
- `addCreationStep` — same
- `generateCertificate` — same
- `publishArtwork` — same
- `deleteArtwork` — same

Pattern for each:
```ts
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
if (!user) throw new Error("Not authenticated");

// For actions that modify an existing artwork:
const artwork = await db.select().from(artworks).where(eq(artworks.id, artworkId)).limit(1);
if (artwork.length === 0) throw new Error("Artwork not found");

// Check ownership or admin
const [profile] = await db.select().from(profiles).where(eq(profiles.id, user.id)).limit(1);
if (artwork[0].artistId !== user.id && profile?.role !== "admin") {
  throw new Error("Not authorized");
}
```

---

### Step F.4 — Fix `createArtistProfile` to use `generateSlug`

**File: `src/lib/auth/artist-actions.ts`**

The form currently expects the user to manually enter a slug. Instead, auto-generate from the full name:
- Get the user's profile to read `fullName`
- Generate slug from fullName
- Don't require slug in the form

Or keep slug in the form but also allow auto-generation. Simpler: generate it server-side from the profile name, ignore whatever the user sends.

---

### Step F.5 — Fix Zod enum for status in `createArtwork`

**File: `src/lib/validators/artwork.ts`**

Current: `status: z.enum(["available", "draft"]).default("draft")`

The DB schema has `artwork_status` enum with values `['available', 'sold', 'reserved', 'draft']`. The validation should match:
```ts
status: z.enum(["available", "draft"]).default("draft"),
```

This is fine for creation (can't create as "sold" or "reserved"), but `updateArtwork` uses `.partial()` so it's fine there too. **No change needed** — just verification.

---

### Step F.6 — Verify Phase F

- [x] `upgradeToArtist` creates both profile role update AND artists row
- [x] `createArtistProfile` doesn't crash on empty specialization
- [x] All artwork server actions check auth + ownership
- [x] `tsc --noEmit` passes with no new errors

---

---

## Phase G: Filter & Search Polish

**Goal:** Wire up the broken filter sidebar price slider, add proper mobile filter support, fix the subject/deity naming confusion.

**Time estimate:** 2 hours

**Prerequisites:** Phase A-F complete

---

### Step G.1 — Wire price slider to URL params

**File: `src/components/marketplace/filter-sidebar.tsx`**

The `<Slider>` component is currently decorative. Wire it to update `price_min` and `price_max` URL params.

Implementation:
- Use state to track current slider values
- Add an "Apply" button or use `onValueCommit` (ShadCN Slider fires this on drag end)
- Push `price_min` and `price_max` to URL searchParams
- Also add text inputs for min/max for precision

```tsx
const [priceRange, setPriceRange] = useState([0, 500000]);

function applyPriceFilter(values: number[]) {
  const params = new URLSearchParams(searchParams.toString());
  if (values[0] > 0) params.set("price_min", String(values[0]));
  else params.delete("price_min");
  if (values[1] < 500000) params.set("price_max", String(values[1]));
  else params.delete("price_max");
  params.set("page", "1");
  router.push(`/marketplace?${params.toString()}`);
}
```

The marketplace page already reads `price_min` and `price_max` — no server-side changes needed.

---

### Step G.2 — Add mobile filter FAB and sheet

**File: `src/components/marketplace/filter-sidebar.tsx`** (add mobile variant)

Per the design system (section 6.9), mobile users should see a floating action button that opens the filter sidebar as a full-screen sheet or drawer.

Implementation:
- Add a FAB button visible only on mobile (`lg:hidden`):
  ```tsx
  <button className="fixed bottom-6 right-6 z-40 lg:hidden gold-leaf-button w-14 h-14 rounded-full flex items-center justify-center shadow-lg">
    <span className="material-symbols-outlined">tune</span>
  </button>
  ```
- Clicking the FAB opens the filters in a ShadCN Sheet (already installed)
- The existing FilterSidebar component renders inside the Sheet on mobile
- Close button in the Sheet header

**File: `src/components/marketplace/mobile-filter-sheet.tsx`** (new file, optional):

Or just wrap FilterSidebar in a Sheet directly in the marketplace page. Simpler approach:

In `src/app/(marketing)/marketplace/page.tsx`, add a mobile filter button that toggles a Sheet containing the FilterSidebar. This can be a client component wrapper.

---

### Step G.3 — Rename/map subject filter to be clear

The filter sidebar uses `subject` as the URL param key but the marketplace page filters by `deity` in the DB. These are different concepts.

**Fix:** Change the filter sidebar to use `deity` as the URL param key (matching the DB column), and update the label to "Subject / Deity":

In `filter-sidebar.tsx`:
- Change `updateFilter("subject", ...)` to `updateFilter("deity", ...)`
- Keep the section label as "Subject"

In `marketplace/page.tsx`:
- Change `params.subject` to `params.deity` in the filter reading logic

This is a simple search-and-replace across two files.

---

### Step G.4 — Read current price range from URL in slider

When the page loads with `?price_min=50000&price_max=200000`, the slider should reflect those values.

```tsx
const initialMin = Number(searchParams.get("price_min")) || 0;
const initialMax = Number(searchParams.get("price_max")) || 500000;
const [priceRange, setPriceRange] = useState([initialMin, initialMax]);
```

---

### Step G.5 — Verify Phase G

- [x] Price slider updates `price_min` and `price_max` in URL
- [x] Marketplace filters by price correctly
- [x] Slider reflects current URL params on page load
- [x] Mobile FAB button visible below lg breakpoint
- [x] FAB opens filter sidebar in a Sheet
- [x] Subject/deity naming is consistent
- [x] `tsc --noEmit` passes

---

---

## Phase H: Seed Data — 6 Artworks

**Goal:** Populate the database with 6 sample artworks across 4 artists so the marketplace isn't empty. This is critical for testing and demo.

**Time estimate:** 1 hour

**Prerequisites:** Phase A complete (artwork upload form working — seed data can also be created via the form)

---

### Step H.1 — Create artwork seed SQL

**File: `supabase/seed_artworks.sql`** (new file)

Create 6 artworks seeded across the 4 existing artists. Use placeholder image URLs (from Unsplash or solid color placeholders) that can be replaced later.

```sql
-- Artworks seed data
-- 6 artworks across 4 artists
-- Image URLs are placeholders — replace with Supabase Storage URLs after uploading actual images

INSERT INTO public.artworks (artist_id, slug, title, description, deity, style, medium, materials, dimensions_cm, price_npr, price_usd, year_created, images, status, is_verified) VALUES
(
  '65f688b7-169e-4b00-a6e0-946312ab1f45',  -- Master Tenzin
  'medicine-buddha-mandala',
  'Medicine Buddha Mandala',
  'A meticulously rendered Medicine Buddha (Bhaiṣajyaguru) mandala following the Karma Gadri tradition. The central deity sits in vajra posture upon a lotus throne, surrounded by an intricate palace of eight spokes and four gates. Each detail — from the lapis lazuli blue of the Buddha to the 24K gold leaf aureole — carries profound symbolic meaning. The thangka serves as both a meditation aid and a healing presence, traditionally commissioned for those seeking physical and spiritual well-being.',
  'Medicine Buddha',
  'Karma Gadri',
  'Mineral pigments and 24K gold on cotton canvas',
  ARRAY['24K Gold', 'Lapis Lazuli', 'Vermilion', 'Cotton Canvas'],
  '{"height": 76, "width": 54}',
  185000, 1380, 2024,
  ARRAY['https://images.unsplash.com/photo-1609766856920-7b3f07d9b2a9?w=800'],
  'available', true
),
(
  '65f688b7-169e-4b00-a6e0-946312ab1f45',  -- Master Tenzin
  'white-tara-compassion',
  'White Tara — The Compassionate Mother',
  'White Tara (Sitatārā) embodies the divine feminine principle of compassion and longevity. In this masterwork, she is depicted with seven eyes of wisdom — three on her serene face, one on each palm, and one on each sole — symbolizing her all-seeing awareness. The utpala lotus flowers framing her form represent purity rising from the mud of samsara. This painting was created during a three-month meditation retreat, with each brushstroke accompanied by the Tara mantra.',
  'White Tara',
  'Newari',
  'Mineral pigments and 24K gold on silk canvas',
  ARRAY['24K Gold', 'Mineral Pigments', 'Silk Canvas', 'Turquoise'],
  '{"height": 90, "width": 66}',
  245000, 1828, 2024,
  ARRAY['https://images.unsplash.com/photo-1580418827493-f2b22c0a76cd?w=800'],
  'available', true
),
(
  'c8271daf-e34e-40eb-9a36-2a1025312e3a',  -- Ani Choying
  'wheel-of-life-bhavacakra',
  'Wheel of Life — Bhavacakra',
  'The Bhavacakra, or Wheel of Life, is one of the most profound visual teachings in Tibetan Buddhism. This intricate painting depicts the six realms of existence — from the celestial deva realm to the torment of the hell realms — all held in the jaws of Yama, Lord of Death. At the center, the three poisons (pig, snake, rooster representing ignorance, anger, and attachment) drive the endless cycle of rebirth. Ani Choying brings a uniquely feminine sensitivity to this traditionally fierce imagery, softening the didactic elements while preserving their spiritual potency.',
  'Yama',
  'Tibetan',
  'Mineral pigments on cotton canvas',
  ARRAY['Mineral Pigments', 'Cotton Canvas', 'Indigo', 'Malachite'],
  '{"height": 100, "width": 72}',
  320000, 2388, 2023,
  ARRAY['https://images.unsplash.com/photo-1609602644879-909097b7fc7b?w=800'],
  'available', true
),
(
  'c8271daf-e34e-40eb-9a36-2a1025312e3a',  -- Ani Choying
  'life-of-buddha-panel',
  'Twelve Deeds of the Buddha',
  'A narrative panel depicting the twelve principal deeds of Shakyamuni Buddha, from his descent from Tushita heaven to his parinirvana. Each scene is framed within an architectural arch, creating a visual pilgrimage across the canvas. Ani Choying spent eight months researching the iconographic details at Kopan Monastery before beginning this work. The gold leaf was applied in the traditional cold-gold technique, burnished with agate to achieve its luminous quality.',
  'Shakyamuni Buddha',
  'Tibetan',
  'Mineral pigments and 24K gold on cotton canvas',
  ARRAY['24K Gold', 'Mineral Pigments', 'Cotton Canvas', 'Agate Burnish'],
  '{"height": 65, "width": 180}',
  420000, 3134, 2025,
  ARRAY['https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=800'],
  'available', true
),
(
  '7618b572-6aae-4190-8e05-eccd984da8df',  -- Lobsang R.
  'kalachakra-mandala',
  'Kalachakra Mandala — The Wheel of Time',
  'The Kalachakra Mandala is among the most complex and sacred of all Buddhist mandalas. This five-tiered palace contains 722 deities arranged in precise geometric harmony, each detail governed by ancient mathematical principles preserved in the Sanskrit Kalachakra Tantra. Lobsang spent four months on the under-drawing alone, using traditional measuring techniques with thread and charcoal. The mandala represents the outer cosmology of the universe, the inner workings of the subtle body, and the secret path to enlightenment — all encoded in sacred geometry.',
  'Kalachakra',
  'Karma Gadri',
  'Mineral pigments and crushed gemstones on cotton canvas',
  ARRAY['Crushed Coral', 'Lapis Lazuli', 'Malachite', '24K Gold', 'Cotton Canvas'],
  '{"height": 82, "width": 82}',
  520000, 3880, 2024,
  ARRAY['https://images.unsplash.com/photo-1518895949257-7621c3fb1b4e?w=800'],
  'available', true
),
(
  'b78f8e0f-369e-4cb1-b92a-3070e0510b45',  -- Karma S.
  'mahakala-protector',
  'Mahakala — The Great Black Protector',
  'Mahakala, the wrathful emanation of Avalokiteshvara, stands as the supreme protector of the Dharma. Karma S. brings a contemporary sensibility to this traditional subject — the flames that surround the deity are rendered in an almost abstract expressionist style, while the central figure remains strictly faithful to iconographic convention. The contrast between traditional restraint and modern expression creates a palpable tension that speaks to the living, evolving nature of Himalayan art. This piece was created using traditional mineral pigments, with the black background built up in seven layers to achieve its velvety depth.',
  'Mahakala',
  'Thangka',
  'Mineral pigments and 24K gold on cotton canvas',
  ARRAY['24K Gold', 'Mineral Pigments', 'Cotton Canvas', 'Indigo'],
  '{"height": 95, "width": 68}',
  280000, 2089, 2025,
  ARRAY['https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800'],
  'available', true
);

-- Artwork categories
INSERT INTO public.artwork_categories (artwork_id, category)
SELECT id, 'Deities' FROM public.artworks WHERE slug = 'medicine-buddha-mandala'
UNION ALL SELECT id, 'Mandala' FROM public.artworks WHERE slug = 'medicine-buddha-mandala'
UNION ALL SELECT id, 'Deities' FROM public.artworks WHERE slug = 'white-tara-compassion'
UNION ALL SELECT id, 'Deities' FROM public.artworks WHERE slug = 'wheel-of-life-bhavacakra'
UNION ALL SELECT id, 'Life of Buddha' FROM public.artworks WHERE slug = 'wheel-of-life-bhavacakra'
UNION ALL SELECT id, 'Life of Buddha' FROM public.artworks WHERE slug = 'life-of-buddha-panel'
UNION ALL SELECT id, 'Deities' FROM public.artworks WHERE slug = 'life-of-buddha-panel'
UNION ALL SELECT id, 'Mandala' FROM public.artworks WHERE slug = 'kalachakra-mandala'
UNION ALL SELECT id, 'Deities' FROM public.artworks WHERE slug = 'mahakala-protector'
UNION ALL SELECT id, 'Abstract' FROM public.artworks WHERE slug = 'mahakala-protector';

-- Certificates for all 6 artworks
INSERT INTO public.certificates (artwork_id, certificate_no, issued_date)
SELECT id, 'KA-2024-001', '2024-09-15' FROM public.artworks WHERE slug = 'medicine-buddha-mandala'
UNION ALL SELECT id, 'KA-2024-002', '2024-11-20' FROM public.artworks WHERE slug = 'white-tara-compassion'
UNION ALL SELECT id, 'KA-2023-003', '2023-06-10' FROM public.artworks WHERE slug = 'wheel-of-life-bhavacakra'
UNION ALL SELECT id, 'KA-2025-004', '2025-02-05' FROM public.artworks WHERE slug = 'life-of-buddha-panel'
UNION ALL SELECT id, 'KA-2024-005', '2024-08-01' FROM public.artworks WHERE slug = 'kalachakra-mandala'
UNION ALL SELECT id, 'KA-2025-006', '2025-04-18' FROM public.artworks WHERE slug = 'mahakala-protector';

-- Creation steps for selected artworks (optional but adds richness)
INSERT INTO public.creation_steps (artwork_id, step_number, title, description, duration_days)
SELECT id, 1, 'Sacred Geometry Grid', 'Drawing the precise geometric under-structure using traditional measuring techniques. Every deity and palace element is positioned according to the ancient iconometric canon.', 7 FROM public.artworks WHERE slug = 'kalachakra-mandala'
UNION ALL SELECT id, 2, 'Deity Outlines', 'Sketching all 722 deities in their proper positions within the mandala palace. Each figure follows precise proportional rules.', 21 FROM public.artworks WHERE slug = 'kalachakra-mandala'
UNION ALL SELECT id, 3, 'Base Color Application', 'Applying the first layers of mineral pigments — lapis lazuli blue for the background, cinnabar red for the fire perimeter, malachite green for the lotus petals.', 14 FROM public.artworks WHERE slug = 'kalachakra-mandala'
UNION ALL SELECT id, 4, 'Detail Work', 'Painting the intricate facial features, mudras, and attributes of each deity. This stage requires the steadiest hand and clearest mind.', 30 FROM public.artworks WHERE slug = 'kalachakra-mandala'
UNION ALL SELECT id, 5, 'Gold Leaf Application', 'Applying 24K gold leaf using the traditional cold-gold technique. Each gold surface is burnished with agate to achieve luminosity.', 10 FROM public.artworks WHERE slug = 'kalachakra-mandala'
UNION ALL SELECT id, 6, 'Final Blessing', 'Opening the eyes of the central deity and performing the consecration ceremony. The thangka is now a living sacred object.', 3 FROM public.artworks WHERE slug = 'kalachakra-mandala';
```

---

### Step H.2 — Run the seed

Execute the SQL in Supabase SQL Editor, or via:
```bash
psql "$DATABASE_URL" -f supabase/seed_artworks.sql
```

---

### Step H.3 — Verify Phase H

- [x] 6 artworks appear in the `artworks` table
- [x] Artwork categories are populated
- [x] Certificates are linked to artworks
- [x] Creation steps exist for Kalachakra Mandala
- [x] Marketplace page (`/marketplace`) shows 6 artworks
- [x] Each artwork detail page renders with full info
- [x] Artist profile pages show their respective artwork counts

---

---

## Phase I: Production Polish

**Goal:** Loading states, empty states, error handling, image optimization, responsive QA.

**Time estimate:** 3 hours

**Prerequisites:** All previous phases complete

---

### Step I.1 — Add loading skeletons for new pages

**Files to create:**
- `src/app/dashboard/artist/loading.tsx` — dashboard overview skeleton
- `src/app/dashboard/artist/artworks/loading.tsx` — already created in Phase B
- `src/app/dashboard/artist/artworks/new/loading.tsx` — minimal (form page doesn't need one, but add for consistency)

---

### Step I.2 — Add empty states

Verify all pages handle the empty case:
- Marketplace: already handled (grid just renders empty, but should show "No artworks found" message)
- Artist directory: handled (grid renders empty if no artists)
- Artist artworks list: handled (Phase B)
- Artist orders list: STUB page — add a basic empty state
- Customer orders list: check current state

**File: `src/app/(marketing)/marketplace/page.tsx`** — add empty state:
```tsx
{mapped.length === 0 ? (
  <div className="text-center py-20">
    <span className="material-symbols-outlined text-6xl text-on-surface-variant/20">search_off</span>
    <p className="text-body-lg text-on-surface-variant mt-4">No artworks match your search criteria</p>
    <Link href="/marketplace" className="text-primary hover:underline mt-2 inline-block">Clear all filters</Link>
  </div>
) : (
  <ArtGrid artworks={mapped} />
)}
```

---

### Step I.3 — Replace `<img>` with `next/image`

**Affected files:**
- `src/components/art/art-card.tsx` — primary image
- `src/app/(marketing)/marketplace/[slug]/page.tsx` — main image and thumbnails
- `src/components/artist/artist-card.tsx` — artist image

Pattern:
```tsx
import Image from "next/image";

<Image
  src={artwork.images[0]}
  alt={artwork.title}
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

For images that need known dimensions (not fill), set width/height directly.
For Supabase Storage images, add the domain to `next.config.ts`:
```ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};
```

---

### Step I.4 — ISR optimization for public pages

Replace `export const dynamic = "force-dynamic"` with ISR revalidation on pages that don't need real-time data:

**Pages to optimize:**
- `marketplace/page.tsx` → `export const revalidate = 60` (revalidate every 60 seconds)
- `artists/page.tsx` → `export const revalidate = 300` (5 minutes)
- `artists/[slug]/page.tsx` → `export const revalidate = 300`

Keep `force-dynamic` on:
- Dashboard pages (user-specific data)
- `marketplace/[slug]/page.tsx` (needs to reflect real-time status changes)

After switching to ISR, add `revalidatePath()` calls in all relevant server actions to trigger revalidation on mutations.

---

### Step I.5 — Responsive QA for new pages

Test all new pages at: 375px, 768px, 1024px, 1440px. Key checks:
- [x] No horizontal scroll
- [x] Form inputs are full-width on mobile
- [x] Artwork list cards stack vertically on mobile
- [x] Dashboard sidebar collapses or overlays on mobile (sidebar is 256px fixed — check mobile)
- [x] Touch targets are 44px+ on mobile

---

### Step I.6 — Verify Phase I

- [x] Loading skeletons visible during page transitions
- [x] Empty states show helpful messages, not blank screens
- [x] Error boundaries catch and display errors gracefully
- [x] `next/image` used on all artwork/artist images
- [x] ISR working on public pages
- [x] All pages responsive at all breakpoints
- [x] `tsc --noEmit` passes
- [x] `pnpm build` succeeds without warnings

---

---

## Phase J: Final Verification — End-to-End Test

**Goal:** Walk through the complete artist → marketplace flow and verify everything works.

**Time estimate:** 1 hour

**Prerequisites:** ALL previous phases complete

---

### Step J.1 — Full flow test checklist

Run through this exact sequence:

1. **Register as a new user** → should have role "client"
2. **Admin upgrades to artist** → via `/dashboard/admin/users` → sets role + creates artists row
3. **Login as artist** → redirected to artist dashboard with stats (0 artworks)
4. **Edit artist profile** → set bio, lineage, specializations, awards, upload studio images
5. **View public profile** → `/artists/{slug}` shows updated info
6. **Create artwork (Draft)** → fill all fields, upload 3 images, save as draft
7. **Verify draft** → appears in artwork list with "Draft" status
8. **Edit artwork** → change price, add creation steps, generate certificate
9. **Publish artwork** → status changes to "Available"
10. **View in marketplace** → artwork appears at `/marketplace`
11. **Filter/search** → find the artwork via search, filter by subject/deity
12. **View artwork detail** → images, materials, certificate, creation steps all render
13. **Create second artwork** → publish directly
14. **Artist dashboard stats** → reflect correct counts
15. **Delete artwork** → soft-deletes to draft, no longer visible in marketplace

---

### Step J.2 — Verify Phase J

- [x] Complete flow works without errors
- [x] All pages render dark theme correctly
- [x] No console errors in browser
- [x] `tsc --noEmit` passes
- [x] `pnpm build` succeeds

---

---

## Dependency Order

```
Phase A (Upload Form) ───┐
                          ├─► Phase C (Edit Page)
Phase B (Artwork List) ───┘       │
                                   │
Phase D (Profile Edit) ───────────┼─► Phase F (Bug Fixes) ─► Phase G (Filters)
                                   │                              │
Phase E (Dashboard Overview) ─────┘                              │
                                                                 │
Phase H (Seed Data) ─────────────────────────────────────────────┼─► Phase I (Polish)
                                                                 │       │
                                                                 └───────┼─► Phase J (E2E Test)
```

- **Phases A+B must be done before C** (edit page needs upload to exist, list page to navigate from)
- **Phase D is independent** — can be done in parallel with A+B
- **Phase E is independent** but benefits from having A+B done first
- **Phase F depends on A+B+C+D being complete** (fixes touch all those files)
- **Phase G depends on F** (filter fixes are in the same components)
- **Phase H can be done anytime** but is most useful after A is done (so form can also be tested)
- **Phase I must be last before E2E** (polish wraps everything)
- **Phase J is always last**

---

## File Count Summary

| Phase | Files Created | Files Modified | Key Output |
|---|---|---|---|
| A: Upload Form | 1 | 2 | Working artwork creation with image upload |
| B: Artwork List | 2 | 0 | Artist can see and manage their artworks |
| C: Edit Page | 1 | 1 | Full edit with images, steps, certificates |
| D: Profile Edit | 1 | 1 | Artist can edit their public profile |
| E: Dashboard | 1 | 0 | Artist overview with stats |
| F: Bug Fixes | 0 | 4 | All server actions hardened, bugs fixed |
| G: Filter Polish | 0 | 2 | Price slider wired, mobile FAB, naming fixed |
| H: Seed Data | 1 | 0 | 6 artworks with certs + creation steps |
| I: Production Polish | 2 | 6 | Loading states, next/image, ISR, responsive |
| J: E2E Test | 0 | 0 | Verification checklist |
| **Total** | **9 new** | **16 modified** | **Production-ready artist + marketplace** |

---

## Context Budgets Per Phase

| Phase | Files touched | Complexity | Can split into |
|---|---|---|---|
| A | 3 | HIGH — form is complex, image upload tricky | 2 sub-tasks (form UI, upload logic) |
| B | 2 | LOW — straightforward list page | — |
| C | 2 | HIGH — many sections, multiple server actions | 2 sub-tasks (edit form, creation steps) |
| D | 2 | MEDIUM — form with dynamic awards list | — |
| E | 1 | LOW — simple stats page | — |
| F | 4 | MEDIUM — careful edits to server actions | — |
| G | 2 | LOW — component wiring | — |
| H | 1 | LOW — SQL insert statements | — |
| I | 8 | MEDIUM — many small changes across files | — |
| J | 0 | LOW — manual testing | — |

---

## First Agent Prompt Template

When handing Phase A to an AI agent:

```
You are working on ThangkaHub, a premium marketplace for Nepali Thangka art.

Read these first:
1. docs/PROJECT_RULES.md
2. docs/DESIGN_SYSTEM.md (sections 2-4, 6.1-6.5)
3. docs/PROGRESSION-1.md
4. src/lib/db/schema.ts (artworks table)
5. src/lib/artwork-actions.ts (existing server actions)
6. src/lib/validators/artwork.ts (Zod schemas)

Your task: Phase A — Artwork Upload Form
From docs/progression-2/Marketplace-Artist-system-update-plan.md, execute Phase A steps A.1 through A.3.

Expected output:
- A working upload form at /dashboard/artist/artworks/new
- Artists can create artworks (draft or published)
- Images upload to Supabase Storage
- Form uses design system tokens and ShadCN components

Verify: Fill the form, publish an artwork, check it appears in the database.
```
