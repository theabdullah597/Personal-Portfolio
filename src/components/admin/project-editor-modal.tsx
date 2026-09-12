"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  X,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  ExternalLink,
  GitBranch,
  Save,
} from "lucide-react";
import { Project, ProjectCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { saveProjectAction } from "@/actions/projects";
import { uploadFile } from "@/lib/supabase/storage";

const projectCategories: ProjectCategory[] = [
  "AI/ML",
  "Full Stack",
  "Web Development",
  "Computer Vision",
  "NLP",
  "Cloud & DevOps",
  "Other",
];

const projectSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required"),
  short_description: z.string().min(5, "Short description is required"),
  full_description: z.string().min(10, "Full description is required"),
  category: z.string(),
  image_url: z.string().min(1, "Main image is required"),
  github_url: z.string().optional().or(z.literal("")),
  live_url: z.string().optional().or(z.literal("")),
  featured: z.boolean(),
  published: z.boolean(),
  display_order: z.coerce.number().min(0),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  onSaved: () => void;
}

export function ProjectEditorModal({
  isOpen,
  onClose,
  project,
  onSaved,
}: ProjectEditorModalProps) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);

  // Dynamic lists
  const [technologies, setTechnologies] = React.useState<string[]>([]);
  const [techInput, setTechInput] = React.useState("");

  const [galleryUrls, setGalleryUrls] = React.useState<string[]>([]);
  const [galleryInput, setGalleryInput] = React.useState("");

  const [metrics, setMetrics] = React.useState<{ key: string; value: string }[]>([]);
  const [metricKey, setMetricKey] = React.useState("");
  const [metricVal, setMetricVal] = React.useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema) as any,
    defaultValues: {
      title: "",
      slug: "",
      short_description: "",
      full_description: "",
      category: "Full Stack",
      image_url: "",
      github_url: "",
      live_url: "",
      featured: false,
      published: true,
      display_order: 1,
    },
  });

  // Populate data when editing or creating
  React.useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        slug: project.slug,
        short_description: project.short_description,
        full_description: project.full_description,
        category: project.category,
        image_url: project.image_url,
        github_url: project.github_url || "",
        live_url: project.live_url || "",
        featured: project.featured,
        published: project.published,
        display_order: project.display_order,
      });
      setTechnologies(project.technologies || []);
      setGalleryUrls(project.gallery_urls || []);
      if (project.metrics) {
        setMetrics(
          Object.entries(project.metrics).map(([k, v]) => ({ key: k, value: v }))
        );
      } else {
        setMetrics([]);
      }
    } else {
      reset({
        title: "",
        slug: "",
        short_description: "",
        full_description: "",
        category: "Full Stack",
        image_url: "",
        github_url: "",
        live_url: "",
        featured: false,
        published: true,
        display_order: 1,
      });
      setTechnologies(["Next.js", "TypeScript"]);
      setGalleryUrls([]);
      setMetrics([]);
    }
  }, [project, reset]);

  if (!isOpen) return null;

  const generateSlug = () => {
    const titleVal = watch("title");
    if (!titleVal) return;
    const generated = titleVal
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setValue("slug", generated);
  };

  const handleAddTech = () => {
    if (!techInput.trim()) return;
    if (!technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()]);
    }
    setTechInput("");
  };

  const handleRemoveTech = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech));
  };

  const handleAddGalleryUrl = () => {
    if (!galleryInput.trim()) return;
    setGalleryUrls([...galleryUrls, galleryInput.trim()]);
    setGalleryInput("");
  };

  const handleRemoveGalleryUrl = (index: number) => {
    setGalleryUrls(galleryUrls.filter((_, i) => i !== index));
  };

  const handleAddMetric = () => {
    if (!metricKey.trim() || !metricVal.trim()) return;
    setMetrics([...metrics, { key: metricKey.trim(), value: metricVal.trim() }]);
    setMetricKey("");
    setMetricVal("");
  };

  const handleRemoveMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  const handleUploadMainImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await uploadFile(file, "portfolio-media", "projects");
      if (res.url) {
        setValue("image_url", res.url);
        showToast({
          type: "success",
          title: "Image Uploaded",
          message: "Project cover image uploaded to Supabase Storage.",
        });
      } else {
        showToast({
          type: "info",
          title: "Storage Ready",
          message: "Uploaded locally or paste direct URL.",
        });
      }
    } catch {
      showToast({
        type: "error",
        title: "Upload Failed",
        message: "Failed to upload file.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    if (technologies.length === 0) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "Please add at least one technology tag.",
      });
      return;
    }

    setIsSubmitting(true);

    const metricsObj: Record<string, string> = {};
    metrics.forEach((m) => {
      metricsObj[m.key] = m.value;
    });

    try {
      const payload: Partial<Project> = {
        id: project?.id,
        ...data,
        technologies,
        gallery_urls: galleryUrls,
        metrics: Object.keys(metricsObj).length > 0 ? metricsObj : null,
      };

      const res = await saveProjectAction(payload);
      if (res.success) {
        showToast({
          type: "success",
          title: "Project Saved",
          message: project ? "Project updated successfully." : "New project published!",
        });
        onSaved();
        onClose();
      } else {
        showToast({
          type: "error",
          title: "Save Failed",
          message: res.error || "Could not save project.",
        });
      }
    } catch {
      showToast({
        type: "error",
        title: "Error",
        message: "An unexpected error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="relative z-50 flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border/70 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {project ? "Edit Project" : "Create New Project"}
            </h2>
            <p className="text-xs text-muted-foreground">
              Configure project details, media assets, metrics, and live visibility.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
        >
          {/* Title and Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="title" required>
                Project Title
              </Label>
              <Input
                id="title"
                placeholder="e.g. AI Research Assistant"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="slug" required>
                  URL Slug
                </Label>
                <button
                  type="button"
                  onClick={generateSlug}
                  className="text-[11px] text-primary hover:underline font-medium inline-flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Auto Generate
                </button>
              </div>
              <Input
                id="slug"
                placeholder="e.g. ai-research-assistant"
                {...register("slug")}
              />
              {errors.slug && (
                <p className="text-xs text-destructive">{errors.slug.message}</p>
              )}
            </div>
          </div>

          {/* Category & Display Order */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="category" required>
                Category
              </Label>
              <select
                id="category"
                {...register("category")}
                className="flex h-10 w-full rounded-xl border border-border/70 bg-background/60 px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                {projectCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="display_order">Display Order (Sort Index)</Label>
              <Input
                id="display_order"
                type="number"
                min={0}
                {...register("display_order")}
              />
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-1.5">
            <Label htmlFor="short_description" required>
              Short Summary (Card Preview)
            </Label>
            <Input
              id="short_description"
              placeholder="Crisp 1-2 sentence high-level summary..."
              {...register("short_description")}
            />
            {errors.short_description && (
              <p className="text-xs text-destructive">
                {errors.short_description.message}
              </p>
            )}
          </div>

          {/* Full Description */}
          <div className="space-y-1.5">
            <Label htmlFor="full_description" required>
              Full Description & Technical Architecture
            </Label>
            <Textarea
              id="full_description"
              rows={4}
              placeholder="In-depth details on the problem, technical stack, architecture decisions, and results..."
              {...register("full_description")}
            />
            {errors.full_description && (
              <p className="text-xs text-destructive">
                {errors.full_description.message}
              </p>
            )}
          </div>

          {/* Technologies Tag Manager */}
          <div className="space-y-2">
            <Label required>Technologies & Tools</Label>
            <div className="flex gap-2">
              <Input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTech();
                  }
                }}
                placeholder="Type tech and press Enter (e.g. Next.js, Qdrant, PyTorch)"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTech}
                className="shrink-0"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {technologies.map((tech) => (
                <Badge
                  key={tech}
                  variant="outline"
                  className="gap-1 pr-1.5 py-1 text-xs bg-card"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(tech)}
                    className="hover:text-destructive p-0.5 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Main Cover Image */}
          <div className="space-y-2">
            <Label htmlFor="image_url" required>
              Cover Image URL
            </Label>
            <div className="flex gap-2">
              <Input
                id="image_url"
                placeholder="https://images.unsplash.com/... or upload"
                {...register("image_url")}
              />
              <label
                htmlFor="cover-file-upload"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border/80 bg-accent/50 text-sm font-medium hover:bg-accent cursor-pointer shrink-0"
              >
                <Upload className="w-4 h-4" />
                {isUploading ? "Uploading..." : "Upload"}
                <input
                  id="cover-file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleUploadMainImage}
                  disabled={isUploading}
                  className="sr-only"
                />
              </label>
            </div>
            {errors.image_url && (
              <p className="text-xs text-destructive">{errors.image_url.message}</p>
            )}
          </div>

          {/* Gallery Images */}
          <div className="space-y-2">
            <Label>Gallery Image URLs (Optional)</Label>
            <div className="flex gap-2">
              <Input
                value={galleryInput}
                onChange={(e) => setGalleryInput(e.target.value)}
                placeholder="Add gallery image URL..."
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddGalleryUrl}
                className="shrink-0"
              >
                <Plus className="w-4 h-4" />
                Add URL
              </Button>
            </div>
            {galleryUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                {galleryUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-lg overflow-hidden border border-border/60 aspect-video bg-muted"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryUrl(idx)}
                      className="absolute top-1 right-1 p-1 rounded-md bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Links: GitHub & Live Demo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="github_url">
                <span className="flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5" />
                  GitHub Repository URL
                </span>
              </Label>
              <Input
                id="github_url"
                placeholder="https://github.com/..."
                {...register("github_url")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="live_url">
                <span className="flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Live Demo URL
                </span>
              </Label>
              <Input
                id="live_url"
                placeholder="https://project-demo.com"
                {...register("live_url")}
              />
            </div>
          </div>

          {/* Key Metrics / Benchmarks */}
          <div className="space-y-2">
            <Label>Highlights / Metrics (e.g. Latency, Accuracy, Throughput)</Label>
            <div className="flex gap-2">
              <Input
                value={metricKey}
                onChange={(e) => setMetricKey(e.target.value)}
                placeholder="Metric Name (e.g. Latency)"
                className="w-1/2"
              />
              <Input
                value={metricVal}
                onChange={(e) => setMetricVal(e.target.value)}
                placeholder="Value (e.g. < 45ms)"
                className="w-1/2"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddMetric}
                className="shrink-0"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
            {metrics.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-2.5 py-1 rounded-lg border border-border/80 bg-accent/30 text-xs"
                  >
                    <span className="font-semibold text-foreground">{m.key}:</span>
                    <span className="text-primary">{m.value}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMetric(idx)}
                      className="text-muted-foreground hover:text-destructive p-0.5 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Toggles: Featured & Published */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-border/70 bg-card/40">
            <Checkbox
              id="featured"
              label="Featured on Homepage"
              description="Showcases this project prominently on the homepage hero / featured grid."
              checked={watch("featured")}
              onChange={(e) => setValue("featured", e.target.checked)}
            />

            <Checkbox
              id="published"
              label="Published Live"
              description="When unchecked, the project is saved as a draft and hidden from public visitors."
              checked={watch("published")}
              onChange={(e) => setValue("published", e.target.checked)}
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/70">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2 px-5">
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {project ? "Update Project" : "Publish Project"}
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
