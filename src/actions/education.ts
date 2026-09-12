"use server";

import { saveEducation, deleteEducation } from "@/lib/supabase/data-service";
import { Education } from "@/types";
import { revalidatePath } from "next/cache";

export async function saveEducationAction(
  data: Partial<Education>
): Promise<{ success: boolean; error?: string; education?: Education }> {
  try {
    if (!data.institution?.trim() || !data.degree?.trim()) {
      return { success: false, error: "Institution and Degree are required." };
    }
    const saved = await saveEducation(data);
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/education");
    revalidatePath("/admin");
    return { success: true, education: saved };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save education record";
    return { success: false, error: message };
  }
}

export async function deleteEducationAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteEducation(id);
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/education");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete education record";
    return { success: false, error: message };
  }
}
