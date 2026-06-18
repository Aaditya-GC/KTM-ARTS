# Kathmandu Arts — Manual Smoke-Test Checklist

Run through this checklist after any significant change. Mark each item as passed or failed.

---

## Auth Flow

- [ ] Register a new user → redirected to `/verify`
- [ ] Login with registered user → redirected to `/dashboard`
- [ ] Sign out from navbar UserMenu dropdown → redirected to `/`
- [ ] Protected route (`/dashboard`) redirects unauthenticated users to `/login`
- [ ] Login page redirects authenticated users to `/dashboard`

## Role-Based Access

- [ ] Client cannot access `/dashboard/admin/users` (redirects to `/dashboard`)
- [ ] Client cannot access `/dashboard/admin/artworks` (redirects to `/dashboard`)
- [ ] Client cannot access `/dashboard/admin/artists` (redirects to `/dashboard`)
- [ ] Client cannot access `/dashboard/artist` (redirects to `/dashboard`)
- [ ] Artist can access `/dashboard/artist`
- [ ] Admin can access `/dashboard/admin/users`

## Password Reset

- [ ] "Forgot password?" link visible on login page
- [ ] Submit email → "Check Your Email" success message
- [ ] Reset link → can set new password
- [ ] After reset, redirected to `/login?reset=success` with success banner

## Marketplace

- [ ] Landing page loads with 10 sections, 6 artworks, 4 artists, 6 articles
- [ ] `/marketplace` shows 6 seeded artworks
- [ ] Filter by deity → results update
- [ ] Price slider updates `price_min` and `price_max` in URL
- [ ] Mobile filter FAB visible below `lg` breakpoint
- [ ] Search bar debounces (300ms) before firing
- [ ] Each artwork detail page renders full description, materials, certificate
- [ ] Verify wishlist heart fills/empties without page navigation
- [ ] Verify selling out of wishlist heart button does not navigate to product page

## Cart & Checkout

- [ ] Add to cart → cart drawer shows item with correct price
- [ ] Update quantity/remove in cart drawer
- [ ] `/checkout` page shows cart items and order summary
- [ ] Submit empty checkout form → inline validation errors appear
- [ ] Submit invalid email → inline email error
- [ ] Submit valid form → proceeds to payment redirect (Khalti/eSewa/Stripe)
- [ ] Stripe payment uses `NEXT_PUBLIC_USD_EXCHANGE_RATE` env var
- [ ] eSewa uses `ESEWA_PAYMENT_URL` and `ESEWA_PRODUCT_CODE` env vars

## Wishlist

- [ ] Click heart on marketplace card → heart fills, toast "Added to wishlist"
- [ ] Heart does NOT navigate to product page (preventDefault works)
- [ ] Click heart again → heart empties, toast "Removed from wishlist"
- [ ] Wishlist page at `/dashboard/customer/wishlist` shows saved items
- [ ] Remove from wishlist page → item disappears

## Artist Dashboard

- [ ] Artist overview shows stats (total artworks, published, drafts, revenue)
- [ ] "Add New Artwork" button navigates to upload form
- [ ] Upload form creates artwork (draft or published)
- [ ] Images upload to Supabase Storage
- [ ] Artwork list shows all artworks with status badges
- [ ] Edit artwork → all fields pre-populated, changes save
- [ ] Publish draft → status changes to "available"
- [ ] Delete artwork → soft-deletes to draft
- [ ] Edit profile → bio, lineage, specializations save correctly
- [ ] Artist orders page shows orders received (if any)

## Admin Dashboard

- [ ] Admin overview loads with stats
- [ ] User management: view users, upgrade client to artist
- [ ] Artist approvals: verify, feature artists
- [ ] Artwork moderation: verify, remove

## Code Quality

- [ ] `tsc --noEmit` passes with zero errors
- [ ] `pnpm build` passes with zero errors, zero warnings
- [ ] No native `<img>` tags remain (all use `next/image`)
- [ ] All type imports use `@/types` barrel where applicable
- [ ] `src/db/` directory deleted
- [ ] `src/proxy.ts` and `src/lib/rate-limit.ts` deleted
- [ ] `<html>` tag has no hardcoded `dark` class

## Payments (Sandbox)

- [ ] Khalti: initiate → redirect to Khalti test page → verify → order confirmed
- [ ] eSewa: initiate → redirect to eSewa test page → verify → order confirmed
- [ ] Stripe: initiate → redirect to Stripe Checkout → webhook confirms order
- [ ] Stripe webhook: `stripe trigger checkout.session.completed` works locally
- [ ] Order confirmation email sent via Resend
- [ ] Artist sale notification email sent via Resend
- [ ] Commission acknowledgment email sent via Resend

## Responsive

- [ ] All pages render at 375px (no horizontal scroll)
- [ ] All pages render at 768px
- [ ] All pages render at 1440px
- [ ] Touch targets are 44px+ on mobile
