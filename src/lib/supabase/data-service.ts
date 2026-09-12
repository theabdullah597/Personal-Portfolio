import { createClient as createServerSupabase, createAdminClient } from "./server";
import { getTombstoneSet, addTombstone, removeTombstone } from "@/lib/tombstones";
import {
  Profile,
  Project,
  Skill,
  Experience,
  Education,
  Service,
  SocialLink,
  ContactMessage,
  AdminDashboardStats,
} from "@/types";
import {
  initialProfile,
  initialProjects,
  initialSkills,
  initialExperiences,
  initialEducation,
  initialServices,
  initialSocialLinks,
  initialMessages,
} from "./mock-data";

// Fallback in-memory store for development prior to database provisioning
const memoryStore = {
  profile: { ...initialProfile },
  projects: [...initialProjects],
  skills: [...initialSkills],
  experiences: [...initialExperiences],
  education: [...initialEducation],
  services: [...initialServices],
  socialLinks: [...initialSocialLinks],
  messages: [...initialMessages],
};

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return Boolean(url && key && !url.includes("placeholder-project"));
}

/**
 * Returns a Supabase client for mutations.
 * If SUPABASE_SERVICE_ROLE_KEY is set in .env.local, it uses the admin client (bypasses RLS).
 * Otherwise, it falls back to the server client.
 */
async function getDbMutationClient() {
  const adminClient = createAdminClient();
  if (adminClient) {
    return adminClient;
  }
  return await createServerSupabase();
}

/* =========================================================================
 * PROFILE OPERATIONS
 * ========================================================================= */
export async function getProfile(): Promise<Profile> {
  if (!isSupabaseConfigured()) {
    return memoryStore.profile;
  }
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.from("profiles").select("*").single();
    if (error || !data) return memoryStore.profile;
    return data as Profile;
  } catch {
    return memoryStore.profile;
  }
}

export async function updateProfile(updates: Partial<Profile>): Promise<Profile> {
  if (!isSupabaseConfigured()) {
    memoryStore.profile = { ...memoryStore.profile, ...updates, updated_at: new Date().toISOString() };
    return memoryStore.profile;
  }
  try {
    const supabase = await getDbMutationClient();
    const { data, error } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", updates.id || memoryStore.profile.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Profile;
  } catch (err: unknown) {
    console.error("updateProfile error:", err);
    memoryStore.profile = { ...memoryStore.profile, ...updates };
    const message = err instanceof Error ? err.message : "Failed to update profile";
    throw new Error(message);
  }
}

/* =========================================================================
 * PROJECT OPERATIONS
 * ========================================================================= */
export async function getProjects(options?: {
  publishedOnly?: boolean;
  featuredOnly?: boolean;
  category?: string;
}): Promise<Project[]> {
  const tombstones = getTombstoneSet();

  if (!isSupabaseConfigured()) {
    let list = memoryStore.projects.filter((p) => !tombstones.has(p.id));
    if (options?.publishedOnly) list = list.filter((p) => p.published);
    if (options?.featuredOnly) list = list.filter((p) => p.featured && p.published);
    if (options?.category && options.category !== "All") {
      list = list.filter((p) => p.category.toLowerCase() === options.category?.toLowerCase());
    }
    return list.sort((a, b) => a.display_order - b.display_order);
  }

  try {
    const supabase = await createServerSupabase();
    let query = supabase.from("projects").select("*").order("display_order", { ascending: true });

    if (options?.publishedOnly) query = query.eq("published", true);
    if (options?.featuredOnly) query = query.eq("featured", true).eq("published", true);
    if (options?.category && options.category !== "All") {
      query = query.ilike("category", options.category);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return getProjectsFallback(options);
    }
    return (data as Project[])
      .filter((p) => !tombstones.has(p.id))
      .sort((a, b) => a.display_order - b.display_order);
  } catch {
    return getProjectsFallback(options);
  }
}

function getProjectsFallback(options?: {
  publishedOnly?: boolean;
  featuredOnly?: boolean;
  category?: string;
}): Project[] {
  const tombstones = getTombstoneSet();
  let list = memoryStore.projects.filter((p) => !tombstones.has(p.id));
  if (options?.publishedOnly) list = list.filter((p) => p.published);
  if (options?.featuredOnly) list = list.filter((p) => p.featured && p.published);
  if (options?.category && options.category !== "All") {
    list = list.filter((p) => p.category.toLowerCase() === options.category?.toLowerCase());
  }
  return list.sort((a, b) => a.display_order - b.display_order);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const tombstones = getTombstoneSet();
  if (!isSupabaseConfigured()) {
    const proj = memoryStore.projects.find((p) => p.slug === slug);
    if (proj && !tombstones.has(proj.id)) return proj;
    return null;
  }
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.from("projects").select("*").eq("slug", slug).single();
    if (error || !data || tombstones.has(data.id)) {
      const fallback = memoryStore.projects.find((p) => p.slug === slug);
      if (fallback && !tombstones.has(fallback.id)) return fallback;
      return null;
    }
    return data as Project;
  } catch {
    const fallback = memoryStore.projects.find((p) => p.slug === slug);
    if (fallback && !tombstones.has(fallback.id)) return fallback;
    return null;
  }
}

export async function saveProject(project: Partial<Project>): Promise<Project> {
  const isNew = !project.id;
  const now = new Date().toISOString();

  if (project.id) {
    removeTombstone(project.id);
  }

  if (!isSupabaseConfigured()) {
    if (isNew) {
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        title: project.title || "Untitled Project",
        slug: project.slug || `project-${Date.now()}`,
        short_description: project.short_description || "",
        full_description: project.full_description || "",
        category: project.category || "Full Stack",
        technologies: project.technologies || [],
        image_url: project.image_url || "",
        gallery_urls: project.gallery_urls || [],
        github_url: project.github_url || null,
        live_url: project.live_url || null,
        metrics: project.metrics || null,
        featured: project.featured ?? false,
        published: project.published ?? false,
        display_order: project.display_order ?? memoryStore.projects.length + 1,
        created_at: now,
        updated_at: now,
      };
      memoryStore.projects.push(newProj);
      return newProj;
    } else {
      const idx = memoryStore.projects.findIndex((p) => p.id === project.id);
      if (idx !== -1) {
        memoryStore.projects[idx] = {
          ...memoryStore.projects[idx],
          ...project,
          updated_at: now,
        } as Project;
        return memoryStore.projects[idx];
      }
    }
  }

  try {
    const supabase = await getDbMutationClient();
    if (isNew) {
      const { data, error } = await supabase
        .from("projects")
        .insert([{ ...project, created_at: now, updated_at: now }])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Project;
    } else {
      const { data, error } = await supabase
        .from("projects")
        .update({ ...project, updated_at: now })
        .eq("id", project.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Project;
    }
  } catch (err: unknown) {
    console.error("saveProject error:", err);
    const message = err instanceof Error ? err.message : "Failed to save project";
    throw new Error(message);
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  addTombstone(id);
  memoryStore.projects = memoryStore.projects.filter((p) => p.id !== id);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await getDbMutationClient();
      await supabase.from("projects").delete().eq("id", id);
    } catch (err) {
      console.warn("deleteProject Supabase notice:", err);
    }
  }
  return true;
}

/* =========================================================================
 * SKILLS OPERATIONS
 * ========================================================================= */
export async function getSkills(): Promise<Skill[]> {
  const tombstones = getTombstoneSet();
  if (!isSupabaseConfigured()) {
    return memoryStore.skills
      .filter((s) => !tombstones.has(s.id))
      .sort((a, b) => a.display_order - b.display_order);
  }
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("display_order", { ascending: true });
    if (error || !data || data.length === 0) {
      return memoryStore.skills
        .filter((s) => !tombstones.has(s.id))
        .sort((a, b) => a.display_order - b.display_order);
    }
    return (data as Skill[])
      .filter((s) => !tombstones.has(s.id))
      .sort((a, b) => a.display_order - b.display_order);
  } catch {
    return memoryStore.skills
      .filter((s) => !tombstones.has(s.id))
      .sort((a, b) => a.display_order - b.display_order);
  }
}

export async function saveSkill(skill: Partial<Skill>): Promise<Skill> {
  const isNew = !skill.id;

  if (skill.id) {
    removeTombstone(skill.id);
  }

  if (!isSupabaseConfigured()) {
    if (isNew) {
      const newSkill: Skill = {
        id: `sk-${Date.now()}`,
        name: skill.name || "Skill",
        category: skill.category || "Programming",
        icon: skill.icon || "Code2",
        description: skill.description || "",
        proficiency: skill.proficiency ?? 85,
        display_order: skill.display_order ?? memoryStore.skills.length + 1,
        featured: skill.featured ?? false,
      };
      memoryStore.skills.push(newSkill);
      return newSkill;
    } else {
      const idx = memoryStore.skills.findIndex((s) => s.id === skill.id);
      if (idx !== -1) {
        memoryStore.skills[idx] = { ...memoryStore.skills[idx], ...skill } as Skill;
        return memoryStore.skills[idx];
      }
    }
  }

  try {
    const supabase = await getDbMutationClient();
    if (isNew) {
      const { data, error } = await supabase.from("skills").insert([skill]).select().single();
      if (error) throw new Error(error.message);
      return data as Skill;
    } else {
      const { data, error } = await supabase.from("skills").update(skill).eq("id", skill.id).select().single();
      if (error) throw new Error(error.message);
      return data as Skill;
    }
  } catch (err: unknown) {
    console.error("saveSkill error:", err);
    const message = err instanceof Error ? err.message : "Failed to save skill";
    throw new Error(message);
  }
}

export async function deleteSkill(id: string): Promise<boolean> {
  addTombstone(id);
  memoryStore.skills = memoryStore.skills.filter((s) => s.id !== id);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await getDbMutationClient();
      await supabase.from("skills").delete().eq("id", id);
    } catch (err) {
      console.warn("deleteSkill Supabase notice:", err);
    }
  }
  return true;
}

/* =========================================================================
 * EXPERIENCES OPERATIONS
 * ========================================================================= */
export async function getExperiences(): Promise<Experience[]> {
  const tombstones = getTombstoneSet();
  if (!isSupabaseConfigured()) {
    return memoryStore.experiences
      .filter((e) => !tombstones.has(e.id))
      .sort((a, b) => a.display_order - b.display_order);
  }
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("display_order", { ascending: true });
    if (error || !data || data.length === 0) {
      return memoryStore.experiences
        .filter((e) => !tombstones.has(e.id))
        .sort((a, b) => a.display_order - b.display_order);
    }
    return (data as Experience[])
      .filter((e) => !tombstones.has(e.id))
      .sort((a, b) => a.display_order - b.display_order);
  } catch {
    return memoryStore.experiences
      .filter((e) => !tombstones.has(e.id))
      .sort((a, b) => a.display_order - b.display_order);
  }
}

export async function saveExperience(exp: Partial<Experience>): Promise<Experience> {
  const isNew = !exp.id;

  if (exp.id) {
    removeTombstone(exp.id);
  }

  if (!isSupabaseConfigured()) {
    if (isNew) {
      const newExp: Experience = {
        id: `exp-${Date.now()}`,
        company: exp.company || "",
        role: exp.role || "",
        location: exp.location || "",
        start_date: exp.start_date || new Date().toISOString().split("T")[0],
        end_date: exp.currently_working ? null : exp.end_date,
        currently_working: exp.currently_working ?? false,
        description: exp.description || "",
        technologies: exp.technologies || [],
        display_order: exp.display_order ?? memoryStore.experiences.length + 1,
      };
      memoryStore.experiences.push(newExp);
      return newExp;
    } else {
      const idx = memoryStore.experiences.findIndex((e) => e.id === exp.id);
      if (idx !== -1) {
        memoryStore.experiences[idx] = { ...memoryStore.experiences[idx], ...exp } as Experience;
        return memoryStore.experiences[idx];
      }
    }
  }

  try {
    const supabase = await getDbMutationClient();
    if (isNew) {
      const { data, error } = await supabase.from("experiences").insert([exp]).select().single();
      if (error) throw new Error(error.message);
      return data as Experience;
    } else {
      const { data, error } = await supabase.from("experiences").update(exp).eq("id", exp.id).select().single();
      if (error) throw new Error(error.message);
      return data as Experience;
    }
  } catch (err: unknown) {
    console.error("saveExperience error:", err);
    const message = err instanceof Error ? err.message : "Failed to save experience";
    throw new Error(message);
  }
}

export async function deleteExperience(id: string): Promise<boolean> {
  addTombstone(id);
  memoryStore.experiences = memoryStore.experiences.filter((e) => e.id !== id);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await getDbMutationClient();
      await supabase.from("experiences").delete().eq("id", id);
    } catch (err) {
      console.warn("deleteExperience Supabase notice:", err);
    }
  }
  return true;
}

/* =========================================================================
 * EDUCATION OPERATIONS
 * ========================================================================= */
export async function getEducation(): Promise<Education[]> {
  const tombstones = getTombstoneSet();
  if (!isSupabaseConfigured()) {
    return memoryStore.education
      .filter((e) => !tombstones.has(e.id))
      .sort((a, b) => a.display_order - b.display_order);
  }
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .order("display_order", { ascending: true });
    if (error || !data || data.length === 0) {
      return memoryStore.education
        .filter((e) => !tombstones.has(e.id))
        .sort((a, b) => a.display_order - b.display_order);
    }
    return (data as Education[])
      .filter((e) => !tombstones.has(e.id))
      .sort((a, b) => a.display_order - b.display_order);
  } catch {
    return memoryStore.education
      .filter((e) => !tombstones.has(e.id))
      .sort((a, b) => a.display_order - b.display_order);
  }
}

export async function saveEducation(edu: Partial<Education>): Promise<Education> {
  const isNew = !edu.id;

  if (edu.id) {
    removeTombstone(edu.id);
  }

  if (!isSupabaseConfigured()) {
    if (isNew) {
      const newEdu: Education = {
        id: `edu-${Date.now()}`,
        institution: edu.institution || "",
        degree: edu.degree || "",
        field: edu.field || "",
        start_date: edu.start_date || new Date().toISOString().split("T")[0],
        end_date: edu.currently_studying ? null : edu.end_date,
        currently_studying: edu.currently_studying ?? false,
        description: edu.description || "",
        display_order: edu.display_order ?? memoryStore.education.length + 1,
      };
      memoryStore.education.push(newEdu);
      return newEdu;
    } else {
      const idx = memoryStore.education.findIndex((e) => e.id === edu.id);
      if (idx !== -1) {
        memoryStore.education[idx] = { ...memoryStore.education[idx], ...edu } as Education;
        return memoryStore.education[idx];
      }
    }
  }

  try {
    const supabase = await getDbMutationClient();
    if (isNew) {
      const { data, error } = await supabase.from("education").insert([edu]).select().single();
      if (error) throw new Error(error.message);
      return data as Education;
    } else {
      const { data, error } = await supabase.from("education").update(edu).eq("id", edu.id).select().single();
      if (error) throw new Error(error.message);
      return data as Education;
    }
  } catch (err: unknown) {
    console.error("saveEducation error:", err);
    const message = err instanceof Error ? err.message : "Failed to save education";
    throw new Error(message);
  }
}

export async function deleteEducation(id: string): Promise<boolean> {
  addTombstone(id);
  memoryStore.education = memoryStore.education.filter((e) => e.id !== id);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await getDbMutationClient();
      await supabase.from("education").delete().eq("id", id);
    } catch (err) {
      console.warn("deleteEducation Supabase notice:", err);
    }
  }
  return true;
}

/* =========================================================================
 * SERVICES OPERATIONS
 * ========================================================================= */
export async function getServices(activeOnly: boolean = false): Promise<Service[]> {
  const tombstones = getTombstoneSet();
  if (!isSupabaseConfigured()) {
    let list = memoryStore.services.filter((s) => !tombstones.has(s.id));
    if (activeOnly) list = list.filter((s) => s.is_active);
    return list.sort((a, b) => a.display_order - b.display_order);
  }
  try {
    const supabase = await createServerSupabase();
    let query = supabase.from("services").select("*").order("display_order", { ascending: true });
    if (activeOnly) query = query.eq("is_active", true);
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      let list = memoryStore.services.filter((s) => !tombstones.has(s.id));
      if (activeOnly) list = list.filter((s) => s.is_active);
      return list;
    }
    let list = (data as Service[]).filter((s) => !tombstones.has(s.id));
    return list;
  } catch {
    let list = memoryStore.services.filter((s) => !tombstones.has(s.id));
    if (activeOnly) list = list.filter((s) => s.is_active);
    return list;
  }
}

export async function saveService(srv: Partial<Service>): Promise<Service> {
  const isNew = !srv.id;

  if (srv.id) {
    removeTombstone(srv.id);
  }

  if (!isSupabaseConfigured()) {
    if (isNew) {
      const newSrv: Service = {
        id: `srv-${Date.now()}`,
        title: srv.title || "",
        description: srv.description || "",
        icon: srv.icon || "Layout",
        features: srv.features || [],
        display_order: srv.display_order ?? memoryStore.services.length + 1,
        is_active: srv.is_active ?? true,
      };
      memoryStore.services.push(newSrv);
      return newSrv;
    } else {
      const idx = memoryStore.services.findIndex((s) => s.id === srv.id);
      if (idx !== -1) {
        memoryStore.services[idx] = { ...memoryStore.services[idx], ...srv } as Service;
        return memoryStore.services[idx];
      }
    }
  }

  try {
    const supabase = await getDbMutationClient();
    if (isNew) {
      const { data, error } = await supabase.from("services").insert([srv]).select().single();
      if (error) throw new Error(error.message);
      return data as Service;
    } else {
      const { data, error } = await supabase.from("services").update(srv).eq("id", srv.id).select().single();
      if (error) throw new Error(error.message);
      return data as Service;
    }
  } catch (err: unknown) {
    console.error("saveService error:", err);
    const message = err instanceof Error ? err.message : "Failed to save service";
    throw new Error(message);
  }
}

export async function deleteService(id: string): Promise<boolean> {
  addTombstone(id);
  memoryStore.services = memoryStore.services.filter((s) => s.id !== id);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await getDbMutationClient();
      await supabase.from("services").delete().eq("id", id);
    } catch (err) {
      console.warn("deleteService Supabase notice:", err);
    }
  }
  return true;
}

/* =========================================================================
 * SOCIAL LINKS
 * ========================================================================= */
export async function getSocialLinks(): Promise<SocialLink[]> {
  const tombstones = getTombstoneSet();
  if (!isSupabaseConfigured()) {
    return memoryStore.socialLinks
      .filter((l) => !tombstones.has(l.id))
      .sort((a, b) => a.display_order - b.display_order);
  }
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("social_links")
      .select("*")
      .order("display_order", { ascending: true });
    if (error || !data || data.length === 0) {
      return memoryStore.socialLinks
        .filter((l) => !tombstones.has(l.id))
        .sort((a, b) => a.display_order - b.display_order);
    }
    return (data as SocialLink[])
      .filter((l) => !tombstones.has(l.id))
      .sort((a, b) => a.display_order - b.display_order);
  } catch {
    return memoryStore.socialLinks
      .filter((l) => !tombstones.has(l.id))
      .sort((a, b) => a.display_order - b.display_order);
  }
}

export async function saveSocialLink(link: Partial<SocialLink>): Promise<SocialLink> {
  const isNew = !link.id;

  if (link.id) {
    removeTombstone(link.id);
  }

  if (!isSupabaseConfigured()) {
    if (isNew) {
      const newLink: SocialLink = {
        id: `soc-${Date.now()}`,
        platform: link.platform || "",
        url: link.url || "",
        icon: link.icon || "Link",
        display_order: link.display_order ?? memoryStore.socialLinks.length + 1,
        is_active: link.is_active ?? true,
      };
      memoryStore.socialLinks.push(newLink);
      return newLink;
    } else {
      const idx = memoryStore.socialLinks.findIndex((l) => l.id === link.id);
      if (idx !== -1) {
        memoryStore.socialLinks[idx] = { ...memoryStore.socialLinks[idx], ...link } as SocialLink;
        return memoryStore.socialLinks[idx];
      }
    }
  }

  try {
    const supabase = await getDbMutationClient();
    if (isNew) {
      const { data, error } = await supabase.from("social_links").insert([link]).select().single();
      if (error) throw new Error(error.message);
      return data as SocialLink;
    } else {
      const { data, error } = await supabase.from("social_links").update(link).eq("id", link.id).select().single();
      if (error) throw new Error(error.message);
      return data as SocialLink;
    }
  } catch (err: unknown) {
    console.error("saveSocialLink error:", err);
    const message = err instanceof Error ? err.message : "Failed to save social link";
    throw new Error(message);
  }
}

export async function deleteSocialLink(id: string): Promise<boolean> {
  addTombstone(id);
  memoryStore.socialLinks = memoryStore.socialLinks.filter((l) => l.id !== id);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await getDbMutationClient();
      await supabase.from("social_links").delete().eq("id", id);
    } catch (err) {
      console.warn("deleteSocialLink Supabase notice:", err);
    }
  }
  return true;
}

/* =========================================================================
 * CONTACT MESSAGES OPERATIONS
 * ========================================================================= */
export async function getContactMessages(): Promise<ContactMessage[]> {
  const tombstones = getTombstoneSet();
  if (!isSupabaseConfigured()) {
    return memoryStore.messages
      .filter((m) => !tombstones.has(m.id))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) {
      return memoryStore.messages
        .filter((m) => !tombstones.has(m.id))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return (data as ContactMessage[])
      .filter((m) => !tombstones.has(m.id));
  } catch {
    return memoryStore.messages
      .filter((m) => !tombstones.has(m.id));
  }
}

export async function submitContactMessage(msg: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      name: msg.name,
      email: msg.email,
      subject: msg.subject,
      message: msg.message,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    memoryStore.messages.unshift(newMsg);
    return { success: true };
  }

  try {
    const supabase = await createServerSupabase();
    const { error } = await supabase.from("contact_messages").insert([
      {
        name: msg.name,
        email: msg.email,
        subject: msg.subject,
        message: msg.message,
      },
    ]);
    if (error) {
      console.error("Supabase contact_messages insert error:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to submit message to database";
    console.error("Supabase submitContactMessage error:", err);
    return { success: false, error: message };
  }
}

export async function toggleMessageRead(id: string, is_read: boolean): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const msg = memoryStore.messages.find((m) => m.id === id);
    if (msg) msg.is_read = is_read;
    return true;
  }
  try {
    const supabase = await getDbMutationClient();
    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read })
      .eq("id", id);
    if (error) throw new Error(error.message);
    return true;
  } catch (err: unknown) {
    console.error("toggleMessageRead error:", err);
    const msg = memoryStore.messages.find((m) => m.id === id);
    if (msg) msg.is_read = is_read;
    return true;
  }
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  addTombstone(id);
  memoryStore.messages = memoryStore.messages.filter((m) => m.id !== id);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await getDbMutationClient();
      await supabase.from("contact_messages").delete().eq("id", id);
    } catch (err) {
      console.warn("deleteContactMessage Supabase notice:", err);
    }
  }
  return true;
}

/* =========================================================================
 * ADMIN DASHBOARD STATS
 * ========================================================================= */
export async function getDashboardStats(): Promise<AdminDashboardStats> {
  const [projects, skills, experiences, services, messages] = await Promise.all([
    getProjects(),
    getSkills(),
    getExperiences(),
    getServices(),
    getContactMessages(),
  ]);

  return {
    totalProjects: projects.length,
    publishedProjects: projects.filter((p) => p.published).length,
    draftProjects: projects.filter((p) => !p.published).length,
    featuredProjects: projects.filter((p) => p.featured).length,
    totalSkills: skills.length,
    totalExperiences: experiences.length,
    totalServices: services.length,
    unreadMessages: messages.filter((m) => !m.is_read).length,
    totalMessages: messages.length,
  };
}
