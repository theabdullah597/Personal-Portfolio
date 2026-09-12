import fs from "fs";
import path from "path";

export interface BrandSettings {
  logoUrl?: string | null;
  brandName?: string;
  useCustomLogo?: boolean;
  updatedAt?: string;
}

const DEFAULT_BRAND_SETTINGS: BrandSettings = {
  logoUrl: null,
  brandName: "Abdullah",
  useCustomLogo: false,
};

function getSettingsFilePath(): string {
  return path.join(process.cwd(), "public", "settings", "brand.json");
}

let memoryBrandSettings: BrandSettings = { ...DEFAULT_BRAND_SETTINGS };

export async function getBrandSettings(): Promise<BrandSettings> {
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
  return memoryBrandSettings;
}

export async function saveBrandSettings(
  updates: Partial<BrandSettings>
): Promise<BrandSettings> {
  try {
    const settingsDir = path.join(process.cwd(), "public", "settings");
    if (!fs.existsSync(settingsDir)) {
      fs.mkdirSync(settingsDir, { recursive: true });
    }

    const current = await getBrandSettings();
    const updated: BrandSettings = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const filePath = getSettingsFilePath();
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");
    memoryBrandSettings = updated;
    return updated;
  } catch (err) {
    console.error("Failed to write brand settings file:", err);
    memoryBrandSettings = {
      ...memoryBrandSettings,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return memoryBrandSettings;
  }
}
