-- Profiles
CREATE POLICY "profiles_read_all" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "profiles_admin_update_role" ON public.profiles
  FOR UPDATE USING (
    EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Artists
CREATE POLICY "artists_read_all" ON public.artists
  FOR SELECT USING (true);

CREATE POLICY "artists_update_own" ON public.artists
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "artists_insert_own" ON public.artists
  FOR INSERT WITH CHECK (id = auth.uid());

-- Artworks
CREATE POLICY "artworks_read_available" ON public.artworks
  FOR SELECT USING (status = 'available' OR status = 'reserved' OR status = 'sold');

CREATE POLICY "artworks_read_own_drafts" ON public.artworks
  FOR SELECT USING (artist_id = auth.uid());

CREATE POLICY "artworks_insert_artist" ON public.artworks
  FOR INSERT WITH CHECK (artist_id = auth.uid());

CREATE POLICY "artworks_update_own" ON public.artworks
  FOR UPDATE USING (artist_id = auth.uid());

-- Admin full access
CREATE POLICY "admin_all_artworks" ON public.artworks
  FOR ALL USING (
    EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "admin_all_profiles" ON public.profiles
  FOR ALL USING (
    EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "admin_all_artists" ON public.artists
  FOR ALL USING (
    EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "admin_all_orders" ON public.orders
  FOR ALL USING (
    EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "admin_all_certificates" ON public.certificates
  FOR ALL USING (
    EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "admin_all_creation_steps" ON public.creation_steps
  FOR ALL USING (
    EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Cart
CREATE POLICY "cart_own" ON public.cart_items
  FOR ALL USING (user_id = auth.uid());

-- Wishlist
CREATE POLICY "wishlist_own" ON public.wishlist_items
  FOR ALL USING (user_id = auth.uid());

-- Orders
CREATE POLICY "orders_read_customer" ON public.orders
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "orders_read_artist" ON public.orders
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM public.order_items oi
      JOIN public.artworks a ON oi.artwork_id = a.id
      WHERE oi.order_id = public.orders.id AND a.artist_id = auth.uid()
    )
  );
