-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('artworks', 'artworks', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('artists', 'artists', true);

-- Storage policies
CREATE POLICY "artworks_storage_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'artworks' AND auth.role() = 'authenticated');

CREATE POLICY "artworks_storage_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'artworks');

CREATE POLICY "artists_storage_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'artists' AND auth.role() = 'authenticated');

CREATE POLICY "artists_storage_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'artists');
