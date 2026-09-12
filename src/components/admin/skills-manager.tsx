"use client";

import * as React from "react";
import {
  Plus,
  Wrench,
  Star,
  Edit2,
  Trash2,
  Code2,
  Terminal,
  Cpu,
  Layout,
  Palette,
  Server,
  Zap,
  Database,
  Layers,
  Bot,
  Sparkles,
  GitBranch,
  Box,
  Save,
} from "lucide-react";
import { Skill, SkillCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import {
  saveSkillAction,
  deleteSkillAction,
  toggleSkillFeaturedAction,
} from "@/actions/skills";

const skillCategories: SkillCategory[] = [
  "Programming",
  "Frontend",
  "Backend",
  "Database",
  "AI/ML",
  "Deep Learning",
  "DevOps",
  "Tools",
];

const availableIcons: { label: string; name: string }[] = [
  { label: "Code", name: "Code2" },
  { label: "Terminal", name: "Terminal" },
  { label: "CPU / Chip", name: "Cpu" },
  { label: "Layout / Web", name: "Layout" },
  { label: "Palette / Design", name: "Palette" },
  { label: "Server", name: "Server" },
  { label: "Zap / Performance", name: "Zap" },
  { label: "Database", name: "Database" },
  { label: "Layers / Cache", name: "Layers" },
  { label: "Bot / AI", name: "Bot" },
  { label: "Sparkles / ML", name: "Sparkles" },
  { label: "Container / Docker", name: "Container" },
  { label: "Git / Branch", name: "GitBranch" },
  { label: "3D / Box", name: "Box" },
  { label: "Tool / Wrench", name: "Wrench" },
];

export function renderSkillIcon(iconName?: string | null, className = "w-4 h-4") {
  switch (iconName) {
    case "Code2":
      return <Code2 className={className} />;
    case "Terminal":
      return <Terminal className={className} />;
    case "Cpu":
      return <Cpu className={className} />;
    case "Layout":
      return <Layout className={className} />;
    case "Palette":
      return <Palette className={className} />;
    case "Server":
      return <Server className={className} />;
    case "Zap":
      return <Zap className={className} />;
    case "Database":
      return <Database className={className} />;
    case "Layers":
      return <Layers className={className} />;
    case "Bot":
      return <Bot className={className} />;
    case "Sparkles":
      return <Sparkles className={className} />;
    case "GitBranch":
      return <GitBranch className={className} />;
    case "Box":
      return <Box className={className} />;
    default:
      return <Wrench className={className} />;
  }
}

export function SkillsManager({ initialSkills }: { initialSkills: Skill[] }) {
  const { showToast } = useToast();
  const [skills, setSkills] = React.useState<Skill[]>(initialSkills);
  const [activeCategory, setActiveCategory] = React.useState<string>("All");

  // Modal State
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [editingSkill, setEditingSkill] = React.useState<Skill | null>(null);

  // Form fields
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState<SkillCategory>("Programming");
  const [icon, setIcon] = React.useState("Code2");
  const [description, setDescription] = React.useState("");
  const [proficiency, setProficiency] = React.useState(85);
  const [displayOrder, setDisplayOrder] = React.useState(1);
  const [featured, setFeatured] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  // Delete confirmation
  const [deleteCandidate, setDeleteCandidate] = React.useState<Skill | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    setSkills(initialSkills);
  }, [initialSkills]);

  const filteredSkills = React.useMemo(() => {
    if (activeCategory === "All") return skills;
    return skills.filter((s) => s.category === activeCategory);
  }, [skills, activeCategory]);

  const handleOpenCreate = () => {
    setEditingSkill(null);
    setName("");
    setCategory("Programming");
    setIcon("Code2");
    setDescription("");
    setProficiency(85);
    setDisplayOrder(skills.length + 1);
    setFeatured(false);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setName(skill.name);
    setCategory(skill.category as SkillCategory);
    setIcon(skill.icon || "Code2");
    setDescription(skill.description || "");
    setProficiency(skill.proficiency ?? 80);
    setDisplayOrder(skill.display_order ?? 1);
    setFeatured(skill.featured ?? false);
    setIsEditorOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "Skill name is required.",
      });
      return;
    }

    setIsSaving(true);
    try {
      const payload: Partial<Skill> = {
        id: editingSkill?.id,
        name: name.trim(),
        category,
        icon,
        description: description.trim(),
        proficiency,
        display_order: Number(displayOrder),
        featured,
      };

      const res = await saveSkillAction(payload);
      if (res.success && res.skill) {
        if (editingSkill) {
          setSkills((prev) =>
            prev.map((s) => (s.id === res.skill?.id ? res.skill! : s))
          );
        } else {
          setSkills((prev) => [...prev, res.skill!]);
        }
        showToast({
          type: "success",
          title: "Skill Saved",
          message: `${name} has been saved successfully.`,
        });
        setIsEditorOpen(false);
      } else {
        showToast({
          type: "error",
          title: "Save Failed",
          message: res.error || "Could not save skill.",
        });
      }
    } catch {
      showToast({
        type: "error",
        title: "Error",
        message: "An unexpected error occurred.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleFeatured = async (skill: Skill) => {
    const nextState = !skill.featured;
    setSkills((prev) =>
      prev.map((s) => (s.id === skill.id ? { ...s, featured: nextState } : s))
    );
    const res = await toggleSkillFeaturedAction(skill.id, nextState);
    if (!res.success) {
      setSkills((prev) =>
        prev.map((s) => (s.id === skill.id ? { ...s, featured: skill.featured } : s))
      );
      showToast({
        type: "error",
        title: "Failed to update",
        message: res.error || "Could not update featured status.",
      });
    } else {
      showToast({
        type: "info",
        title: "Status Updated",
        message: `${skill.name} featured state updated.`,
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      const res = await deleteSkillAction(deleteCandidate.id);
      if (res.success) {
        setSkills((prev) => prev.filter((s) => s.id !== deleteCandidate.id));
        showToast({
          type: "success",
          title: "Skill Deleted",
          message: `${deleteCandidate.name} removed from database.`,
        });
        setDeleteCandidate(null);
      } else {
        showToast({
          type: "error",
          title: "Delete Failed",
          message: res.error || "Could not delete skill.",
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
      {/* Top Bar: Category Pills & Add Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 custom-scrollbar">
          <button
            type="button"
            onClick={() => setActiveCategory("All")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === "All"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card text-muted-foreground hover:text-foreground border border-border/60"
            }`}
          >
            All Categories ({skills.length})
          </button>
          {skillCategories.map((cat) => {
            const count = skills.filter((s) => s.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card text-muted-foreground hover:text-foreground border border-border/60"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        <Button onClick={handleOpenCreate} className="gap-1.5 shrink-0">
          <Plus className="w-4 h-4" />
          Add Skill
        </Button>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="group flex flex-col justify-between p-4 rounded-2xl border border-border/70 bg-card hover:border-border transition-all duration-200 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                    {renderSkillIcon(skill.icon, "w-4 h-4")}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {skill.name}
                    </h3>
                    <span className="text-[11px] text-muted-foreground">
                      {skill.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(skill)}
                    title={skill.featured ? "Featured on Home" : "Make Featured"}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      skill.featured
                        ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                        : "border-border/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(skill)}
                    className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteCandidate(skill)}
                    className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {skill.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {skill.description}
                </p>
              )}

              {/* Proficiency Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Proficiency</span>
                  <span className="font-mono font-semibold text-foreground">
                    {skill.proficiency ?? 80}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-accent overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                    style={{ width: `${skill.proficiency ?? 80}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        title={editingSkill ? "Edit Skill" : "Add New Skill"}
        description="Configure skill name, category, icon symbol, and proficiency."
      >
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="skill_name" required>
              Skill Name
            </Label>
            <Input
              id="skill_name"
              placeholder="e.g. Next.js, Python, Qdrant"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="skill_category" required>
                Category
              </Label>
              <select
                id="skill_category"
                value={category}
                onChange={(e) => setCategory(e.target.value as SkillCategory)}
                className="flex h-10 w-full rounded-xl border border-border/70 bg-background/60 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                {skillCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="skill_icon" required>
                Icon Symbol
              </Label>
              <select
                id="skill_icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border/70 bg-background/60 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                {availableIcons.map((i) => (
                  <option key={i.name} value={i.name}>
                    {i.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="skill_description">Short Description (Optional)</Label>
            <Input
              id="skill_description"
              placeholder="Brief context (e.g. App Router, SSR, Server Actions)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="skill_proficiency">
                Proficiency: <span className="font-mono">{proficiency}%</span>
              </Label>
              <input
                type="range"
                id="skill_proficiency"
                min={10}
                max={100}
                step={5}
                value={proficiency}
                onChange={(e) => setProficiency(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-accent rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="skill_order">Display Order Index</Label>
              <Input
                id="skill_order"
                type="number"
                min={0}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="pt-2">
            <Checkbox
              id="skill_featured"
              label="Feature in Homepage Highlights"
              description="Displays prominently on the primary homepage tech stack showcase."
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/70">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditorOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="gap-1.5">
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Skill"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        title="Confirm Skill Deletion"
        description="Are you sure you want to remove this skill from the portfolio database?"
        maxWidth="sm"
      >
        <div className="space-y-4 pt-2">
          {deleteCandidate && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs font-semibold text-foreground">
              {deleteCandidate.name} ({deleteCandidate.category})
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
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Skill"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
