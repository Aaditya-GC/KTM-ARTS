# Project Architectural Audit & Feature Recommendations

I have analyzed the structure, routing, codebase, and integrations of **Kathmandu Arts**. This audit details security vulnerabilities, code redundancies, styling details, and recommendations for features to build next.

---

## 1. Directory Structure & Architecture Overview

The project is built on a modern stack: **Next.js 16 (App Router)**, **Tailwind CSS 4**, **Drizzle ORM** with PostgreSQL, **Supabase Auth/Database**, and multi-payment integrations. 

### Key Findings on Structure
* **Separation of Concerns:** Good logical split between server-side operations (`src/lib/*-actions.ts`), UI rendering components (`src/components/`), and route configurations (`src/app/`).
* **Route Groups:** Well-structured route groupings. `(marketing)` handles public pages (Marketplace, Artists, Knowledge Hub), while `dashboard/` separates customer, artist, and admin features.
* **Orphaned Folders:** The project has two parallel database configuration folders: `src/db` (used for migrations and seeds) and `src/lib/db` (used for core application schema). This creates confusion.

---

## 2. Security & Logic Vulnerabilities (High Priority)

### ⚠️ Vulnerability 1: Paid Status Set Before Confirmation
* **File:** `src/lib/checkout-actions.ts` -> `createCheckoutOrder` (Line 26)
* **Vulnerability:** When a customer completes checkout using Stripe Elements (`src/app/checkout/payment/page.tsx`), the client initiates the order by calling `createCheckoutOrder` before Stripe confirms the payment. 
* **Business Impact:**
  1. The order is inserted in the database with `status: "paid"` immediately.
  2. The artwork items are updated to `status: "sold"`.
  3. If the user's credit card is declined or the user closes the window mid-transaction, **the database still marks the order as paid, and the unique artwork is permanently taken off the marketplace**. 
* **Fix:** Orders must be created as `status: "pending"`. The database status should update to `"paid"` and the artwork status to `"sold"` **only** when a successful payment confirmation is returned (either through the Stripe client resolver or a Stripe webhook).

### ⚠️ Vulnerability 2: Broken Stripe Currency (NPR vs USD)
* **File:** `src/lib/stripe-actions.ts` (Line 13) and `src/app/checkout/payment/page.tsx`
* **Vulnerability:** The Stripe Element checkout tries to process payments in Nepalese Rupees (`currency: "npr"`). **Stripe does not support NPR as a processing or presentment currency.** 
* **Business Impact:** Any attempt to perform a Stripe card transaction via the `/checkout` multi-step form will crash the page with a Stripe API error.
* **Fix:** Stripe payments must use a supported currency (e.g., `currency: "usd"`). If the customer is checking out internationally, you must convert the NPR total to USD before creating the Payment Intent, or use the database `priceUsd` field.

---

## 3. Code Redundancies & Duplication

### 🔄 The "Split Brain" Checkout System
There are two completely separate checkout interfaces in this codebase, which creates massive redundancy:
1. **Multi-Step Checkout (`src/app/checkout/*`):** Consists of Cart page, Shipping form, and a Stripe-only embedded card payment. It is currently broken for NPR and does not offer Khalti or eSewa.
2. **Dashboard Checkout (`src/app/dashboard/customer/checkout/page.tsx`):** A single-page checkout form that correctly implements a secure redirect-based flow for **Khalti**, **eSewa**, and **Stripe Checkout Sessions (USD)**.
* **Recommendation:** Delete the multi-step `src/app/checkout` routes or rewrite them to leverage the dashboard’s unified `initiateOrderPayment` logic. A single unified checkout at `/checkout` is much easier to maintain.

### 🔄 Duplicated Pricing/Formatting Helpers
* **File:** `formatNpr` is declared independently in 4 different files:
  1. `src/app/checkout/page.tsx`
  2. `src/app/checkout/payment/page.tsx`
  3. `src/app/dashboard/customer/checkout/page.tsx`
  4. `src/app/dashboard/artist/artworks/artwork-list-client.tsx`
* **Recommendation:** Create a formatting utility file at `src/lib/utils/format.ts`:
  ```typescript
  export function formatNpr(amount: number): string {
    return `NPR ${amount.toLocaleString("en-NP")}`;
  }
  export function formatUsd(amount: number): string {
    return `$${amount.toLocaleString("en-US")}`;
  }
  ```
  Import this function globally to remove code duplication.

### 🔄 Orphaned Drizzle Schema File
* **File:** `src/db/schema/reviews.ts`
* **Issue:** This file declares the `reviews` table. However, `drizzle.config.ts` is configured to read schema definitions *only* from `./src/lib/db/schema.ts`, where the reviews table was appended separately.
* **Recommendation:** Delete `src/db/schema/reviews.ts` to prevent migration conflicts.

---

## 4. Missing E-Commerce Features

For a production-ready artwork store, the following features are missing or incomplete:

### ✉️ 1. Transactional Emails (Resend Integration)
* **Status:** The `resend` package is installed in your dependencies, but it is never imported or used.
* **Feature Needed:** Add transactional email dispatchers:
  - **To Customer:** Order receipt with details, shipping tracking info.
  - **To Artist:** Notification when one of their unique paintings sells.
  - **To Admin:** Alert for custom commission requests.

### ⏱️ 2. Temporary Stock Reservation (Cart Lock)
* **Status:** Since Thangka paintings are high-value, one-of-a-kind original items, stock collision is a risk. Currently, an item is only marked sold *after* database insertion.
* **Feature Needed:** When a user goes to checkout, lock the items in their cart for **15–20 minutes** (status: `"reserved"`). If the payment fails or the checkout session expires, return the artwork status to `"available"` so others can purchase it.

### 🗺️ 3. Multi-Currency Display
* **Status:** The marketplace displays items exclusively in NPR. For international USD users, there is no currency switcher or local geo-detection.
* **Feature Needed:** Implement a currency switcher (NPR/USD) in the navbar. Display prices using `priceUsd` if USD is selected, and automatically route USD checkouts to Stripe and NPR checkouts to Khalti/eSewa.

### 📦 4. Order Management & Tracking
* **Status:** While customers have a "View My Orders" link, there is no shipment tracking or status updates.
* **Feature Needed:** Expand the Customer Dashboard so users can see whether their order status has transitioned from `paid` to `shipped` or `delivered`, including tracking links.

---

## 5. Summary of Actions Required

| Priority | Action Item | Target File | Impact |
| :--- | :--- | :--- | :--- |
| **CRITICAL** | Change order creation status to `pending`, and mark `paid`/`sold` only on successful payment callback. | `src/lib/checkout-actions.ts` | Prevents unpaid checkouts from stealing artwork stock. |
| **CRITICAL** | Convert NPR to USD or use USD schema prices for Stripe checkouts. | `src/lib/stripe-actions.ts` | Prevents Stripe checkout failures due to unsupported currency. |
| **HIGH** | Delete the broken `/checkout/payment` Elements page and redirect checkouts to the unified redirect-based system. | `src/app/checkout` | Consolidates Khalti, eSewa, and Stripe into one unified user interface. |
| **MEDIUM** | Remove duplicated `formatNpr` helper functions. | Multiple | Cleans code redundancy. |
| **MEDIUM** | Remove duplicate Drizzle schema file. | `src/db/schema/reviews.ts` | Prevents DB migration conflicts. |
| **LOW** | Configure Resend API to send transactional order receipt emails. | `src/lib/checkout-actions.ts` | Delivers order confirmation notifications. |
