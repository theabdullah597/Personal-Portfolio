"use client";

import * as React from "react";
import {
  Plus,
  Briefcase,
  Calendar,
  MapPin,
  Edit2,
  Trash2,
  Save,
  X,
} from "lucide-react";
import { Experience } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";
import {
  saveExperienceAction,
  deleteExperienceAction,
} from "@/actions/experience";

export function ExperienceManager({
  initialExperiences,
}: {
  initialExperiences: Experience[];
}) {
  const { showToast } = useToast();
  const [experiences, setExperiences] =
    React.useState<Experience[]>(initialExperiences);

  // Modal & Edit State
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [editingExp, setEditingExp] = React.useState<Experience | null>(null);

  // Form Fields
  const [company, setCompany] = React.useState("");
  const [role, setRole] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [currentlyWorking, setCurrentlyWorking] = React.useState(false);
  const [description, setDescription] = React.useState("");
  const [displayOrder, setDisplayOrder] = React.useState(1);
  const [technologies, setTechnologies] = React.useState<string[]>([]);
  const [techInput, setTechInput] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  // Delete Candidate
  const [deleteCandidate, setDeleteCandidate] =
    React.useState<Experience | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    setExperiences(initialExperiences);
  }, [initialExperiences]);

  const handleOpenCreate = () => {
    setEditingExp(null);
    setCompany("");
    setRole("");
    setLocation("");
    setStartDate(new Date().toISOString().split("T")[0]);
    setEndDate("");
    setCurrentlyWorking(true);
    setDescription("");
    setDisplayOrder(experiences.length + 1);
    setTechnologies(["Next.js", "TypeScript"]);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (exp: Experience) => {
    setEditingExp(exp);
    setCompany(exp.company);
    setRole(exp.role);
    setLocation(exp.location || "");
    setStartDate(exp.start_date);
    setEndDate(exp.end_date || "");
    setCurrentlyWorking(exp.currently_working);
    setDescription(exp.description);
    setDisplayOrder(exp.display_order);
    setTechnologies(exp.technologies || []);
    setIsEditorOpen(true);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "Company and Role are required.",
      });
      return;
    }

    setIsSaving(true);
    try {
      const payload: Partial<Experience> = {
        id: editingExp?.id,
        company: company.trim(),
        role: role.trim(),
        location: location.trim(),
        start_date: startDate,
        end_date: currentlyWorking ? null : endDate,
        currently_working: currentlyWorking,
        description: description.trim(),
        technologies,
        display_order: Number(displayOrder),
      };

      const res = await saveExperienceAction(payload);
      if (res.success && res.experience) {
        if (editingExp) {
          setExperiences((prev) =>
            prev.map((e) => (e.id === res.experience?.id ? res.experience! : e))
          );
        } else {
          setExperiences((prev) => [...prev, res.experience!]);
        }
        showToast({
          type: "success",
          title: "Experience Saved",
          message: `${role} at ${company} updated.`,
        });
        setIsEditorOpen(false);
      } else {
        showToast({
          type: "error",
          title: "Save Failed",
          message: res.error || "Could not save experience.",
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

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      const res = await deleteExperienceAction(deleteCandidate.id);
      if (res.success) {
        setExperiences((prev) => prev.filter((e) => e.id !== deleteCandidate.id));
        showToast({
          type: "success",
          title: "Experience Deleted",
          message: `Record removed successfully.`,
        });
        setDeleteCandidate(null);
      } else {
        showToast({
          type: "error",
          title: "Delete Failed",
          message: res.error || "Could not delete record.",
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
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {experiences.length} career {experiences.length === 1 ? "role" : "roles"} listed
        </p>
        <Button onClick={handleOpenCreate} className="gap-1.5 shadow-sm">
          <Plus className="w-4 h-4" />
          Add Experience
        </Button>
      </div>

      {experiences.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/40">
          <Briefcase className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-semibold text-foreground">No experience records</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Add your employment history, client roles, and engineering milestones.
          </p>
          <Button onClick={handleOpenCreate} size="sm" className="mt-4 gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            Add First Role
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="p-5 rounded-2xl border border-border/70 bg-card hover:border-border transition-all duration-200 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-foreground">
                      {exp.role}
                    </h3>
                    <span className="text-muted-foreground font-normal">at</span>
                    <span className="text-sm font-semibold text-primary">
                      {exp.company}
                    </span>
                    {exp.currently_working && (
                      <Badge variant="emerald" className="text-[10px] py-0">
                        Current Role
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      {formatDate(exp.start_date)} —{" "}
                      {exp.currently_working ? "Present" : formatDate(exp.end_date)}
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        {exp.location}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(exp)}
                    className="p-2 rounded-lg border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteCandidate(exp)}
                    className="p-2 rounded-lg border border-border/60 text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground/90 whitespace-pre-line leading-relaxed">
                {exp.description}
              </p>

              {exp.technologies && exp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {exp.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md text-[10px] bg-accent/70 text-muted-foreground font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        title={editingExp ? "Edit Experience" : "Add Work Experience"}
        description="Enter position details, company, location, dates, and technologies."
        maxWidth="xl"
      >
        <form onSubmit={handleSave} className="space-y-5 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="exp_company" required>
                Company / Organization
              </Label>
              <Input
                id="exp_company"
                placeholder="e.g. Apex Tech Innovations"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="exp_role" required>
                Job Title / Role
              </Label>
              <Input
                id="exp_role"
                placeholder="e.g. Senior Full-Stack Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="exp_location">Location</Label>
              <Input
                id="exp_location"
                placeholder="e.g. Remote or San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="exp_start_date" required>
                Start Date
              </Label>
              <Input
                id="exp_start_date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="exp_end_date">End Date</Label>
              <Input
                id="exp_end_date"
                type="date"
                value={endDate}
                disabled={currentlyWorking}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Checkbox
              id="exp_currently_working"
              label="Currently working in this role"
              checked={currentlyWorking}
              onChange={(e) => setCurrentlyWorking(e.target.checked)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="exp_description" required>
              Role Description & Key Accomplishments
            </Label>
            <Textarea
              id="exp_description"
              rows={4}
              placeholder="Outline major features engineered, architecture designs, performance metrics, and leadership impact..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Technologies */}
          <div className="space-y-2">
            <Label>Technologies Stack</Label>
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
                placeholder="Type tech and press Enter"
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
            {technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {technologies.map((t) => (
                  <Badge
                    key={t}
                    variant="outline"
                    className="gap-1 pr-1.5 py-0.5 text-xs bg-card"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(t)}
                      className="hover:text-destructive p-0.5 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="exp_order">Display Order Index</Label>
            <Input
              id="exp_order"
              type="number"
              min={0}
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
            />
          </div>

          <div className="sticky bottom-0 z-10 -mx-6 -mb-6 mt-6 px-6 py-4 bg-card/95 backdrop-blur-md border-t border-border/70 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditorOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="gap-1.5 shadow-sm">
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Experience"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        title="Confirm Deletion"
        description="Are you sure you want to remove this work experience record?"
        maxWidth="sm"
      >
        <div className="space-y-4 pt-2">
          {deleteCandidate && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs font-semibold text-foreground">
              {deleteCandidate.role} at {deleteCandidate.company}
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
              {isDeleting ? "Deleting..." : "Delete Record"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
