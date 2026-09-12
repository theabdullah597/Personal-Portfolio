import { getSkills, getProfile } from "@/lib/supabase/data-service";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Wrench } from "lucide-react";
import { SkillIcon } from "@/components/ui/skill-icon";

export const revalidate = 60;

export const metadata = {
  title: "Skills & Technical Expertise",
  description:
    "Comprehensive technical skills matrix across programming languages, backend architecture, machine learning, and DevOps.",
};

export default async function SkillsPage() {
  const [skills, profile] = await Promise.all([getSkills(), getProfile()]);

  // Group by category
  const grouped = skills.reduce((acc, skill) => {
    const cat = skill.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <div className="min-h-screen flex flex-col bg-warm-canvas text-foreground">
      <PublicNavbar
        resumeUrl={profile.resume_url}
        availableForHire={profile.available_for_hire}
      />

      <main className="flex-1 pt-36 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-14">
          <div className="space-y-3 text-center sm:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
              <Wrench className="w-3.5 h-3.5" />
              Technical Matrix
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Skills & Engineering Tooling
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed font-normal">
              Curated overview of languages, frameworks, vector stores, distributed platforms, and cloud tooling used daily in production systems.
            </p>
          </div>

          <div className="space-y-14">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="space-y-5">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    {category}
                  </h2>
                  <div className="h-px flex-1 bg-border/60" />
                  <span className="text-xs text-muted-foreground font-mono font-medium">
                    {items.length} skills
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {items.map((skill) => (
                    <div
                      key={skill.id}
                      className="p-5 rounded-3xl border border-border/80 bg-card hover:border-primary/50 transition-all duration-300 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 space-y-3"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 shadow-xs">
                          <SkillIcon name={skill.icon} className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-bold text-foreground truncate">
                            {skill.name}
                          </h3>
                          {skill.description && (
                            <p className="text-xs text-muted-foreground truncate font-normal">
                              {skill.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="font-medium">Proficiency</span>
                          <span className="font-mono font-bold text-primary">{skill.proficiency ?? 80}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-primary rounded-full transition-all duration-500"
                            style={{ width: `${skill.proficiency ?? 80}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
