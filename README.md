# Production Full-Stack Personal Portfolio CMS

A high-performance personal portfolio website and dynamic Content Management System (CMS) engineered with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Supabase (PostgreSQL, Auth, Storage, RLS)**, **React Three Fiber**, **Drei**, **GSAP**, and **Framer Motion**.

---

## 🌟 Key Architecture & Highlights

- **Dynamic CMS**: All portfolio content (Profile, Projects, Skills, Experience, Education, Services, Social Links, and Contact Inquiries) is managed dynamically through a secure admin dashboard without editing source code.
- **Two Major Sides**:
  1. **Public Portfolio**: Fast, responsive, dark-mode first aesthetic with light-mode support, interactive 3D hero sculpture, project case study deep dives (`/projects/[slug]`), and category filters.
  2. **Admin Dashboard (`/admin`)**: Protected CMS portal with Supabase session validation, CRUD managers, instant live status toggles, image upload to Supabase Storage, and inquiry inbox.
- **AI Ready Architecture**: Prepared with `/api/chat` route designed for future RAG / vector copilot (*Ask Abdullah — AI Portfolio Assistant*).
- **Row Level Security (RLS)**: Enforced database isolation so public visitors can only read published content, while only authenticated administrators have full mutation and upload privileges.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies

Ensure you are running **Node.js 18+** (recommended: Node 20 or 22).

```bash
cd full-stack-portfolio
npm install --legacy-peer-deps
```

---

### 2. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Choose a project name and database password.
3. Note your project region and wait for initialization to complete.

---

### 3. Configure Environment Variables

Duplicate `.env.example` to create `.env.local`:

```bash
cp .env.example .env.local
```

In your Supabase dashboard, navigate to **Project Settings → API** and populate:

```env
# Supabase Public API Credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Service role key for backend operations (Keep secret)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Site URL for canonical redirects & SEO
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Note**: If run locally before configuring live Supabase keys, the application automatically runs in demo mode with full fallback data so you can evaluate the entire UI and admin immediately.

---

### 4. Create Database Tables & RLS Policies

1. Open your Supabase Dashboard and go to **SQL Editor**.
2. Open the file `supabase/schema.sql` from this repository.
3. Paste its contents into the SQL Editor and click **Run**.
   - This creates tables: `profiles`, `projects`, `skills`, `experiences`, `education`, `services`, `social_links`, `contact_messages`, and `site_settings`.
   - It configures indexes and Row Level Security (RLS) policies.
4. Open the file `supabase/seed.sql` and run it in the SQL Editor to populate realistic starter data.

---

### 5. Configure Authentication

1. In Supabase Dashboard, go to **Authentication → Providers**.
2. Ensure **Email** is enabled.
3. Under **Authentication → Settings**, you may disable *Confirm email* if you want immediate admin access without verification emails during setup.

---

### 6. Configure Storage Buckets

1. In Supabase Dashboard, go to **Storage**.
2. Confirm the buckets `portfolio-media` and `portfolio-documents` were created by the SQL schema.
3. If not already present, create a public bucket named `portfolio-media`.
4. The RLS policies in `supabase/schema.sql` automatically permit public image reads and authenticated uploads.

---

### 7. Create the Admin Account

1. In Supabase Dashboard, go to **Authentication → Users**.
2. Click **Add User** → **Create User**.
3. Enter your admin email and secure password (e.g. `admin@portfolio.dev`).
4. You can now use these credentials to log into `/admin/login`.

---

### 8. Run Locally

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the public website.  
Open [http://localhost:3000/admin](http://localhost:3000/admin) to log in and access the CMS dashboard.

To run a production build locally:

```bash
npm run build
npm run start
```

---

### 9. Deploy to Vercel

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio CMS commit"
   git remote add origin https://github.com/your-username/portfolio-cms.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **Add New → Project**.
3. Import your GitHub repository.
4. In the **Environment Variables** section on Vercel, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your production domain, e.g. `https://yourdomain.com`)
5. Click **Deploy**. Vercel will build and deploy your portfolio globally with edge caching and instant invalidation!

---

## 🛠 Project Structure

```
src/
├── actions/              # Next.js Server Actions (CRUD for projects, skills, profile, messages)
├── app/                  # Next.js App Router
│   ├── about/            # Dedicated About page
│   ├── admin/            # Admin CMS portal
│   │   ├── (dashboard)/  # Admin shell, overview, CRUD pages (projects, skills, etc.)
│   │   └── login/        # Protected admin authentication page
│   ├── api/chat/         # AI Chatbot endpoint architecture
│   ├── contact/          # Dedicated Contact page
│   ├── experience/       # Full career timeline
│   ├── projects/         # Projects showcase with live category filter
│   │   └── [slug]/       # Dynamic case study deep dives
│   ├── services/         # Engineering services
│   ├── skills/           # Technical skills matrix
│   ├── layout.tsx        # Root layout with ThemeProvider and ToastProvider
│   ├── page.tsx          # Homepage with Hero, Featured Projects, Timeline, etc.
│   ├── robots.ts         # Automated search engine robots configuration
│   └── sitemap.ts        # Automated dynamic XML sitemap generator
├── components/
│   ├── admin/            # CMS Dashboard components (tables, modals, forms, sidebar)
│   ├── animations/       # Framer Motion & Magnetic physics components
│   ├── contact/          # Public contact form with Zod & React Hook Form
│   ├── home/             # Homepage section components
│   ├── layout/           # Sticky Navbar and Footer
│   ├── projects/         # Public project explorer
│   ├── three/            # React Three Fiber 3D interactive sculpture
│   └── ui/               # Reusable design system primitives (Button, Card, Modal, Toast)
├── lib/
│   ├── supabase/         # Supabase client, server, storage, and unified data service
│   └── utils.ts          # Utility functions and Tailwind merger
└── types/                # Central TypeScript types
```

---

## 📄 License

MIT License. Designed and engineered for production.
