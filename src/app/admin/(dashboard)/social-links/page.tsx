import { getSocialLinks } from "@/lib/supabase/data-service";
import { SocialLinksManager } from "@/components/admin/social-links-manager";

export const dynamic = "force-dynamic";

export default async function AdminSocialLinksPage() {
  const links = await getSocialLinks();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Social Links & Professional Networks
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your GitHub, LinkedIn, Twitter, and other public communication channels.
        </p>
      </div>

      <SocialLinksManager initialLinks={links} />
    </div>
  );
}
