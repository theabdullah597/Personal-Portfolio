import fs from "fs";
import path from "path";

const CONFIG_FILE = path.join(process.cwd(), "data", "admin-config.json");

export interface AdminConfig {
  email?: string;
  passwordHash?: string;
  salt?: string;
  updatedAt?: string;
}

export function getAdminConfig(): AdminConfig | null {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const raw = fs.readFileSync(CONFIG_FILE, "utf8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error reading admin config:", err);
  }
  return null;
}

export async function hashPasswordWithSalt(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt"]
  );
  const exported = await crypto.subtle.exportKey("raw", key);
  return Array.from(new Uint8Array(exported))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const config = getAdminConfig();
  if (config?.passwordHash && config?.salt) {
    const computed = await hashPasswordWithSalt(password, config.salt);
    return computed === config.passwordHash;
  }

  // Fallback to configured or default password
  const defaultPassword = process.env.ADMIN_PASSWORD || "developer123";
  return password === defaultPassword;
}

export async function saveAdminPassword(newPassword: string, email?: string): Promise<boolean> {
  try {
    const dir = path.dirname(CONFIG_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Generate random 16-byte salt
    const randomBytes = new Uint8Array(16);
    crypto.getRandomValues(randomBytes);
    const salt = Array.from(randomBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const passwordHash = await hashPasswordWithSalt(newPassword, salt);
    const existing = getAdminConfig() || {};

    const updated: AdminConfig = {
      ...existing,
      email: email || existing.email || process.env.ADMIN_EMAIL || "admin@portfolio.dev",
      passwordHash,
      salt,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Failed to save admin password:", err);
    return false;
  }
}
