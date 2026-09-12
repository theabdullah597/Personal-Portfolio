import Link from "next/link";
import {
  FolderGit2,
  CheckCircle2,
  FileEdit,
  Wrench,
  Briefcase,
  Mail,
  ArrowRight,
  PlusCircle,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getDashboardStats,
  getProjects,
  getContactMessages,
  getProfile,
} from "@/lib/supabase/data-service";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, projects, messages, profile] = await Promise.all([
    getDashboardStats(),
    getProjects(),
    getContactMessages(),
    getProfile(),
  ]);

  const recentProjects = projects.slice(0, 4);
  const recentMessages = messages.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-card border border-border/80 relative overflow-hidden shadow-sm">
        <div className="space-y-1 relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {profile.full_name || "Admin"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your personal portfolio content, track live inquiries, and publish projects dynamically.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link href="/admin/projects">
            <Button size="sm" className="gap-1.5 shadow-sm">
              <PlusCircle className="w-4 h-4" />
              Add Project
            </Button>
          </Link>
          <Link href="/" target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline" className="gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" />
              Live Site
            </Button>
          </Link>
        </div>

        {/* Ambient glow accent */}
        <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Projects</span>
            <FolderGit2 className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-foreground">{stats.totalProjects}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Total created</p>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Published</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-emerald-500">{stats.publishedProjects}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Live on portfolio</p>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Drafts</span>
            <FileEdit className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-foreground">{stats.draftProjects}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Unpublished</p>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Experience</span>
            <Briefcase className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-foreground">{stats.totalExperiences}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Career milestones</p>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Skills</span>
            <Wrench className="w-4 h-4 text-violet-500" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-foreground">{stats.totalSkills}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Categorized</p>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Inquiries</span>
            <Mail className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-foreground">{stats.unreadMessages}</p>
              {stats.unreadMessages > 0 && (
                <span className="text-[11px] font-semibold text-rose-500">Unread</span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {stats.totalMessages} total
            </p>
          </div>
        </Card>
      </div>

      {/* Main Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects Preview Column */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>
                Overview of latest portfolio projects and their live status
              </CardDescription>
            </div>
            <Link href="/admin/projects">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No projects created yet.
              </p>
            ) : (
              recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-card/50 hover:bg-card hover:border-border transition-all"
                >
                  <div className="space-y-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold text-foreground truncate">
                        {project.title}
                      </h4>
                      {project.featured && (
                        <Badge variant="cyan" className="text-[10px] py-0 px-2">
                          Featured
                        </Badge>
                      )}
                      <Badge
                        variant={project.published ? "emerald" : "secondary"}
                        className="text-[10px] py-0 px-2"
                      >
                        {project.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate max-w-md">
                      {project.short_description}
                    </p>
                  </div>

                  <Link href={`/admin/projects`}>
                    <Button variant="outline" size="sm" className="h-8 text-xs shrink-0">
                      Manage
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Inquiries / Messages Column */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>Direct inquiries from visitors</CardDescription>
            </div>
            <Link href="/admin/messages">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentMessages.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No inquiries received yet.
              </p>
            ) : (
              recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-3 rounded-xl border border-border/60 bg-card/50 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">
                      {msg.name}
                    </span>
                    {!msg.is_read ? (
                      <span className="h-2 w-2 rounded-full bg-cyan-500" title="Unread" />
                    ) : (
                      <span className="text-[10px] text-muted-foreground">
                        {formatDate(msg.created_at)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-muted-foreground truncate">
                    {msg.subject}
                  </p>
                  <p className="text-xs text-muted-foreground/80 line-clamp-2">
                    {msg.message}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
