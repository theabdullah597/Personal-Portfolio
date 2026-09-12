import { getProjects } from "@/lib/supabase/data-service";
import { ProjectsTable } from "@/components/admin/projects-table";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Project Showcase Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Create, edit, feature, and publish your engineering projects and case studies.
        </p>
      </div>

      <ProjectsTable initialProjects={projects} />
    </div>
  );
}
