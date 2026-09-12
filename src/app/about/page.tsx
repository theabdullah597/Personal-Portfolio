import {
  getProfile,
  getEducation,
  getExperiences,
  getSocialLinks,
} from "@/lib/supabase/data-service";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Badge } from "@/components/ui/badge";
import {
  User,
  GraduationCap,
  Briefcase,
  MapPin,
  Calendar,
  Sparkles,
  FileText,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const revalidate = 60;

export default async function AboutPage() {
  const [profile, education, experiences] = await Promise.all([
    getProfile(),
    getEducation(),
    getExperiences(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-warm-canvas text-foreground">
      <PublicNavbar
        resumeUrl={profile.resume_url}
        availableForHire={profile.available_for_hire}
      />

      <main className="flex-1 pt-36 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-16">
          {/* Header & Bio Summary */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl overflow-hidden border-2 border-border/80 bg-card shrink-0 shadow-soft-lg relative">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted/60">
                  <User className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="space-y-5 text-center md:text-left flex-1">
              <div className="space-y-2">
                <Badge variant="default" className="text-xs rounded-full px-3 py-1 bg-primary/10 text-primary border border-primary/20">
                  About Me
                </Badge>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                  {profile.full_name}
                </h1>
                <p className="text-lg sm:text-xl font-semibold text-primary">
                  {profile.headline}
                </p>
                {profile.location && (
                  <p className="text-xs text-muted-foreground flex items-center justify-center md:justify-start gap-1.5 pt-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {profile.location}
                  </p>
                )}
              </div>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line font-normal">
                {profile.bio}
              </p>

              {profile.career_focus && (
                <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-soft text-xs text-muted-foreground">
                  <span className="font-bold text-foreground block mb-1 text-sm">
                    Core Technical Focus:
                  </span>
                  {profile.career_focus}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                {profile.resume_url && (
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" variant="outline" className="gap-2 rounded-full h-10 px-5 border-border/80 hover:bg-card">
                      <FileText className="w-3.5 h-3.5 text-primary" />
                      Download Resume
                    </Button>
                  </a>
                )}
                <Link href="/contact">
                  <Button size="sm" className="gap-2 rounded-full h-10 px-6 shadow-soft">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="space-y-6 pt-8 border-t border-border/60">
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Education & Qualifications
              </h2>
            </div>

            <div className="space-y-4">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="p-6 rounded-3xl border border-border/80 bg-card shadow-soft space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-lg font-bold text-foreground">
                      {edu.degree} in {edu.field}
                    </h3>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      {formatDate(edu.start_date)} —{" "}
                      {edu.currently_studying ? "Present" : formatDate(edu.end_date)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-primary">
                    {edu.institution}
                  </p>
                  {edu.description && (
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1 font-normal">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
