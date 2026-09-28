CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated, service_role;

CREATE POLICY "Users can read their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE TABLE public.journey_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text NOT NULL DEFAULT '',
  date_label text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  details text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.journey_entries TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.journey_entries TO authenticated;
GRANT ALL ON public.journey_entries TO service_role;
ALTER TABLE public.journey_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published journey entries are public"
ON public.journey_entries FOR SELECT TO anon, authenticated
USING (published OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins create journey entries"
ON public.journey_entries FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update journey entries"
ON public.journey_entries FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete journey entries"
ON public.journey_entries FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.media_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_type text NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  title text NOT NULL,
  caption text NOT NULL DEFAULT '',
  alt_text text NOT NULL DEFAULT '',
  storage_path text,
  external_url text,
  tags text[] NOT NULL DEFAULT '{}',
  date_label text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT false,
  is_profile_photo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (storage_path IS NOT NULL OR external_url IS NOT NULL)
);
GRANT SELECT ON public.media_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.media_items TO authenticated;
GRANT ALL ON public.media_items TO service_role;
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published media items are public"
ON public.media_items FOR SELECT TO anon, authenticated
USING (published OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins create media items"
ON public.media_items FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update media items"
ON public.media_items FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete media items"
ON public.media_items FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.site_content (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published site content is public"
ON public.site_content FOR SELECT TO anon, authenticated
USING (published OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins create site content"
ON public.site_content FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update site content"
ON public.site_content FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete site content"
ON public.site_content FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER journey_entries_set_updated_at BEFORE UPDATE ON public.journey_entries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER media_items_set_updated_at BEFORE UPDATE ON public.media_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER site_content_set_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX journey_entries_public_order_idx ON public.journey_entries (published, sort_order);
CREATE INDEX media_items_public_order_idx ON public.media_items (published, sort_order);
CREATE UNIQUE INDEX media_items_one_profile_idx ON public.media_items (is_profile_photo) WHERE is_profile_photo;

CREATE POLICY "Published album files are readable"
ON storage.objects FOR SELECT TO anon, authenticated
USING (
  bucket_id = 'journey-media'
  AND EXISTS (
    SELECT 1 FROM public.media_items
    WHERE media_items.storage_path = storage.objects.name
      AND (media_items.published OR public.has_role(auth.uid(), 'admin'))
  )
);
CREATE POLICY "Admins upload album files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'journey-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update album files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'journey-media' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'journey-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete album files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'journey-media' AND public.has_role(auth.uid(), 'admin'));