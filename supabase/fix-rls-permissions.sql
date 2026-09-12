-- =============================================================================
-- FIX ADMIN PERMISSIONS & ROW LEVEL SECURITY (RLS) FOR PORTFOLIO CMS
-- =============================================================================
-- Copy and run this script in Supabase Dashboard -> SQL Editor -> New Query -> Run
-- This allows delete, update, and insert mutations to succeed on all CMS tables.

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

