-- =============================================================================
-- FULL-STACK PERSONAL PORTFOLIO & CMS: SEED DATA
-- =============================================================================

-- Clear existing data if resetting
TRUNCATE TABLE 
    public.profiles,
    public.projects,
    public.skills,
    public.experiences,
    public.education,
    public.services,
    public.social_links,
    public.contact_messages,
    public.site_settings
CASCADE;

-- 1. Profile
INSERT INTO public.profiles (
    full_name,
    headline,
    bio,
    career_focus,
    avatar_url,
    resume_url,
    location,
    email,
    phone,
    available_for_hire,
    years_experience,
    completed_projects
) VALUES (
    'Abdullah',
    'Full-Stack Software Engineer & AI Systems Architect',
    'Experienced full-stack engineer specializing in modern web architecture, distributed systems, and generative AI integrations. Passionate about engineering high-performance user interfaces, reliable APIs, and production-grade RAG and machine learning workflows.',
    'Scalable Web Platforms & Intelligent AI Applications',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    '#',
    'Islamabad, Pakistan / Remote',
    'contact@abdullah.dev',
    '+92 300 1234567',
    true,
    4,
    24
);

-- 2. Projects
INSERT INTO public.projects (
    title,
    slug,
    short_description,
    full_description,
    category,
    technologies,
    image_url,
    gallery_urls,
    github_url,
    live_url,
    metrics,
    featured,
    published,
    display_order
) VALUES 
(
    'AI Research Assistant',
    'ai-research-assistant',
    'Enterprise research copilot featuring contextual vector search, semantic document synthesis, and hybrid retrieval-augmented generation.',
    'A high-throughput research assistant built with Next.js, FastAPI, Qdrant vector database, and LangChain. It allows researchers to upload multi-gigabyte corpus libraries, ask natural language queries, and receive sourced answers with citations down to individual page numbers. Designed with sub-second vector search latency, stream-rendered LLM responses, and multi-tenant security.',
    'AI/ML',
    ARRAY['Next.js', 'TypeScript', 'FastAPI', 'Python', 'Qdrant', 'OpenAI', 'Tailwind CSS'],
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    ARRAY['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80'],
    'https://github.com',
    'https://demo.example.com',
    '{"Vector Search Latency": "< 45ms", "Retrieval Accuracy": "94.2%", "Documents Indexed": "120,000+"}'::jsonb,
    true,
    true,
    1
),
(
    'Real-Time Object Detection & Tracking',
    'object-detection-system',
    'Edge-optimized computer vision pipeline with real-time multi-camera tracking, spatial anomaly alerts, and WebRTC streaming.',
    'High-precision computer vision pipeline built with YOLOv8, PyTorch, and TensorRT, streamed directly to a Next.js dashboard using low-latency WebRTC. Features multi-camera spatial tracking, zone occupancy telemetry, and automated incident alerts sent to cloud data stores.',
    'Computer Vision',
    ARRAY['PyTorch', 'YOLOv8', 'WebRTC', 'TensorRT', 'Next.js', 'Docker'],
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    ARRAY['https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'],
    'https://github.com',
    NULL,
    '{"Frame Rate": "60 FPS Edge", "Mean Average Precision": "88.6 mAP", "Inference Delay": "14ms"}'::jsonb,
    true,
    true,
    2
),
(
    'Cloud Native Distributed Task Engine',
    'distributed-task-engine',
    'Resilient background job processing orchestrator with automatic partition recovery, real-time telemetry, and rate limiting.',
    'Engineered a distributed workflow and queue management platform in Go and Node.js. Built for high-throughput background processing with Redis cluster coordination, guaranteed at-least-once execution semantics, and live Prometheus/Grafana observability.',
    'Backend',
    ARRAY['Go', 'Node.js', 'Redis', 'Docker', 'Kubernetes', 'Prometheus'],
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    ARRAY['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80'],
    'https://github.com',
    'https://demo.example.com',
    '{"Throughput": "25,000 req/sec", "Uptime": "99.99%", "Failover Time": "< 2s"}'::jsonb,
    true,
    true,
    3
),
(
    'Secure Online Examination Platform',
    'secure-online-examination',
    'Enterprise proctoring and assessment platform with automated face verification, browser locking, and real-time grading.',
    'Full-stack SaaS application supporting thousands of concurrent examinees. Features browser integrity monitoring, automated webcam anomaly recognition, dynamic question bank randomization, and instantaneous grading with comprehensive analytics.',
    'Full Stack',
    ARRAY['Next.js', 'TypeScript', 'PostgreSQL', 'Supabase', 'Tailwind CSS', 'WebSockets'],
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
    ARRAY['https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80'],
    'https://github.com',
    'https://demo.example.com',
    '{"Concurrent Users": "10,000+", "Audit Accuracy": "99.2%", "Latency": "80ms"}'::jsonb,
    false,
    true,
    4
);

-- 3. Skills
INSERT INTO public.skills (name, category, icon, proficiency, display_order, featured) VALUES
('TypeScript', 'Programming', 'Code2', 95, 1, true),
('Python', 'Programming', 'Terminal', 92, 2, true),
('Go', 'Programming', 'Cpu', 80, 3, false),
('Next.js & React', 'Frontend', 'Layout', 96, 4, true),
('Tailwind CSS', 'Frontend', 'Palette', 95, 5, true),
('Three.js / WebGL', 'Frontend', 'Box', 75, 6, false),
('Node.js & Express', 'Backend', 'Server', 90, 7, true),
('FastAPI', 'Backend', 'Zap', 88, 8, true),
('PostgreSQL & Supabase', 'Database', 'Database', 92, 9, true),
('Redis', 'Database', 'Layers', 84, 10, false),
('LangChain & RAG Systems', 'AI/ML', 'Bot', 89, 11, true),
('Qdrant Vector DB', 'AI/ML', 'Cpu', 86, 12, true),
('PyTorch & Computer Vision', 'AI/ML', 'Sparkles', 80, 13, false),
('Docker & Kubernetes', 'DevOps', 'Container', 85, 14, true),
('Git & CI/CD Actions', 'Tools', 'GitBranch', 90, 15, false);

-- 4. Experiences
INSERT INTO public.experiences (company, role, location, start_date, end_date, currently_working, description, technologies, display_order) VALUES
(
    'Apex Tech Innovations',
    'Senior Full-Stack & AI Engineer',
    'Remote',
    '2023-01-01',
    NULL,
    true,
    'Leading development of intelligent web platforms, modernizing microservices to Next.js and FastAPI, and implementing enterprise RAG search engines saving 30% research overhead.',
    ARRAY['Next.js', 'TypeScript', 'FastAPI', 'Qdrant', 'PostgreSQL', 'Docker'],
    1
),
(
    'Nova Digital Solutions',
    'Full-Stack Software Developer',
    'Islamabad, PK',
    '2021-06-01',
    '2022-12-31',
    false,
    'Architected high-volume web portals, built secure RESTful and GraphQL APIs, streamlined database queries reducing average page load by 45%.',
    ARRAY['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Redis'],
    2
);

-- 5. Education
INSERT INTO public.education (institution, degree, field, start_date, end_date, currently_studying, description, display_order) VALUES
(
    'National University of Sciences and Technology (NUST)',
    'Bachelor of Science',
    'Computer Science',
    '2018-09-01',
    '2022-06-30',
    false,
    'Graduated with honors. Focused on algorithms, distributed computing, database systems, and machine learning foundations.',
    1
);

-- 6. Services
INSERT INTO public.services (title, description, icon, features, display_order, is_active) VALUES
(
    'Full-Stack Web Engineering',
    'End-to-end production web applications engineered for speed, high scalability, and robust user engagement.',
    'Layout',
    ARRAY['Next.js App Router Architecture', 'Responsive, accessible UI with Tailwind CSS', 'Type-safe REST & GraphQL APIs', 'Supabase / PostgreSQL database design'],
    1,
    true
),
(
    'AI & RAG Systems Integration',
    'Tailored vector search systems, contextual LLM agents, and semantic document analysis engines.',
    'Bot',
    ARRAY['Vector search with Qdrant and pgvector', 'Retrieval-Augmented Generation pipelines', 'Low-latency streaming responses', 'Evaluation and safety guardrails'],
    2,
    true
),
(
    'Cloud & Backend Architecture',
    'High-concurrency microservices, Docker orchestration, and bulletproof relational database architectures.',
    'Server',
    ARRAY['Go / Node.js / Python API microservices', 'Redis caching & queue orchestration', 'Row-Level Security & Auth systems', 'Automated CI/CD workflows'],
    3,
    true
);

-- 7. Social Links
INSERT INTO public.social_links (platform, url, icon, display_order, is_active) VALUES
('GitHub', 'https://github.com', 'Github', 1, true),
('LinkedIn', 'https://linkedin.com', 'Linkedin', 2, true),
('Twitter / X', 'https://twitter.com', 'Twitter', 3, true),
('Email', 'mailto:contact@abdullah.dev', 'Mail', 4, true);

-- 8. Contact Messages (Initial sample messages for CMS view)
INSERT INTO public.contact_messages (name, email, subject, message, is_read, created_at) VALUES
(
    'Sarah Jenkins',
    'sarah.jenkins@enterprise.io',
    'Inquiry on Full-Stack AI Project Collaboration',
    'Hi Abdullah, we came across your portfolio and were very impressed with your AI research assistant project. We would love to schedule a technical discovery call next week.',
    false,
    NOW() - INTERVAL '4 hours'
),
(
    'Alex Rivera',
    'alex@techstart.co',
    'Contract Opportunity: Next.js Platform',
    'Hello, looking for a senior engineer to lead the frontend architecture of our analytics product. Let me know if you are open to contract engagements.',
    true,
    NOW() - INTERVAL '2 days'
);

-- 9. Site Settings
INSERT INTO public.site_settings (
    site_title,
    site_description,
    keywords,
    theme_default,
    allow_contact_form
) VALUES (
    'Abdullah — Full-Stack Engineer & AI Systems',
    'Production portfolio featuring modern web applications, AI/ML integrations, and dynamic content management.',
    ARRAY['Full-Stack Developer', 'AI Engineer', 'Next.js', 'React', 'Supabase', 'TypeScript'],
    'dark',
    true
);
