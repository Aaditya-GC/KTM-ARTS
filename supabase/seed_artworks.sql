-- Artworks seed data
-- 7 artworks across 4 artists with real Supabase Storage image URLs
-- Artist IDs:
--   65f688b7 = Master Tenzin (Boudha, Kathmandu)
--   c8271daf = Ani Choying (Kopan Monastery, Kathmandu)
--   7618b572 = Lobsang R. (Patan, Lalitpur)
--   b78f8e0f = Karma S. (Thamel, Kathmandu)

INSERT INTO public.artworks (artist_id, slug, title, description, deity, style, medium, materials, dimensions_cm, price_npr, price_usd, year_created, images, status, is_verified) VALUES
(
  'b78f8e0f-369e-4cb1-b92a-3070e0510b45',  -- Karma S.
  'vajrasattva',
  'Vajrasattva',
  'Vajrasattva, whose name means Diamond Being, embodies the primordial purity that is the ground of all enlightened qualities — the stainless, luminous nature of mind itself. In this thangka, he sits in the vajra posture of meditation, his body white as a snow mountain at dawn, representing the complete purification of all obscurations, karmic imprints, and habitual patterns. In his right hand he holds a golden vajra scepter at his heart, symbolizing the indestructible nature of awakened mind and the masculine principle of skillful means. In his left, resting in his lap, he holds a silver bell whose hollow sound represents the feminine principle of emptiness — together, vajra and bell express the non-dual union of wisdom and compassion. His ornaments of gold and precious jewels signify the six perfections, while his silk robes in blue and green evoke the boundlessness of sky and the vitality of the living earth, framing the deity with a quiet radiance rather than the fierce flames of wrathful forms. Karma S., a younger artist working from his studio in Thamel, brings a restrained elegance to this depiction — the composition is spacious, allowing the white form of Vajrasattva to float against a deep indigo background that evokes the boundless expanse of dharmadhatu. The artist trained at the Kathmandu University Center for Art and Design before dedicating himself to traditional Thangka, and his work reflects a rare ability to balance canonical precision with a distinctly contemporary aesthetic sensibility. The mantra of Vajrasattva, the hundred-syllable purification mantra, is among the most widely recited in Vajrayana Buddhism, and a thangka such as this serves as a focal point for purification practice — a mirror for the practitioner''s own innate purity.',
  'Vajrasattva',
  'Thangka',
  'Mineral pigments on cotton canvas',
  ARRAY['Mineral Pigments', 'Cotton Canvas', 'Indigo'],
  '{"height": 60, "width": 45}',
  100000, 1000, 2026,
  ARRAY['https://ggaafzakmfyucyhxqcch.supabase.co/storage/v1/object/public/artworks/vajrasattva.jpg'],
  'available', true
),
(
  'b78f8e0f-369e-4cb1-b92a-3070e0510b45',  -- Karma S.
  'twelve-deeds-of-buddha-shakyamuni',
  'Twelve Deeds of Buddha Shakyamuni',
  'This narrative Thangka traces the twelve principal deeds of Shakyamuni Buddha — the complete arc of an enlightened being''s manifestation in our world, from descent to parinirvana. Reading from the upper registers downward, the composition opens with the Buddha''s descent from Tushita heaven as the bodhisattva Shvetaketu, continuing through his miraculous conception and birth from Queen Maya in the gardens of Lumbini. The middle register depicts his youth as Prince Siddhartha within the palace walls of Kapilavastu, his fateful four encounters with old age, sickness, death, and a wandering ascetic, and his great renunciation when he abandoned royal life beneath the moonlight. The narrative reaches its dramatic center with his six years of ascetic practice on the banks of the Niranjana River, his defeat of Mara''s armies at Bodhgaya, and his awakening at dawn as the morning star rose. The lower panels portray his first teaching at the Deer Park in Sarnath — the turning of the Wheel of Dharma — followed by forty-five years of teaching across the Gangetic plain, and finally his parinirvana at Kushinagar, lying on his right side between two sal trees that blossomed out of season. This painting follows the Tibetan narrative tradition in which each scene is framed as an individual panel within a larger architectural grid, creating the effect of reading a sacred manuscript in visual form. Karma S. spent five months on this piece, consulting the Lalitavistara Sutra to ensure textual accuracy in every detail — each mudra, each attendant, and each architectural element is drawn from canonical descriptions rather than artistic convention.',
  'Shakyamuni Buddha',
  'Tibetan',
  'Mineral pigments on cotton canvas',
  ARRAY['Mineral Pigments', 'Cotton Canvas'],
  '{"height": 65, "width": 180}',
  280000, 3000, 2025,
  ARRAY['https://ggaafzakmfyucyhxqcch.supabase.co/storage/v1/object/public/artworks/buddha-shakyamuni.jpg'],
  'available', true
),
(
  '7618b572-6aae-4190-8e05-eccd984da8df',  -- Lobsang R.
  'the-refuge-tree-field-of-merit',
  'The Refuge Tree / Field of Merit',
  'The Refuge Tree, known in Tibetan as Tsogshing or the Field of Merit, is among the most theologically complex compositions in Himalayan Buddhist art — a single painting that encompasses the entirety of the Buddhist path, from the foundational vows of individual liberation to the subtlest teachings of Dzogchen. At the center of this visualization sits the root guru, inseparable from Shakyamuni Buddha, seated on a lion throne supported by eight snow lions representing the eight great bodhisattvas. Radiating outward in symmetrical branches, the tree holds the entire assembly of refuge objects: the lineage gurus of the transmission rising along the central axis, the meditation deities (yidams) in their celestial palaces, the thousand buddhas of the fortunate eon, the bodhisattvas and arhats, the dakas and dakinis of the tantric mandalas, and the dharma protectors guarding the outer perimeter. Below, at the base of the great wish-fulfilling tree, practitioners make offerings to the entire assembly, embodying the student who enters the mandala of refuge. Lobsang R., working from his studio in Patan, devoted nearly six months to this piece — the under-drawing alone required three weeks of precise measurement using the traditional charcoal-thread technique, and the gold detailing in the central figure''s robes and lotus petals required the application of 24K gold using the ser-thang burnishing method. Lobsang trained for twenty-five years under masters of the Gadri tradition, and his command of miniature detail — visible in the facial expressions of even the smallest lineage figures — distinguishes him as one of the most technically accomplished Thangka painters working in the Kathmandu Valley today.',
  'Shakyamuni Buddha',
  'Karma Gadri',
  'Mineral pigments and 24K gold on cotton canvas',
  ARRAY['24K Gold', 'Mineral Pigments', 'Cotton Canvas'],
  '{"height": 95, "width": 72}',
  500000, 5000, 2025,
  ARRAY['https://ggaafzakmfyucyhxqcch.supabase.co/storage/v1/object/public/artworks/refuge-tree.jpg'],
  'available', true
),
(
  '65f688b7-169e-4b00-a6e0-946312ab1f45',  -- Master Tenzin
  'guru-rinpoche-padmasambhava',
  'Guru Rinpoche (Padmasambhava)',
  'Guru Rinpoche, the Precious Master Padmasambhava, is the lotus-born tantric master who established Buddhism in Tibet during the eighth century — a figure whose spiritual stature in the Himalayan world is second only to the Buddha himself. In this commanding portrait, he sits in the royal ease posture on a moon disc above a blossoming lotus throne, his right hand holding the vajra scepter of indestructible awareness, his left cradling the skull cup of immortality from which rises a vase of long life. Nestled in the crook of his left arm rests the khatvanga trident, its three prongs piercing the three poisons of ignorance, attachment, and aversion — a symbol of his mastery over the entirety of cyclic existence. He wears the distinctive lotus hat with its vulture feather, the brocade robes of a pandit, and the cloak of a tantric yogi, each garment encoding a layer of his identity as scholar, meditator, and realized being. His gaze is direct, not softened — Guru Rinpoche is not merely to be admired but to be engaged with. Master Tenzin, who spent fifteen years training at Sera Monastery before establishing his studio in Boudha, is renowned throughout the Kathmandu Valley for his portraits of Guru Rinpoche. He approaches each depiction as a meditation practice, reciting the Seven Line Prayer with each session, and his portraits carry a quality of living presence that collectors describe as unmistakable. The gold used in the deity''s ornaments and the intricate brocade patterns was applied in the cold-gold technique — genuine 24K sheets pounded thin and adhered with hide glue, then burnished with agate to a luminous warmth that seems to radiate from within.',
  'Guru Rinpoche',
  'Tibetan',
  'Mineral pigments and 24K gold on cotton canvas',
  ARRAY['24K Gold', 'Mineral Pigments', 'Cotton Canvas'],
  '{"height": 75, "width": 55}',
  300000, 5000, 2025,
  ARRAY['https://ggaafzakmfyucyhxqcch.supabase.co/storage/v1/object/public/artworks/guru-rinpoche.jpg'],
  'available', true
),
(
  'c8271daf-e34e-40eb-9a36-2a1025312e3a',  -- Ani Choying
  'green-tara-with-21-taras',
  'Green Tara with 21 Taras',
  'Green Tara, Syamatara, is the swift and fearless mother of all buddhas — the feminine embodiment of enlightened activity who responds to the suffering of beings with the immediacy of a mother reaching for her child. In this extraordinary composition, the central Green Tara is surrounded by the twenty-one forms of Tara described in the ancient praises, each a distinct emanation that protects against a specific fear: lions, elephants, fire, snakes, thieves, false imprisonment, and the deeper terrors of ignorance, pride, and despair. The central figure sits in the posture of royal ease, her right leg extended — ready to rise the instant a being calls for her — while her left hand holds the stem of an utpala lotus whose three simultaneous blooms represent the buddhas of the past, the dharma of the present, and the sangha of the future. Her green body, the color of a forest at dawn, signifies her youthful energy and swift action; she is the wind that arrives before the prayer is finished. Ani Choying, who trained as a monastic for six years before becoming a Thangka painter, brings a practitioner''s intimacy to this depiction — each of the twenty-one Taras is painted with the same devotional care as the central figure, and the artist has inscribed the corresponding verse of the praise in fine gold script beneath each emanation. Working from her studio at Kopan Monastery, she spent over four months on this piece, rising before dawn each day to paint during the hours she considers most conducive to transmission. The malachite used for the central figure''s body was ground from stones she collected herself from the hills above Pharping, a site sacred to Tara, while the gold for the ornaments and mantras was offered by practitioners who had commissioned the piece as a collective act of merit.',
  'Green Tara',
  'Tibetan',
  'Mineral pigments and 24K gold on cotton canvas',
  ARRAY['24K Gold', 'Mineral Pigments', 'Cotton Canvas', 'Malachite'],
  '{"height": 90, "width": 66}',
  320000, 2388, 2023,
  ARRAY['https://ggaafzakmfyucyhxqcch.supabase.co/storage/v1/object/public/artworks/green-tara.jpg'],
  'available', true
),
(
  'c8271daf-e34e-40eb-9a36-2a1025312e3a',  -- Ani Choying
  'buddha-amitabha-in-sukhavati',
  'Buddha Amitabha in Sukhavati',
  'Buddha Amitabha, Opagme in Tibetan, the Buddha of Infinite Light, presides over Sukhavati — the Western Pure Land of Great Bliss — a realm created through the power of his vows to provide the ideal conditions for enlightenment. In this serene composition, Amitabha sits in the diamond posture upon a thousand-petaled lotus throne, his hands resting in the mudra of meditation, palms upturned in his lap, while his body glows a deep ruby red, the color of the setting sun that guides beings to his western paradise. He is flanked by his two principal bodhisattvas: Avalokiteshvara, white as moonlight, the embodiment of universal compassion, to his right, and Vajrapani, dark blue, the embodiment of spiritual power, to his left. Above them, the heavenly palace rises in tiered roofs of gold and lapis, while below, the waters of the lotus pool reflect the peacocks, cranes, and celestial musicians who inhabit this realm where the dharma is taught in the song of every bird and the whisper of every breeze. In the Pure Land traditions of Himalayan Buddhism, meditating on Amitabha and visualizing Sukhavati is a complete path to liberation, and this Thangka serves as both a meditation support and an object of refuge. Ani Choying, working from her studio at Kopan Monastery, painted this piece during the monsoon months of 2025, a period she dedicates each year to Amitabha practice. Her approach to Sukhavati compositions is informed by her study of 16th-century murals preserved in the monasteries of Mustang, and her treatment of the celestial architecture — each roof tile and jeweled finial rendered in minute detail — reveals the influence of those ancient masters while remaining unmistakably her own.',
  'Buddha Amitabha',
  'Tibetan',
  'Mineral pigments and 24K gold on cotton canvas',
  ARRAY['24K Gold', 'Mineral Pigments', 'Cotton Canvas'],
  '{"height": 70, "width": 50}',
  200000, 2000, 2025,
  ARRAY['https://ggaafzakmfyucyhxqcch.supabase.co/storage/v1/object/public/artworks/buddha-amitabva.jpg'],
  'available', true
),
(
  '65f688b7-169e-4b00-a6e0-946312ab1f45',  -- Master Tenzin
  'the-kalachakra-mandala',
  'The Kalachakra Mandala',
  'The Kalachakra Mandala, the Palace of the Wheel of Time, stands as the summit of Himalayan sacred geometry — a cosmological diagram of such structural complexity and philosophical depth that it has no parallel in any other artistic tradition. This five-tiered palace, rendered in perfect radial symmetry, simultaneously maps three interlocking dimensions of reality: the outer Kalachakra of celestial bodies, the inner Kalachakra of the subtle energy channels, and the secret Kalachakra of enlightened consciousness. The square palace, with its four elaborate gates and five concentric walls, contains 722 deities positioned according to the ancient iconometric canon preserved in the Kalachakra Tantra — every figure, every lotus petal, and every geometric element is precisely calculated so that the act of painting becomes a form of mathematical meditation. The outer ring of elemental mandalas in five cosmic colors is enclosed by the ring of vajra diamonds, representing the indestructible wisdom that protects the sacred space. Beyond this, 48 flames in layered hues of gold, vermilion, and crimson form the wisdom fire that incinerates conceptual obscuration. At the very center, Kalachakra in union with his consort Vishvamata — deity and consort in yab-yum, dark blue and golden, representing the inseparable union of emptiness and form that is the ultimate nature of reality. Master Tenzin, acknowledged across the Kathmandu Valley as one of the finest mandala painters of his generation, trained for fifteen years at Sera Monastery where he was initiated into the Kalachakra tradition at the age of twenty-three. The under-drawing alone required six weeks of preparatory measurement using calibrated bamboo sticks and charcoal-thread grids following the precise proportional system that has been handed down unchanged since the 11th century.',
  'Kalachakra',
  'Karma Gadri',
  'Mineral pigments and crushed gemstones on cotton canvas',
  ARRAY['Crushed Coral', 'Lapis Lazuli', 'Malachite', '24K Gold', 'Cotton Canvas'],
  '{"height": 82, "width": 82}',
  450000, 4500, 2025,
  ARRAY['https://ggaafzakmfyucyhxqcch.supabase.co/storage/v1/object/public/artworks/kalachakra-mandala.jpg'],
  'available', true
)
ON CONFLICT (slug) DO UPDATE SET
  artist_id = EXCLUDED.artist_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  deity = EXCLUDED.deity,
  style = EXCLUDED.style,
  medium = EXCLUDED.medium,
  materials = EXCLUDED.materials,
  dimensions_cm = EXCLUDED.dimensions_cm,
  price_npr = EXCLUDED.price_npr,
  price_usd = EXCLUDED.price_usd,
  year_created = EXCLUDED.year_created,
  images = EXCLUDED.images,
  status = EXCLUDED.status,
  is_verified = EXCLUDED.is_verified;

-- Artwork categories (idempotent — skips duplicates)
INSERT INTO public.artwork_categories (artwork_id, category)
SELECT id, 'Deities' FROM public.artworks WHERE slug = 'vajrasattva'
UNION ALL SELECT id, 'Life of Buddha' FROM public.artworks WHERE slug = 'twelve-deeds-of-buddha-shakyamuni'
UNION ALL SELECT id, 'Deities' FROM public.artworks WHERE slug = 'the-refuge-tree-field-of-merit'
UNION ALL SELECT id, 'Deities' FROM public.artworks WHERE slug = 'guru-rinpoche-padmasambhava'
UNION ALL SELECT id, 'Deities' FROM public.artworks WHERE slug = 'green-tara-with-21-taras'
UNION ALL SELECT id, 'Deities' FROM public.artworks WHERE slug = 'buddha-amitabha-in-sukhavati'
UNION ALL SELECT id, 'Mandala' FROM public.artworks WHERE slug = 'the-kalachakra-mandala'
UNION ALL SELECT id, 'Deities' FROM public.artworks WHERE slug = 'the-kalachakra-mandala'
ON CONFLICT (artwork_id, category) DO NOTHING;

-- Certificates (idempotent — skips duplicates)
INSERT INTO public.certificates (artwork_id, certificate_no, issued_date)
SELECT id, 'KA-2026-001', '2026-03-15'::date FROM public.artworks WHERE slug = 'vajrasattva'
UNION ALL SELECT id, 'KA-2025-002', '2025-01-20'::date FROM public.artworks WHERE slug = 'twelve-deeds-of-buddha-shakyamuni'
UNION ALL SELECT id, 'KA-2025-003', '2025-04-10'::date FROM public.artworks WHERE slug = 'the-refuge-tree-field-of-merit'
UNION ALL SELECT id, 'KA-2025-004', '2025-06-05'::date FROM public.artworks WHERE slug = 'guru-rinpoche-padmasambhava'
UNION ALL SELECT id, 'KA-2023-005', '2023-11-01'::date FROM public.artworks WHERE slug = 'green-tara-with-21-taras'
UNION ALL SELECT id, 'KA-2025-006', '2025-08-12'::date FROM public.artworks WHERE slug = 'buddha-amitabha-in-sukhavati'
UNION ALL SELECT id, 'KA-2025-007', '2025-09-18'::date FROM public.artworks WHERE slug = 'the-kalachakra-mandala'
ON CONFLICT (artwork_id) DO UPDATE SET
  certificate_no = EXCLUDED.certificate_no,
  issued_date = EXCLUDED.issued_date;

-- Creation steps for The Kalachakra Mandala (idempotent — clears existing before insert)
DELETE FROM public.creation_steps WHERE artwork_id = (SELECT id FROM public.artworks WHERE slug = 'the-kalachakra-mandala');

INSERT INTO public.creation_steps (artwork_id, step_number, title, description, duration_days)
SELECT id, 1, 'Sacred Geometry Grid', 'Drawing the precise geometric under-structure using traditional measuring techniques. Every deity and palace element is positioned according to the ancient iconometric canon.', 7 FROM public.artworks WHERE slug = 'the-kalachakra-mandala'
UNION ALL SELECT id, 2, 'Deity Outlines', 'Sketching all 722 deities in their proper positions within the mandala palace. Each figure follows precise proportional rules.', 21 FROM public.artworks WHERE slug = 'the-kalachakra-mandala'
UNION ALL SELECT id, 3, 'Base Color Application', 'Applying the first layers of mineral pigments -- lapis lazuli blue for the background, cinnabar red for the fire perimeter, malachite green for the lotus petals.', 14 FROM public.artworks WHERE slug = 'the-kalachakra-mandala'
UNION ALL SELECT id, 4, 'Detail Work', 'Painting the intricate facial features, mudras, and attributes of each deity. This stage requires the steadiest hand and clearest mind.', 30 FROM public.artworks WHERE slug = 'the-kalachakra-mandala'
UNION ALL SELECT id, 5, 'Gold Leaf Application', 'Applying 24K gold leaf using the traditional cold-gold technique. Each gold surface is burnished with agate to achieve luminosity.', 10 FROM public.artworks WHERE slug = 'the-kalachakra-mandala'
UNION ALL SELECT id, 6, 'Final Blessing', 'Opening the eyes of the central deity and performing the consecration ceremony. The thangka is now a living sacred object.', 3 FROM public.artworks WHERE slug = 'the-kalachakra-mandala';
