"use client";

import * as React from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  Star,
  FolderGit2,
  Filter,
} from "lucide-react";
import { Project } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { ProjectEditorModal } from "./project-editor-modal";
import {
  deleteProjectAction,
  toggleProjectPublishAction,
  toggleProjectFeaturedAction,
} from "@/actions/projects";

interface ProjectsTableProps {
  initialProjects: Project[];
}

export function ProjectsTable({ initialProjects }: ProjectsTableProps) {
  const { showToast } = useToast();
  const [projects, setProjects] = React.useState<Project[]>(initialProjects);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");

  // Modal states
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<Project | null>(null);

  const [deleteCandidate, setDeleteCandidate] = React.useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const categories = React.useMemo(() => {
    const cats = new Set(projects.map((p) => p.category));
    return ["All", ...Array.from(cats)];
  }, [projects]);

  const filteredProjects = React.useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.technologies.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, selectedCategory]);

  const handleOpenCreate = () => {
    setEditingProject(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setIsEditorOpen(true);
  };

  const handleTogglePublish = async (project: Project) => {
    const nextState = !project.published;
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, published: nextState } : p))
    );
    const res = await toggleProjectPublishAction(project.id, nextState);
    if (!res.success) {
      // rollback
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, published: project.published } : p))
      );
      showToast({
        type: "error",
        title: "Update Failed",
        message: res.error || "Failed to update project status.",
      });
    } else {
      showToast({
        type: "success",
        title: nextState ? "Project Published" : "Moved to Draft",
        message: `${project.title} is now ${nextState ? "visible" : "hidden"} on the public website.`,
      });
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    const nextState = !project.featured;
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, featured: nextState } : p))
    );
    const res = await toggleProjectFeaturedAction(project.id, nextState);
    if (!res.success) {
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, featured: project.featured } : p))
      );
      showToast({
        type: "error",
        title: "Update Failed",
        message: res.error || "Failed to update featured status.",
      });
    } else {
      showToast({
        type: "info",
        title: "Featured Status Updated",
        message: `${project.title} featured status updated.`,
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      const res = await deleteProjectAction(deleteCandidate.id);
      if (res.success) {
        setProjects((prev) => prev.filter((p) => p.id !== deleteCandidate.id));
        showToast({
          type: "success",
          title: "Project Deleted",
          message: `${deleteCandidate.title} has been permanently deleted.`,
        });
        setDeleteCandidate(null);
      } else {
        showToast({
          type: "error",
          title: "Delete Failed",
          message: res.error || "Could not delete project.",
        });
      }
    } catch {
      showToast({
        type: "error",
        title: "Error",
        message: "An unexpected error occurred.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar: Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3 pointer-events-none" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, stack, or keywords..."
              className="pl-9 h-10"
            />
          </div>

          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 rounded-xl border border-border/70 bg-card px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button onClick={handleOpenCreate} className="gap-1.5 shadow-sm shrink-0">
          <Plus className="w-4 h-4" />
          Add Project
        </Button>
      </div>

      {/* Projects List View */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/40">
          <FolderGit2 className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-semibold text-foreground">No projects found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {searchQuery
              ? "Try adjusting your search query or filter."
              : "Get started by publishing your first project."}
          </p>
          {!searchQuery && (
            <Button onClick={handleOpenCreate} size="sm" className="mt-4 gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Create Project
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-border/70 bg-card hover:border-border transition-all duration-200 gap-4 shadow-sm"
            >
              {/* Project info & Thumbnail */}
              <div className="flex items-start sm:items-center gap-4 min-w-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-border/80 bg-muted shrink-0 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image_url || "/placeholder-project.png"}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-semibold text-foreground truncate">
                      {project.title}
                    </h3>
                    <Badge variant="outline" className="text-[10px] py-0">
                      {project.category}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-1 max-w-xl">
                    {project.short_description}
                  </p>

                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md text-[10px] bg-accent/60 text-muted-foreground font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-[10px] text-muted-foreground">
                        +{project.technologies.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50 shrink-0">
                {/* Featured Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleFeatured(project)}
                  title={project.featured ? "Featured on Home" : "Make Featured"}
                  className={`p-2 rounded-lg border transition-colors ${
                    project.featured
                      ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                      : "border-border/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Star className="w-4 h-4 fill-current" />
                </button>

                {/* Published Toggle */}
                <button
                  type="button"
                  onClick={() => handleTogglePublish(project)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    project.published
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border-zinc-500/30 bg-zinc-500/10 text-zinc-400"
                  }`}
                >
                  {project.published ? "Published" : "Draft"}
                </button>

                {/* Preview Public Page */}
                <Link
                  href={`/projects/${project.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  title="Preview Live Page"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => handleOpenEdit(project)}
                  className="p-2 rounded-lg border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors"
                  title="Edit Project"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => setDeleteCandidate(project)}
                  className="p-2 rounded-lg border border-border/60 text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/5 transition-colors"
                  title="Delete Project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Editor Modal */}
      <ProjectEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        project={editingProject}
        onSaved={() => {
          // If in local state, update or refetch
          window.location.reload();
        }}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        title="Confirm Project Deletion"
        description="Are you sure you want to delete this project? This action will remove it from your portfolio."
        maxWidth="sm"
      >
        <div className="space-y-4 pt-2">
          {deleteCandidate && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-foreground font-medium">
              Project: <span className="font-bold">{deleteCandidate.title}</span> (
              {deleteCandidate.slug})
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteCandidate(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Permanently"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
