-- =============================================================================
-- FULL-STACK PERSONAL PORTFOLIO & CMS: DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- =============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. PROFILES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    headline TEXT NOT NULL,
    bio TEXT NOT NULL,
    career_focus TEXT,
    avatar_url TEXT,
    resume_url TEXT,
    location TEXT,
    email TEXT,
    phone TEXT,
    available_for_hire BOOLEAN DEFAULT true,
    years_experience INTEGER DEFAULT 4,
    completed_projects INTEGER DEFAULT 20,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 2. PROJECTS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Full Stack',
    technologies TEXT[] NOT NULL DEFAULT '{}',
    image_url TEXT NOT NULL,
    gallery_urls TEXT[] DEFAULT '{}',
    github_url TEXT,
    live_url TEXT,
    metrics JSONB,
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON public.projects(display_order);

-- =============================================================================
-- 3. SKILLS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT,
    description TEXT,
    proficiency INTEGER CHECK (proficiency >= 0 AND proficiency <= 100) DEFAULT 80,
    display_order INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_display_order ON public.skills(display_order);

-- =============================================================================
-- 4. EXPERIENCES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    location TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    currently_working BOOLEAN DEFAULT false,
    description TEXT NOT NULL,
    technologies TEXT[] DEFAULT '{}',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_experiences_display_order ON public.experiences(display_order);

-- =============================================================================
-- 5. EDUCATION TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    currently_studying BOOLEAN DEFAULT false,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_education_display_order ON public.education(display_order);

-- =============================================================================
-- 6. SERVICES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    features TEXT[] DEFAULT '{}',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_display_order ON public.services(display_order);

-- =============================================================================
-- 7. SOCIAL LINKS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 8. CONTACT MESSAGES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read ON public.contact_messages(is_read);

-- =============================================================================
-- 9. SITE SETTINGS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_title TEXT NOT NULL DEFAULT 'Portfolio & CMS',
    site_description TEXT NOT NULL DEFAULT 'Full-Stack Developer & AI Engineer Portfolio',
    keywords TEXT[] DEFAULT '{"Software Engineer", "Next.js", "AI/ML"}',
    og_image_url TEXT,
    theme_default TEXT DEFAULT 'dark',
    allow_contact_form BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES
CREATE POLICY "Allow public read access on profiles"
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Allow public read access on published projects"
    ON public.projects FOR SELECT
    USING (published = true OR auth.role() = 'authenticated');

CREATE POLICY "Allow public read access on skills"
    ON public.skills FOR SELECT USING (true);

CREATE POLICY "Allow public read access on experiences"
    ON public.experiences FOR SELECT USING (true);

CREATE POLICY "Allow public read access on education"
    ON public.education FOR SELECT USING (true);

CREATE POLICY "Allow public read access on active services"
    ON public.services FOR SELECT
    USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Allow public read access on active social links"
    ON public.social_links FOR SELECT
    USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Allow public read access on site settings"
    ON public.site_settings FOR SELECT USING (true);

-- CONTACT MESSAGES: Public can insert, only authenticated can read/update/delete
CREATE POLICY "Allow public insert on contact messages"
    ON public.contact_messages FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on contact messages"
    ON public.contact_messages FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- AUTHENTICATED ADMIN FULL ACCESS POLICIES
CREATE POLICY "Allow authenticated full access on profiles"
    ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on projects"
    ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on skills"
    ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on experiences"
    ON public.experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on education"
    ON public.education FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on services"
    ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on social links"
    ON public.social_links FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on site settings"
    ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =============================================================================
-- 11. SUPABASE STORAGE BUCKET POLICIES
-- =============================================================================
-- Insert storage buckets if not existing
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('portfolio-media', 'portfolio-media', true),
    ('portfolio-documents', 'portfolio-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access on buckets
CREATE POLICY "Public media access"
    ON storage.objects FOR SELECT
    USING (bucket_id IN ('portfolio-media', 'portfolio-documents'));

-- Authenticated upload access on buckets
CREATE POLICY "Admin media uploads"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id IN ('portfolio-media', 'portfolio-documents'));

CREATE POLICY "Admin media updates"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id IN ('portfolio-media', 'portfolio-documents'));

CREATE POLICY "Admin media deletes"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id IN ('portfolio-media', 'portfolio-documents'));
