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
  ARRAY['https://picsum.photos/seed/medicine-buddha/800/1000'],
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
  ARRAY['https://picsum.photos/seed/white-tara/800/1000'],
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
  ARRAY['https://picsum.photos/seed/wheel-of-life/800/1000'],
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
  ARRAY['https://picsum.photos/seed/buddha-panel/800/500'],
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
  ARRAY['https://picsum.photos/seed/kalachakra/800/800'],
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
  ARRAY['https://picsum.photos/seed/mahakala/800/1000'],
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
SELECT id, 'KA-2024-001', '2024-09-15'::date FROM public.artworks WHERE slug = 'medicine-buddha-mandala'
UNION ALL SELECT id, 'KA-2024-002', '2024-11-20'::date FROM public.artworks WHERE slug = 'white-tara-compassion'
UNION ALL SELECT id, 'KA-2023-003', '2023-06-10'::date FROM public.artworks WHERE slug = 'wheel-of-life-bhavacakra'
UNION ALL SELECT id, 'KA-2025-004', '2025-02-05'::date FROM public.artworks WHERE slug = 'life-of-buddha-panel'
UNION ALL SELECT id, 'KA-2024-005', '2024-08-01'::date FROM public.artworks WHERE slug = 'kalachakra-mandala'
UNION ALL SELECT id, 'KA-2025-006', '2025-04-18'::date FROM public.artworks WHERE slug = 'mahakala-protector';

-- Creation steps for Kalachakra Mandala
INSERT INTO public.creation_steps (artwork_id, step_number, title, description, duration_days)
SELECT id, 1, 'Sacred Geometry Grid', 'Drawing the precise geometric under-structure using traditional measuring techniques. Every deity and palace element is positioned according to the ancient iconometric canon.', 7 FROM public.artworks WHERE slug = 'kalachakra-mandala'
UNION ALL SELECT id, 2, 'Deity Outlines', 'Sketching all 722 deities in their proper positions within the mandala palace. Each figure follows precise proportional rules.', 21 FROM public.artworks WHERE slug = 'kalachakra-mandala'
UNION ALL SELECT id, 3, 'Base Color Application', 'Applying the first layers of mineral pigments — lapis lazuli blue for the background, cinnabar red for the fire perimeter, malachite green for the lotus petals.', 14 FROM public.artworks WHERE slug = 'kalachakra-mandala'
UNION ALL SELECT id, 4, 'Detail Work', 'Painting the intricate facial features, mudras, and attributes of each deity. This stage requires the steadiest hand and clearest mind.', 30 FROM public.artworks WHERE slug = 'kalachakra-mandala'
UNION ALL SELECT id, 5, 'Gold Leaf Application', 'Applying 24K gold leaf using the traditional cold-gold technique. Each gold surface is burnished with agate to achieve luminosity.', 10 FROM public.artworks WHERE slug = 'kalachakra-mandala'
UNION ALL SELECT id, 6, 'Final Blessing', 'Opening the eyes of the central deity and performing the consecration ceremony. The thangka is now a living sacred object.', 3 FROM public.artworks WHERE slug = 'kalachakra-mandala';
