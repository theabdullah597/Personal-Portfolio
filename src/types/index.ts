export interface Profile {
  id: string;
  full_name: string;
  headline: string;
  bio: string;
  career_focus?: string;
  avatar_url?: string | null;
  resume_url?: string | null;
  location?: string | null;
  email?: string | null;
  phone?: string | null;
  available_for_hire: boolean;
  years_experience?: number;
  completed_projects?: number;
  created_at?: string;
  updated_at?: string;
}

export type ProjectCategory =
  | "All"
  | "AI/ML"
  | "Web Development"
  | "Full Stack"
  | "Computer Vision"
  | "NLP"
  | "Cloud & DevOps"
  | "Other";

export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  category: ProjectCategory | string;
  technologies: string[];
  image_url: string;
  gallery_urls?: string[];
  github_url?: string | null;
  live_url?: string | null;
  metrics?: Record<string, string> | null;
  featured: boolean;
  published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type SkillCategory =
  | "Programming"
  | "Frontend"
  | "Backend"
  | "Database"
  | "AI/ML"
  | "Deep Learning"
  | "Tools"
  | "DevOps";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory | string;
  icon?: string | null;
  description?: string | null;
  proficiency?: number;
  display_order: number;
  featured: boolean;
  created_at?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location?: string | null;
  start_date: string;
  end_date?: string | null;
  currently_working: boolean;
  description: string;
  technologies: string[];
  display_order: number;
  created_at?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date?: string | null;
  currently_studying: boolean;
  description?: string | null;
  display_order: number;
  created_at?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string | null;
  features: string[];
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: string | null;
  display_order: number;
  is_active: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  site_title: string;
  site_description: string;
  keywords: string[];
  og_image_url?: string | null;
  theme_default?: "dark" | "light" | "system";
  allow_contact_form: boolean;
  social_links?: SocialLink[];
}

export interface AdminDashboardStats {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  featuredProjects: number;
  totalSkills: number;
  totalExperiences: number;
  totalServices: number;
  unreadMessages: number;
  totalMessages: number;
}
