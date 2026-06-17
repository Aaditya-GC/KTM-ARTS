-- Migration: Add reviews table
-- Run: psql $DATABASE_URL -f src/db/migrations/add_reviews.sql

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id uuid NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for fetching reviews by artwork
CREATE INDEX IF NOT EXISTS idx_reviews_artwork_id ON reviews(artwork_id);

-- Unique constraint: one review per user per artwork
CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_unique_user_artwork ON reviews(user_id, artwork_id);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews
CREATE POLICY "Anyone can read reviews"
  ON reviews FOR SELECT
  USING (true);

-- Only authenticated users can insert their own review
CREATE POLICY "Users can insert own review"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own review
CREATE POLICY "Users can delete own review"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);
