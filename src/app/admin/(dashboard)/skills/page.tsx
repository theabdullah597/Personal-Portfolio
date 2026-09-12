import { getSkills } from "@/lib/supabase/data-service";
import { SkillsManager } from "@/components/admin/skills-manager";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const skills = await getSkills();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Technical Skills Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Organize programming languages, frameworks, cloud tooling, and machine learning competencies.
        </p>
      </div>

      <SkillsManager initialSkills={skills} />
    </div>
  );
}
