import { getExperiences } from "@/lib/supabase/data-service";
import { ExperienceManager } from "@/components/admin/experience-manager";

export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  const experiences = await getExperiences();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Work Experience Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your career timeline, professional roles, responsibilities, and technologies used.
        </p>
      </div>

      <ExperienceManager initialExperiences={experiences} />
    </div>
  );
}
