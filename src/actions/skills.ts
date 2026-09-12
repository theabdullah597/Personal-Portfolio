"use server";

import { saveSkill, deleteSkill, getSkills } from "@/lib/supabase/data-service";
import { Skill } from "@/types";
import { revalidatePath } from "next/cache";

export async function saveSkillAction(
  data: Partial<Skill>
): Promise<{ success: boolean; error?: string; skill?: Skill }> {
  try {
    if (!data.name?.trim()) {
      return { success: false, error: "Skill name is required." };
    }
    const saved = await saveSkill(data);
    revalidatePath("/");
    revalidatePath("/skills");
    revalidatePath("/admin/skills");
    revalidatePath("/admin");
    return { success: true, skill: saved };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save skill";
    return { success: false, error: message };
  }
}

export async function deleteSkillAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteSkill(id);
    revalidatePath("/");
    revalidatePath("/skills");
    revalidatePath("/admin/skills");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete skill";
    return { success: false, error: message };
  }
}

export async function toggleSkillFeaturedAction(
  id: string,
  featured: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const skills = await getSkills();
    const existing = skills.find((s) => s.id === id);
    if (!existing) return { success: false, error: "Skill not found" };

    await saveSkill({ ...existing, featured });
    revalidatePath("/");
    revalidatePath("/skills");
    revalidatePath("/admin/skills");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update skill status";
    return { success: false, error: message };
  }
}
