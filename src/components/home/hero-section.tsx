"use client";

import Link from "next/link";
import { ArrowRight, FileText, Code2, ExternalLink, Sparkles, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Profile, SocialLink } from "@/types";
import { Hero3DWrapper } from "./hero-3d-wrapper";
import { Magnetic } from "@/components/animations/magnetic";
import { FadeIn } from "@/components/animations/fade-in";

interface HeroSectionProps {
  profile: Profile;
  socialLinks: SocialLink[];
}

export function HeroSection({ profile, socialLinks }: HeroSectionProps) {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-32 pb-20 overflow-hidden">
      {/* Subtle warm ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        {/* Left Column: Hero Content */}
        <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
          {/* Status Badge */}
          <FadeIn delay={0.1} direction="down">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-primary/25 bg-primary/10 text-primary text-xs font-semibold backdrop-blur-md shadow-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>{profile.career_focus || "AI/ML Engineer & Full Stack Developer"}</span>
            </div>
          </FadeIn>

          {/* Heading */}
          <FadeIn delay={0.2} direction="up">
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.08]">
                Hi, I&apos;m{" "}
                <span className="text-primary font-black">
                  {profile.full_name || "Abdullah"}
                </span>
                .
              </h1>
              <p className="text-lg sm:text-2xl font-semibold text-foreground/85 tracking-tight">
                {profile.headline || "Full-Stack Software Engineer & AI Systems Architect"}
              </p>
            </div>
          </FadeIn>

          {/* Bio text */}
          <FadeIn delay={0.3} direction="up">
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              {profile.bio || "Passionate about engineering elegant, intelligent software systems and creative digital experiences that bridge cutting-edge AI and intuitive web design."}
            </p>
          </FadeIn>

          {/* Call to Actions */}
          <FadeIn delay={0.4} direction="up">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Magnetic strength={10}>
                <Link href="/projects">
                  <Button size="lg" className="h-12 px-7 rounded-full font-medium gap-2 shadow-soft hover:shadow-soft-lg transition-all">
                    View My Work
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </Magnetic>

              <Link href="/contact">
                <Button size="lg" variant="outline" className="h-12 px-7 rounded-full font-medium border-border/80 hover:bg-card">
                  Get In Touch
                </Button>
              </Link>

              {profile.resume_url && (
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-12 px-5 rounded-full border border-border/80 bg-card/70 hover:bg-card hover:border-primary/50 text-xs font-semibold text-foreground transition-all shadow-xs"
                >
                  <FileText className="w-4 h-4 text-primary" />
                  Resume
                </a>
              )}
            </div>
          </FadeIn>

          {/* Social Links and Quick Metrics */}
          <FadeIn delay={0.5} direction="up">
            <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <div className="flex items-center gap-2">
                {socialLinks.filter((s) => s.is_active).map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full border border-border/70 bg-card/70 hover:border-primary hover:text-primary text-muted-foreground transition-all shadow-xs"
                    title={link.platform}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ))}
              </div>

              <div className="h-6 w-px bg-border/80 hidden sm:block" />

              <div className="flex items-center gap-8 text-xs text-muted-foreground">
                <div>
                  <span className="text-xl font-bold text-foreground font-sans block leading-tight">
                    {profile.years_experience || 4}+
                  </span>
                  <span className="font-medium">Years Experience</span>
                </div>
                <div>
                  <span className="text-xl font-bold text-foreground font-sans block leading-tight">
                    {profile.completed_projects || 20}+
                  </span>
                  <span className="font-medium">Projects Shipped</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Right Column: 3D Developer Workspace */}
        <FadeIn delay={0.3} direction="left" scale className="lg:col-span-5 flex items-center justify-center relative">
          <div
            id="hero-3d-container"
            className="w-full aspect-square max-w-[460px] rounded-3xl border border-border/70 bg-card/60 backdrop-blur-xl p-3 shadow-soft-lg relative flex items-center justify-center overflow-hidden group"
          >
            <Hero3DWrapper />
            {/* Subtle decorative warm corner tag */}
            <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border/70 text-[11px] font-mono font-medium text-muted-foreground pointer-events-none flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Interactive 3D Workspace</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
