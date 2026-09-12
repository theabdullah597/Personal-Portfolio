"use server";

import { saveService, deleteService, getServices } from "@/lib/supabase/data-service";
import { Service } from "@/types";
import { revalidatePath } from "next/cache";

export async function saveServiceAction(
  data: Partial<Service>
): Promise<{ success: boolean; error?: string; service?: Service }> {
  try {
    if (!data.title?.trim()) {
      return { success: false, error: "Service title is required." };
    }
    const saved = await saveService(data);
    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath("/admin/services");
    revalidatePath("/admin");
    return { success: true, service: saved };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save service";
    return { success: false, error: message };
  }
}

export async function deleteServiceAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteService(id);
    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath("/admin/services");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete service";
    return { success: false, error: message };
  }
}

export async function toggleServiceActiveAction(
  id: string,
  is_active: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const services = await getServices();
    const existing = services.find((s) => s.id === id);
    if (!existing) return { success: false, error: "Service not found" };

    await saveService({ ...existing, is_active });
    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath("/admin/services");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to toggle service status";
    return { success: false, error: message };
  }
}
