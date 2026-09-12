import {
  getProfile,
  getProjects,
  getSkills,
  getExperiences,
  getServices,
  getSocialLinks,
} from "@/lib/supabase/data-service";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedProjectsSection } from "@/components/home/featured-projects-section";
import { SkillsOverviewSection } from "@/components/home/skills-overview-section";
import { ExperienceTimelineSection } from "@/components/home/experience-timeline-section";
import { ServicesSection } from "@/components/home/services-section";
import { ContactSection } from "@/components/home/contact-section";

export const revalidate = 60; // Incremental Static Regeneration every 60s or on-demand via server actions

export default async function HomePage() {
  const [profile, projects, skills, experiences, services, socialLinks] =
    await Promise.all([
      getProfile(),
      getProjects({ publishedOnly: true }),
      getSkills(),
      getExperiences(),
      getServices(true),
      getSocialLinks(),
    ]);

  return (
    <div className="min-h-screen flex flex-col bg-warm-canvas text-foreground selection:bg-primary/20 selection:text-primary">
      <PublicNavbar
        resumeUrl={profile.resume_url}
        availableForHire={profile.available_for_hire}
      />

      <main className="flex-1">
        <HeroSection profile={profile} socialLinks={socialLinks} />
        <FeaturedProjectsSection projects={projects} />
        <SkillsOverviewSection skills={skills} />
        <ExperienceTimelineSection experiences={experiences} />
        <ServicesSection services={services} />
        <ContactSection profile={profile} />
      </main>

      <PublicFooter />
    </div>
  );
}
