"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  setAdminSession,
  clearAdminSession,
  getServerAdminSession,
} from "@/lib/auth-session";
import { verifyAdminPassword, getAdminConfig } from "@/lib/admin-password";

export interface AuthResponse {
  success: boolean;
  error?: string;
}

export async function loginAction(formData: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const { email, password } = formData;

  if (!email || !password) {
    return { success: false, error: "Please provide both email and password." };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const adminConfig = getAdminConfig();
  const configuredEmail = (
    adminConfig?.email ||
    process.env.ADMIN_EMAIL ||
    "admin@portfolio.dev"
  ).trim().toLowerCase();

  // 1. Check against persistent or configured Admin credentials
  if (normalizedEmail === configuredEmail) {
    const isPassValid = await verifyAdminPassword(password);
    if (isPassValid) {
      await setAdminSession(email);
      return { success: true };
    }
  }

  // 2. If not matched and Supabase is configured, check Supabase Auth
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl && !supabaseUrl.includes("placeholder-project")) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data?.user) {
        await setAdminSession(data.user.email || email);
        return { success: true };
      }
    } catch {
      // Supabase auth attempt failed
    }
  }

  return {
    success: false,
    error: "Invalid email or password. Please verify your credentials.",
  };
}

export async function logoutAction() {
  await clearAdminSession();

  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // ignore
  }

  redirect("/admin/login");
}

export async function getAdminUser() {
  // 1. Check secure cryptographic session
  const session = await getServerAdminSession();
  if (session.authenticated && session.email) {
    return {
      id: "admin-id",
      email: session.email,
      role: "admin",
      isDemo: false,
    };
  }

  // 2. Check Supabase Auth session
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    return {
      id: user.id,
      email: user.email || "",
      role: "admin",
      isDemo: false,
    };
  } catch {
    return null;
  }
}
