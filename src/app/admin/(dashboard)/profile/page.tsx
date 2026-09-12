import { getProfile } from "@/lib/supabase/data-service";
import { ProfileForm } from "@/components/admin/profile-form";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const profile = await getProfile();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Profile & Bio Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal biography, contact information, metrics, and public resume.
        </p>
      </div>

      <ProfileForm initialProfile={profile} />
    </div>
  );
}
