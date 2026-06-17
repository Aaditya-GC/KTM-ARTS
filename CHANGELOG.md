# Changelog

All notable changes to KTM-ARTS are documented here.

---

## [Unreleased] — 2026-06-16

### 🐛 Bug Fixes

- **Security: Remove database detail disclosure in `review-actions.ts`**
  Raw database error messages were being forwarded to the client. Server actions now return sanitized, user-safe error messages instead of internal database details.

- **Fix `MarketplaceDropdown` hydration error in `marketplace-dropdown.tsx`**
  `useSearchParams()` requires a Suspense boundary in Next.js. The inner `MarketplaceDropdownContent` component (which reads search params) is now wrapped in `<Suspense>` with a static fallback button, preventing the hydration mismatch on initial page load.

### ✨ Improvements

- **Real-time UI sync in `reviews-section.tsx`**
  - Added `router.refresh()` call after a review is deleted so that the server component re-fetches updated data (new average rating, count) without a full page reload.
  - Added a `useEffect` that syncs local `reviews` state whenever `initialReviews` props are updated by the server, keeping the client list consistent after refreshes.

- **Trigger router refresh on successful review submission in `review-form.tsx`**
  After a review is posted successfully, `router.refresh()` is now called so the reviews list and aggregate rating update immediately without requiring a manual page reload.

### 🎨 Styling

- **Replace hardcoded color codes with Tailwind utility classes**
  All instances of raw hex/RGB color values were removed from the following files in favour of design-token-aligned Tailwind classes (e.g. `text-primary`, `text-outline`, `text-error`, `text-on-surface-variant`):
  - `src/components/reviews/star-rating.tsx`
  - `src/components/reviews/review-card.tsx`
  - `src/components/reviews/review-form.tsx`

### ✅ Verification

- Confirmed no TypeScript compilation errors across all modified components.

---

*Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).*
