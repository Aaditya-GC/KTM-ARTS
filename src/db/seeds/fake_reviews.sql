-- Seed fake reviews for the /reviews page
-- Requires at least 6 artworks and 1 client profile in the database

DO $$
DECLARE
  user_id uuid;
  art_ids uuid[];
BEGIN
  -- Get the first client user
  SELECT id INTO user_id FROM profiles WHERE role = 'client' ORDER BY created_at LIMIT 1;

  -- Collect artwork IDs
  SELECT ARRAY_AGG(id ORDER BY created_at) INTO art_ids FROM artworks WHERE status = 'available' LIMIT 6;

  IF array_length(art_ids, 1) >= 6 AND user_id IS NOT NULL THEN
    INSERT INTO reviews (id, artwork_id, user_id, rating, title, body, created_at) VALUES
      (gen_random_uuid(), art_ids[1], user_id, 5, 'A Masterpiece Beyond Words',
       'The precision in the brushwork is astonishing. Every detail—from the delicate folds of the deities'' robes to the intricate mandala geometry—reflects generations of lineage training. This Thangka now holds a central place in my meditation room.',
       NOW() - INTERVAL '2 days'),

      (gen_random_uuid(), art_ids[2], user_id, 5, 'Exquisite Craftsmanship',
       'The gold leaf application is flawless, catching the morning light in a way that feels almost alive. I have collected Thangkas for over a decade, and this piece ranks among the finest in my collection. The Certificate of Heritage provides wonderful provenance.',
       NOW() - INTERVAL '5 days'),

      (gen_random_uuid(), art_ids[3], user_id, 4, 'Beautiful Addition to My Collection',
       'The colors are rich and the composition is balanced exactly as described. Shipping was carefully handled and the piece arrived without any issues. I only wish the inscription on the back was translated, but overall a wonderful acquisition.',
       NOW() - INTERVAL '1 day'),

      (gen_random_uuid(), art_ids[4], user_id, 5, 'Sacred Geometry at Its Finest',
       'As a longtime practitioner, I was looking for a mandala that truly captured the essence of the Kalachakra tradition. This painting does exactly that. The symmetry is perfect and the meditation experience with this piece has been deeply transformative.',
       NOW() - INTERVAL '12 days'),

      (gen_random_uuid(), art_ids[5], user_id, 4, 'Thoughtful Gift for a Friend',
       'I purchased this Thangka as a gift for a friend who recently discovered Tibetan Buddhism. The presentation was beautiful and my friend was deeply moved by the gesture. The quality exceeded my expectations at this price point.',
       NOW() - INTERVAL '3 days'),

      (gen_random_uuid(), art_ids[6], user_id, 3, 'Good Quality, Minor Delay',
       'The painting itself is beautiful—the pigments are vibrant and the iconography is accurate. However, the delivery took longer than expected and communication could have been more responsive. Still happy with the purchase overall.',
       NOW() - INTERVAL '8 days'),

      (gen_random_uuid(), art_ids[1], user_id, 5, 'Transcendent Beauty',
       'Seeing this Thangka in person is a completely different experience from the photographs. The depth of the mineral pigments and the subtle gradients in the sky create an almost three-dimensional effect. I find something new to appreciate every day.',
       NOW() - INTERVAL '15 days'),

      (gen_random_uuid(), art_ids[3], user_id, 4, 'Excellent Quality and Service',
       'From browsing to delivery, the experience was seamless. The artwork was meticulously packed with care. The Thangka itself is stunning—the artist''s hand is evident in every brushstroke. Will definitely be purchasing again.',
       NOW() - INTERVAL '20 days');
  END IF;
END $$;
