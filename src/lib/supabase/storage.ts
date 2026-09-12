import { createClient } from "./client";

export const STORAGE_BUCKET_MEDIA = "portfolio-media";
export const STORAGE_BUCKET_DOCS = "portfolio-documents";

export async function uploadFile(
  file: File,
  bucket: string = STORAGE_BUCKET_MEDIA,
  folder: string = "uploads"
): Promise<{ url: string | null; error: string | null }> {
  // 1. Try server-side upload route (/api/upload)
  // Handles authentication, service role key bypass, and Base64 image fallback
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", bucket);
    formData.append("folder", folder);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.url) {
        return { url: data.url, error: null };
      }
      if (data.error) {
        return { url: null, error: data.error };
      }
    }
  } catch (apiErr) {
    console.warn("API upload route attempt error, falling back to direct client:", apiErr);
  }

  // 2. Direct browser-to-Supabase upload fallback
  try {
    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return { url: data.publicUrl, error: null };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to upload file";
    return { url: null, error: errorMsg };
  }
}
