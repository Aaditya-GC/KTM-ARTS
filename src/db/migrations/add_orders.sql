-- Migration: Add Stripe + guest checkout fields to orders
-- Run: psql $DATABASE_URL -f src/db/migrations/add_orders.sql

ALTER TABLE orders ALTER COLUMN customer_id DROP NOT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS currency text DEFAULT 'npr';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now() NOT NULL;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS price_at_purchase integer;
