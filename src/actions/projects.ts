"use server";

import { saveProject, deleteProject, getProjects } from "@/lib/supabase/data-service";
import { Project } from "@/types";
import { revalidatePath } from "next/cache";

export async function saveProjectAction(
  data: Partial<Project>
): Promise<{ success: boolean; error?: string; project?: Project }> {
  try {
    if (!data.title?.trim()) {
      return { success: false, error: "Project title is required." };
    }
    if (!data.slug?.trim()) {
      return { success: false, error: "Project slug is required." };
    }

    const saved = await saveProject(data);
    revalidatePath("/");
    revalidatePath("/projects");
    if (saved.slug) {
      revalidatePath(`/projects/${saved.slug}`);
    }
    revalidatePath("/admin/projects");
    revalidatePath("/admin");

    return { success: true, project: saved };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save project";
    return { success: false, error: message };
  }
}

export async function deleteProjectAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteProject(id);
    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete project";
    return { success: false, error: message };
  }
}

export async function toggleProjectPublishAction(
  id: string,
  published: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const projects = await getProjects();
    const existing = projects.find((p) => p.id === id);
    if (!existing) return { success: false, error: "Project not found" };

    await saveProject({ ...existing, published });
    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update project status";
    return { success: false, error: message };
  }
}

export async function toggleProjectFeaturedAction(
  id: string,
  featured: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const projects = await getProjects();
    const existing = projects.find((p) => p.id === id);
    if (!existing) return { success: false, error: "Project not found" };

    await saveProject({ ...existing, featured });
    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update featured status";
    return { success: false, error: message };
  }
}
