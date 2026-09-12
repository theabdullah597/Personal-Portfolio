import { createClient } from "./client";

export const STORAGE_BUCKET_MEDIA = "portfolio-media";
export const STORAGE_BUCKET_DOCS = "portfolio-documents";

export async function uploadFile(
  file: File,
  bucket: string = STORAGE_BUCKET_MEDIA,
  folder: string = "uploads"
): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
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
