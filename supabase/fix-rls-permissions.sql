-- =============================================================================
-- FIX ADMIN PERMISSIONS & ROW LEVEL SECURITY (RLS) FOR PORTFOLIO CMS
-- =============================================================================
-- Copy and run this script in Supabase Dashboard -> SQL Editor -> New Query -> Run
-- This grants full access on all portfolio database tables.

-- 1. DATABASE TABLES PERMISSIONS (All in public schema)
DROP POLICY IF EXISTS "Allow authenticated full access on projects" ON public.projects;
DROP POLICY IF EXISTS "Allow full access on projects" ON public.projects;
CREATE POLICY "Allow full access on projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated full access on skills" ON public.skills;
DROP POLICY IF EXISTS "Allow full access on skills" ON public.skills;
CREATE POLICY "Allow full access on skills" ON public.skills FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated full access on experiences" ON public.experiences;
DROP POLICY IF EXISTS "Allow full access on experiences" ON public.experiences;
CREATE POLICY "Allow full access on experiences" ON public.experiences FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated full access on education" ON public.education;
DROP POLICY IF EXISTS "Allow full access on education" ON public.education;
CREATE POLICY "Allow full access on education" ON public.education FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated full access on services" ON public.services;
DROP POLICY IF EXISTS "Allow full access on services" ON public.services;
CREATE POLICY "Allow full access on services" ON public.services FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated full access on social_links" ON public.social_links;
DROP POLICY IF EXISTS "Allow full access on social_links" ON public.social_links;
CREATE POLICY "Allow full access on social_links" ON public.social_links FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated full access on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow full access on profiles" ON public.profiles;
CREATE POLICY "Allow full access on profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated full access on contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow full access on contact_messages" ON public.contact_messages;
CREATE POLICY "Allow full access on contact_messages" ON public.contact_messages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated full access on site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow full access on site_settings" ON public.site_settings;
CREATE POLICY "Allow full access on site_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- Ensure profiles has logo_url column if not present
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Ensure storage buckets exist and are public
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES 
  ('portfolio-media', 'portfolio-media', true, 15728640),
  ('portfolio-documents', 'portfolio-documents', true, 15728640)
ON CONFLICT (id) DO UPDATE SET public = true;
