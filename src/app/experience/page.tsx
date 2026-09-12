import { getExperiences, getProfile } from "@/lib/supabase/data-service";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

export const metadata = {
  title: "Professional Work Experience & Career Timeline",
  description:
    "Explore career progression, roles, responsibilities, and key engineering accomplishments.",
};

export default async function ExperiencePage() {
  const [experiences, profile] = await Promise.all([
    getExperiences(),
    getProfile(),
  ]);

  const sorted = [...experiences].sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="min-h-screen flex flex-col bg-warm-canvas text-foreground">
      <PublicNavbar
        resumeUrl={profile.resume_url}
        availableForHire={profile.available_for_hire}
      />

      <main className="flex-1 pt-36 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-14">
          <div className="space-y-3 text-center sm:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
              <Briefcase className="w-3.5 h-3.5" />
              Career Journey
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Work Experience & Roles
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed font-normal">
              Timeline of software engineering roles, company impact, distributed infrastructure, and system deliveries.
            </p>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-primary/25 space-y-12 ml-2 sm:ml-4">
            {sorted.map((exp) => (
              <div key={exp.id} className="relative group">
                <div className="absolute -left-[33px] sm:-left-[41px] top-2 w-5 h-5 rounded-full border-2 border-primary bg-card flex items-center justify-center group-hover:scale-125 transition-transform shadow-xs">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>

                <div className="p-7 rounded-3xl border border-border/80 bg-card hover:border-primary/50 transition-all duration-300 shadow-soft hover:shadow-soft-lg space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl font-bold text-foreground">
                        {exp.role}
                      </h2>
                      <span className="text-sm text-muted-foreground">at</span>
                      <span className="text-lg font-bold text-primary">
                        {exp.company}
                      </span>
                      {exp.currently_working && (
                        <Badge variant="emerald" className="text-[11px] py-0.5 px-2.5 rounded-full font-semibold">
                          Current Role
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      {formatDate(exp.start_date)} —{" "}
                      {exp.currently_working ? "Present" : formatDate(exp.end_date)}
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        {exp.location}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line pt-1 font-normal">
                    {exp.description}
                  </p>

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {exp.technologies.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1 rounded-full text-xs bg-muted/70 text-foreground/85 font-medium border border-border/50"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
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
