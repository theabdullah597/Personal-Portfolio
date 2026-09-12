"use client";

import * as React from "react";
import {
  Plus,
  GraduationCap,
  Calendar,
  Edit2,
  Trash2,
  Save,
} from "lucide-react";
import { Education } from "@/types";
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
  saveEducationAction,
  deleteEducationAction,
} from "@/actions/education";

export function EducationManager({
  initialEducation,
}: {
  initialEducation: Education[];
}) {
  const { showToast } = useToast();
  const [educationList, setEducationList] =
    React.useState<Education[]>(initialEducation);

  // Modal & Form state
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [editingEdu, setEditingEdu] = React.useState<Education | null>(null);

  const [institution, setInstitution] = React.useState("");
  const [degree, setDegree] = React.useState("");
  const [field, setField] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [currentlyStudying, setCurrentlyStudying] = React.useState(false);
  const [description, setDescription] = React.useState("");
  const [displayOrder, setDisplayOrder] = React.useState(1);
  const [isSaving, setIsSaving] = React.useState(false);

  // Delete Candidate
  const [deleteCandidate, setDeleteCandidate] =
    React.useState<Education | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    setEducationList(initialEducation);
  }, [initialEducation]);

  const handleOpenCreate = () => {
    setEditingEdu(null);
    setInstitution("");
    setDegree("");
    setField("");
    setStartDate(new Date().toISOString().split("T")[0]);
    setEndDate("");
    setCurrentlyStudying(false);
    setDescription("");
    setDisplayOrder(educationList.length + 1);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (edu: Education) => {
    setEditingEdu(edu);
    setInstitution(edu.institution);
    setDegree(edu.degree);
    setField(edu.field);
    setStartDate(edu.start_date);
    setEndDate(edu.end_date || "");
    setCurrentlyStudying(edu.currently_studying);
    setDescription(edu.description || "");
    setDisplayOrder(edu.display_order);
    setIsEditorOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution.trim() || !degree.trim()) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "Institution and Degree are required.",
      });
      return;
    }

    setIsSaving(true);
    try {
      const payload: Partial<Education> = {
        id: editingEdu?.id,
        institution: institution.trim(),
        degree: degree.trim(),
        field: field.trim(),
        start_date: startDate,
        end_date: currentlyStudying ? null : endDate,
        currently_studying: currentlyStudying,
        description: description.trim(),
        display_order: Number(displayOrder),
      };

      const res = await saveEducationAction(payload);
      if (res.success && res.education) {
        if (editingEdu) {
          setEducationList((prev) =>
            prev.map((e) => (e.id === res.education?.id ? res.education! : e))
          );
        } else {
          setEducationList((prev) => [...prev, res.education!]);
        }
        showToast({
          type: "success",
          title: "Education Saved",
          message: `${degree} at ${institution} updated.`,
        });
        setIsEditorOpen(false);
      } else {
        showToast({
          type: "error",
          title: "Save Failed",
          message: res.error || "Could not save education record.",
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
      const res = await deleteEducationAction(deleteCandidate.id);
      if (res.success) {
        setEducationList((prev) =>
          prev.filter((e) => e.id !== deleteCandidate.id)
        );
        showToast({
          type: "success",
          title: "Record Deleted",
          message: `Education record deleted.`,
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
          {educationList.length} academic qualification
          {educationList.length === 1 ? "" : "s"} listed
        </p>
        <Button onClick={handleOpenCreate} className="gap-1.5 shadow-sm">
          <Plus className="w-4 h-4" />
          Add Education
        </Button>
      </div>

      {educationList.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/40">
          <GraduationCap className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-semibold text-foreground">
            No education records
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Add degrees, certifications, or academic programs.
          </p>
          <Button onClick={handleOpenCreate} size="sm" className="mt-4 gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            Add First Degree
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {educationList.map((edu) => (
            <div
              key={edu.id}
              className="p-5 rounded-2xl border border-border/70 bg-card hover:border-border transition-all duration-200 shadow-sm space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-foreground">
                      {edu.degree} in {edu.field}
                    </h3>
                    {edu.currently_studying && (
                      <Badge variant="emerald" className="text-[10px] py-0">
                        Active Study
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-primary">
                    {edu.institution}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    {formatDate(edu.start_date)} —{" "}
                    {edu.currently_studying ? "Present" : formatDate(edu.end_date)}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(edu)}
                    className="p-2 rounded-lg border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteCandidate(edu)}
                    className="p-2 rounded-lg border border-border/60 text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {edu.description && (
                <p className="text-xs text-muted-foreground/90 whitespace-pre-line leading-relaxed pt-1">
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        title={editingEdu ? "Edit Education" : "Add Education Record"}
        description="Enter institution, degree, field of study, and dates."
      >
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="edu_institution" required>
              Institution / University
            </Label>
            <Input
              id="edu_institution"
              placeholder="e.g. Stanford University or NUST"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="edu_degree" required>
                Degree Title
              </Label>
              <Input
                id="edu_degree"
                placeholder="e.g. Bachelor of Science"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edu_field" required>
                Field of Study
              </Label>
              <Input
                id="edu_field"
                placeholder="e.g. Computer Science & AI"
                value={field}
                onChange={(e) => setField(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="edu_start_date" required>
                Start Date
              </Label>
              <Input
                id="edu_start_date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edu_end_date">End Date</Label>
              <Input
                id="edu_end_date"
                type="date"
                value={endDate}
                disabled={currentlyStudying}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Checkbox
              id="edu_currently_studying"
              label="Currently pursuing this degree"
              checked={currentlyStudying}
              onChange={(e) => setCurrentlyStudying(e.target.checked)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edu_description">Description / Academic Honors</Label>
            <Textarea
              id="edu_description"
              rows={3}
              placeholder="Relevant coursework, thesis, research topics, or academic achievements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edu_order">Display Order Index</Label>
            <Input
              id="edu_order"
              type="number"
              min={0}
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
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
              {isSaving ? "Saving..." : "Save Record"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        title="Confirm Deletion"
        description="Are you sure you want to remove this academic record?"
        maxWidth="sm"
      >
        <div className="space-y-4 pt-2">
          {deleteCandidate && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs font-semibold text-foreground">
              {deleteCandidate.degree} at {deleteCandidate.institution}
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
