import { getProjects, getProfile } from "@/lib/supabase/data-service";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { PublicProjectsExplorer } from "@/components/projects/public-projects-explorer";
import { Badge } from "@/components/ui/badge";
import { FolderGit2 } from "lucide-react";

export const revalidate = 60;

export const metadata = {
  title: "Projects & Engineering Case Studies",
  description:
    "Explore full-stack web applications, AI research engines, computer vision systems, and high-performance backend platforms.",
};

export default async function ProjectsPage() {
  const [projects, profile] = await Promise.all([
    getProjects({ publishedOnly: true }),
    getProfile(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-warm-canvas text-foreground">
      <PublicNavbar
        resumeUrl={profile.resume_url}
        availableForHire={profile.available_for_hire}
      />

      <main className="flex-1 pt-36 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="space-y-3 text-center sm:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
              <FolderGit2 className="w-3.5 h-3.5" />
              Portfolio Showcase
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Projects & Engineering Work
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Explore production applications, generative AI copilot architectures, distributed task engines, and technical experiments.
            </p>
          </div>

          <PublicProjectsExplorer initialProjects={projects} />
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
