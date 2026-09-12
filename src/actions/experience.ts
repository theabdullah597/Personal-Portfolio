"use server";

import { saveExperience, deleteExperience } from "@/lib/supabase/data-service";
import { Experience } from "@/types";
import { revalidatePath } from "next/cache";

export async function saveExperienceAction(
  data: Partial<Experience>
): Promise<{ success: boolean; error?: string; experience?: Experience }> {
  try {
    if (!data.company?.trim() || !data.role?.trim()) {
      return { success: false, error: "Company and Role are required." };
    }
    const saved = await saveExperience(data);
    revalidatePath("/");
    revalidatePath("/experience");
    revalidatePath("/admin/experience");
    revalidatePath("/admin");
    return { success: true, experience: saved };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save experience";
    return { success: false, error: message };
  }
}

export async function deleteExperienceAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteExperience(id);
    revalidatePath("/");
    revalidatePath("/experience");
    revalidatePath("/admin/experience");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete experience";
    return { success: false, error: message };
  }
}
