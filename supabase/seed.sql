-- Seed data for development
-- Note: Replace UUIDs below with actual Supabase Auth user IDs from your dashboard

-- Admin profile
INSERT INTO public.profiles (id, role, full_name) VALUES
  ('9cd6b3a9-2c14-4aa1-99e0-a350f1007e8f', 'admin', 'Admin User');

-- Artists
INSERT INTO public.profiles (id, role, full_name) VALUES
  ('65f688b7-169e-4b00-a6e0-946312ab1f45', 'artist', 'Master Tenzin'),
  ('c8271daf-e34e-40eb-9a36-2a1025312e3a', 'artist', 'Ani Choying'),
  ('7618b572-6aae-4190-8e05-eccd984da8df', 'artist', 'Lobsang R.'),
  ('b78f8e0f-369e-4cb1-b92a-3070e0510b45', 'artist', 'Karma S.');

INSERT INTO public.artists (id, slug, bio, specialization, experience_years, location, is_verified, is_featured) VALUES
  ('65f688b7-169e-4b00-a6e0-946312ab1f45', 'master-tenzin', 'A 4th-generation thangka painter from the Karma Gadri tradition, Master Tenzin began his training at age 8 under his grandfather.', ARRAY['Mandala', 'Deities'], 35, 'Boudha, Kathmandu', true, true),
  ('c8271daf-e34e-40eb-9a36-2a1025312e3a', 'ani-choying', 'A Buddhist nun who discovered thangka painting as a form of moving meditation. Her works blend traditional iconography with subtle modernity.', ARRAY['Deities', 'Life of Buddha'], 20, 'Kopan Monastery, Kathmandu', true, true),
  ('7618b572-6aae-4190-8e05-eccd984da8df', 'lobsang-r', 'Specializing in the intricate geometric patterns of Tibetan Buddhist mandalas, Lobsang brings mathematical precision to sacred art.', ARRAY['Mandala', 'Abstract'], 25, 'Patan, Lalitpur', true, false),
  ('b78f8e0f-369e-4cb1-b92a-3070e0510b45', 'karma-s', 'A young master pushing boundaries while honoring tradition. Known for vibrant palette and contemporary compositions.', ARRAY['Landscape', 'Abstract', 'Deities'], 15, 'Thamel, Kathmandu', true, false);

-- Certificates (references artworks, inserted after artworks)
-- See migrations for the certificate records created alongside respective artworks
