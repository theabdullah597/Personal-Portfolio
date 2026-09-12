"use server";

import { getAdminUser } from "@/actions/auth";
import { verifyAdminPassword, saveAdminPassword } from "@/lib/admin-password";
import { createClient as createServerSupabase } from "@/lib/supabase/server";

export interface ChangePasswordResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function changePasswordAction(formData: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ChangePasswordResult> {
  const { currentPassword, newPassword, confirmPassword } = formData;

  // 1. Verify user is authenticated as admin
  const user = await getAdminUser();
  if (!user) {
    return { success: false, error: "Unauthorized. Please log in first." };
  }

  // 2. Validate fields
  if (!currentPassword) {
    return { success: false, error: "Current password is required." };
  }
  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: "New password must be at least 8 characters long." };
  }
  if (newPassword !== confirmPassword) {
    return { success: false, error: "New passwords do not match." };
  }

  // 3. Verify current password
  const isValid = await verifyAdminPassword(currentPassword);
  if (!isValid) {
    return { success: false, error: "Incorrect current password." };
  }

  // 4. Save new password hash to persistent configuration
  const saved = await saveAdminPassword(newPassword, user.email);
  if (!saved) {
    return { success: false, error: "Failed to persist new password. Please try again." };
  }

  // 5. If Supabase Auth is active, also sync the password in Supabase
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes("placeholder-project")) {
      const supabase = await createServerSupabase();
      await supabase.auth.updateUser({ password: newPassword });
    }
  } catch {
    // Non-fatal if Supabase auth is not using password sync
  }

  return {
    success: true,
    message: "Admin password updated successfully. Use your new password for your next login.",
  };
}
