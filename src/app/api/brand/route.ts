import { NextResponse, type NextRequest } from "next/server";
import { getBrandSettings, saveBrandSettings } from "@/lib/brand-settings";
import { isRequestAdminAuthenticated } from "@/lib/auth-session";

export async function GET() {
  try {
    const settings = await getBrandSettings();
    return NextResponse.json({ success: true, settings });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load brand settings";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await isRequestAdminAuthenticated(request);
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in as admin." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { logoUrl, brandName, useCustomLogo } = body;

    const updated = await saveBrandSettings({
      logoUrl: logoUrl ?? null,
      brandName: brandName ?? "Abdullah",
      useCustomLogo: Boolean(useCustomLogo),
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update brand settings";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
