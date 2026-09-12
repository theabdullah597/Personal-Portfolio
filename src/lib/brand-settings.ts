import fs from "fs";
import path from "path";
import { createAdminClient, createClient as createServerSupabase } from "@/lib/supabase/server";

export interface BrandSettings {
  logoUrl?: string | null;
  brandName?: string;
  useCustomLogo?: boolean;
  updatedAt?: string;
}

const DEFAULT_BRAND_SETTINGS: BrandSettings = {
  logoUrl: "/logo.png",
  brandName: "Abdullah",
  useCustomLogo: true, // Default to true if user has logo.png
};

function getSettingsFilePath(): string {
  return path.join(process.cwd(), "public", "settings", "brand.json");
}

let memoryBrandSettings: BrandSettings = { ...DEFAULT_BRAND_SETTINGS };

async function getSupabaseClient() {
  const adminClient = createAdminClient();
  if (adminClient) return adminClient;
  try {
    return await createServerSupabase();
  } catch {
    return null;
  }
}

export async function getBrandSettings(): Promise<BrandSettings> {
  // 1. Check local file if not on Vercel
  const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  if (!isVercel) {
    try {
      const filePath = getSettingsFilePath();
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(data);
        memoryBrandSettings = { ...DEFAULT_BRAND_SETTINGS, ...parsed };
        return memoryBrandSettings;
      }
    } catch (err) {
      console.error("Failed to read brand settings file:", err);
    }
  }

  // 2. Try loading from Supabase profiles table
  try {
    const supabase = await getSupabaseClient();
    if (supabase) {
      const { data } = await supabase
        .from("profiles")
        .select("logo_url, full_name")
        .limit(1)
        .maybeSingle();

      if (data) {
        if (data.logo_url) {
          memoryBrandSettings.logoUrl = data.logo_url;
          memoryBrandSettings.useCustomLogo = true;
        }
        if (data.full_name) {
          memoryBrandSettings.brandName = data.full_name;
        }
      }
    }
  } catch {
    // Graceful fallback to memory/defaults
  }

  return memoryBrandSettings;
}

export async function saveBrandSettings(
  updates: Partial<BrandSettings>
): Promise<BrandSettings> {
  const updated: BrandSettings = {
    ...memoryBrandSettings,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  memoryBrandSettings = updated;

  // 1. Sync to Supabase profiles table (persistent across serverless instances)
  try {
    const supabase = await getSupabaseClient();
    if (supabase) {
      const dbLogoUrl = updated.useCustomLogo ? updated.logoUrl : null;
      await supabase
        .from("profiles")
        .update({
          logo_url: dbLogoUrl,
          updated_at: new Date().toISOString(),
        })
        .neq("id", "00000000-0000-0000-0000-000000000000");
    }
  } catch (dbErr) {
    console.warn("Could not sync brand to profiles table:", dbErr);
  }

  // 2. Write to local file only when NOT on Vercel
  const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  if (!isVercel) {
    try {
      const settingsDir = path.join(process.cwd(), "public", "settings");
      if (!fs.existsSync(settingsDir)) {
        fs.mkdirSync(settingsDir, { recursive: true });
      }
      const filePath = getSettingsFilePath();
      fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");
    } catch (err) {
      console.warn("Local filesystem brand write warning:", err);
    }
  }

  return updated;
}
