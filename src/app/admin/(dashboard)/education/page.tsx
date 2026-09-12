import { getEducation } from "@/lib/supabase/data-service";
import { EducationManager } from "@/components/admin/education-manager";

export const dynamic = "force-dynamic";

export default async function AdminEducationPage() {
  const education = await getEducation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Education & Qualifications Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage academic degrees, institutions, fields of study, and academic achievements.
        </p>
      </div>

      <EducationManager initialEducation={education} />
    </div>
  );
}
