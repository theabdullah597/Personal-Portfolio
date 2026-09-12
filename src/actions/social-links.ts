"use server";

import {
  saveSocialLink,
  deleteSocialLink,
  getSocialLinks,
} from "@/lib/supabase/data-service";
import { SocialLink } from "@/types";
import { revalidatePath } from "next/cache";

export async function saveSocialLinkAction(
  data: Partial<SocialLink>
): Promise<{ success: boolean; error?: string; link?: SocialLink }> {
  try {
    if (!data.platform?.trim() || !data.url?.trim()) {
      return { success: false, error: "Platform and URL are required." };
    }
    const saved = await saveSocialLink(data);
    revalidatePath("/");
    revalidatePath("/admin/social-links");
    revalidatePath("/admin");
    return { success: true, link: saved };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save link";
    return { success: false, error: message };
  }
}

export async function deleteSocialLinkAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteSocialLink(id);
    revalidatePath("/");
    revalidatePath("/admin/social-links");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete link";
    return { success: false, error: message };
  }
}
