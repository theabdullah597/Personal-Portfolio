"use server";

import { updateProfile } from "@/lib/supabase/data-service";
import { Profile } from "@/types";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(
  data: Partial<Profile>
): Promise<{ success: boolean; error?: string; profile?: Profile }> {
  try {
    const updated = await updateProfile(data);
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/profile");
    revalidatePath("/admin");
    return { success: true, profile: updated };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update profile";
    return { success: false, error: message };
  }
}
