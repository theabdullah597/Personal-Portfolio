import { NextResponse, type NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { isRequestAdminAuthenticated } from "@/lib/auth-session";
import { createAdminClient } from "@/lib/supabase/server";

const ALLOWED_EXTENSIONS = new Set([
  ".pdf",
  ".doc",
  ".docx",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".svg",
  ".gif",
]);

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

function getSupabaseClient() {
  // 1. Try admin client with service role key (bypasses RLS completely)
  const adminClient = createAdminClient();
  if (adminClient) return adminClient;

  // 2. Fall back to standard server client with anon key
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (url && anonKey && !url.includes("placeholder-project")) {
    return createSupabaseClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Verify admin authentication
    const auth = await isRequestAdminAuthenticated(request);
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in as admin." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const requestedBucket = formData.get("bucket") as string | null;
    const requestedFolder = formData.get("folder") as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File size exceeds 15MB limit." },
        { status: 400 }
      );
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file type (${ext}). Allowed: PDF, DOC, DOCX, PNG, JPG, WEBP, SVG.`,
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const isDocument = [".pdf", ".doc", ".docx"].includes(ext);
    const targetBucket =
      requestedBucket || (isDocument ? "portfolio-documents" : "portfolio-media");
    const targetFolder = requestedFolder || (isDocument ? "resumes" : "uploads");

    const rawBase = path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .toLowerCase();
    const uniqueFilename = `${Date.now()}-${rawBase}${ext}`;
    const storagePath = `${targetFolder}/${uniqueFilename}`;

    // 2. Upload to Supabase Storage (Persistent Cloud Storage)
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error: uploadError } = await supabase.storage
          .from(targetBucket)
          .upload(storagePath, buffer, {
            contentType: file.type || (isDocument ? "application/pdf" : "image/jpeg"),
            upsert: true,
          });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from(targetBucket)
            .getPublicUrl(storagePath);

          if (urlData?.publicUrl) {
            return NextResponse.json({
              success: true,
              url: urlData.publicUrl,
              filename: file.name,
              size: file.size,
              storage: "supabase",
            });
          }
        } else {
          console.warn("Supabase Storage upload warning:", uploadError.message);
        }
      } catch (storageErr) {
        console.warn("Supabase Storage attempt exception:", storageErr);
      }
    }

    // 3. Image Fallback: Base64 Data URL (for Avatars, Logos, Thumbnails <= 3MB)
    // Works reliably everywhere without read-only filesystem errors or RLS blockers
    if (!isDocument && file.size <= 3 * 1024 * 1024) {
      const mimeType =
        file.type ||
        (ext === ".png"
          ? "image/png"
          : ext === ".svg"
          ? "image/svg+xml"
          : ext === ".webp"
          ? "image/webp"
          : "image/jpeg");
      const base64Data = buffer.toString("base64");
      const dataUrl = `data:${mimeType};base64,${base64Data}`;

      return NextResponse.json({
        success: true,
        url: dataUrl,
        filename: file.name,
        size: file.size,
        storage: "base64",
      });
    }

    // 4. Local Development Fallback: write to public/uploads (ONLY when not on Vercel)
    const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
    if (!isVercel) {
      try {
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const localPath = path.join(uploadsDir, uniqueFilename);
        fs.writeFileSync(localPath, buffer);
        const publicUrl = `/uploads/${uniqueFilename}`;

        return NextResponse.json({
          success: true,
          url: publicUrl,
          filename: file.name,
          size: file.size,
          storage: "local",
        });
      } catch (fsErr) {
        console.warn("Local filesystem write failed:", fsErr);
      }
    }

    // 5. On Vercel / Production: Return clear actionable error if Supabase Storage is blocked
    return NextResponse.json(
      {
        success: false,
        error:
          "Upload blocked by Supabase Storage RLS. Please run 'supabase/fix-rls-permissions.sql' in Supabase SQL Editor or set SUPABASE_SERVICE_ROLE_KEY in your Vercel Environment Variables.",
      },
      { status: 500 }
    );
  } catch (err: unknown) {
    console.error("File upload error:", err);
    const message = err instanceof Error ? err.message : "Failed to upload file";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
