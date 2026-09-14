import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Code2,
  Calendar,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getProjectBySlug, getProjects, getProfile } from "@/lib/supabase/data-service";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} — Case Study & Architecture`,
    description: project.short_description,
    openGraph: {
      title: project.title,
      description: project.short_description,
      images: [
        {
          url: project.image_url,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [project, allProjects, profile] = await Promise.all([
    getProjectBySlug(slug),
    getProjects({ publishedOnly: true }),
    getProfile(),
  ]);

  if (!project) {
    notFound();
  }

  // Calculate Previous and Next Project navigation
  const currentIndex = allProjects.findIndex(
    (p) =>
      p.slug === project.slug ||
      p.slug.toLowerCase() === project.slug.toLowerCase() ||
      p.id === project.id
  );
  const prevProject =
    currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex >= 0 && currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-warm-canvas text-foreground">
      <PublicNavbar
        resumeUrl={profile.resume_url}
        availableForHire={profile.available_for_hire}
      />

      <main className="flex-1 pt-36 pb-24">
        <article className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
          {/* Breadcrumbs & Back link */}
          <div className="flex items-center justify-between">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group px-3.5 py-1.5 rounded-full bg-card border border-border/80 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              Back to Projects
            </Link>

            <Badge variant="default" className="text-xs rounded-full px-3.5 py-1 bg-primary/10 text-primary border border-primary/20">
              {project.category}
            </Badge>
          </div>

          {/* Project Header */}
          <header className="space-y-4 max-w-3xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.08]">
              {project.title}
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground leading-relaxed font-normal">
              {project.short_description}
            </p>

            {/* Action buttons (Live Demo & GitHub Repo) */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" className="gap-2 rounded-full h-11 px-6 font-semibold shadow-soft hover:shadow-soft-lg">
                    <ExternalLink className="w-4 h-4" />
                    Launch Live Demo
                  </Button>
                </a>
              )}

              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="outline" className="gap-2 rounded-full h-11 px-6 font-semibold border-border/80 hover:bg-card">
                    <Code2 className="w-4 h-4" />
                    Source Code Repository
                  </Button>
                </a>
              )}
            </div>
          </header>

          {/* Main Cover Image Banner */}
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-border/80 bg-card shadow-soft-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Technical Specifications & Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-7 rounded-3xl border border-border/80 bg-card shadow-soft">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Category
              </span>
              <p className="text-base font-bold text-foreground">{project.category}</p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Technology Stack
              </span>
              <div className="flex flex-wrap gap-2 pt-0.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full text-xs bg-muted/70 text-foreground/85 font-medium border border-border/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Metrics Callout Section */}
          {project.metrics && Object.keys(project.metrics).length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Performance & Key Metrics
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.entries(project.metrics).map(([key, value]) => (
                  <div
                    key={key}
                    className="p-5 rounded-2xl border border-border/80 bg-card shadow-soft space-y-1.5"
                  >
                    <span className="text-xs text-muted-foreground block truncate font-medium">
                      {key}
                    </span>
                    <p className="text-2xl font-bold text-primary font-mono">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Technical Architecture & Description */}
          <section className="space-y-4 pt-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Architecture & Implementation Details
            </h2>
            <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line text-sm sm:text-base font-normal">
              {project.full_description}
            </div>
          </section>

          {/* Gallery Showcase */}
          {project.gallery_urls && project.gallery_urls.length > 0 && (
            <section className="space-y-4 pt-6">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Project Gallery
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.gallery_urls.map((url, idx) => (
                  <div
                    key={idx}
                    className="aspect-video rounded-3xl overflow-hidden border border-border/80 bg-muted/60 group shadow-soft"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`${project.title} screenshot ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Navigation between Previous and Next Project */}
          <nav
            aria-label="Project Navigation"
            className="pt-12 border-t border-border/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4"
          >
            {prevProject ? (
              <Link
                href={`/projects/${prevProject.slug}`}
                className="group p-5 rounded-3xl border border-border/80 bg-card hover:border-primary/50 transition-all shadow-soft flex items-center gap-3.5 flex-1"
              >
                <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="text-left">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-semibold">
                    Previous Project
                  </span>
                  <p className="text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {prevProject.title}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="flex-1 hidden sm:block" />
            )}

            {nextProject && (
              <Link
                href={`/projects/${nextProject.slug}`}
                className="group p-5 rounded-3xl border border-border/80 bg-card hover:border-primary/50 transition-all shadow-soft flex items-center justify-end gap-3.5 text-right flex-1"
              >
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-semibold">
                    Next Project
                  </span>
                  <p className="text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {nextProject.title}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            )}
          </nav>
        </article>
      </main>

      <PublicFooter />
    </div>
  );
}
