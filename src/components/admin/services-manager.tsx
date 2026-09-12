"use client";

import * as React from "react";
import {
  Plus,
  Sparkles,
  Layout,
  Bot,
  Server,
  Zap,
  Cpu,
  Layers,
  Terminal,
  Edit2,
  Trash2,
  Save,
  X,
  CheckCircle2,
} from "lucide-react";
import { Service } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import {
  saveServiceAction,
  deleteServiceAction,
  toggleServiceActiveAction,
} from "@/actions/services";

const serviceIcons: { label: string; name: string }[] = [
  { label: "Layout / Web", name: "Layout" },
  { label: "Bot / AI Assistant", name: "Bot" },
  { label: "Server / Backend", name: "Server" },
  { label: "Zap / Performance", name: "Zap" },
  { label: "CPU / Systems", name: "Cpu" },
  { label: "Layers / Architecture", name: "Layers" },
  { label: "Terminal / APIs", name: "Terminal" },
  { label: "Sparkles / Innovation", name: "Sparkles" },
];

function renderServiceIcon(iconName?: string | null, className = "w-5 h-5") {
  switch (iconName) {
    case "Layout":
      return <Layout className={className} />;
    case "Bot":
      return <Bot className={className} />;
    case "Server":
      return <Server className={className} />;
    case "Zap":
      return <Zap className={className} />;
    case "Cpu":
      return <Cpu className={className} />;
    case "Layers":
      return <Layers className={className} />;
    case "Terminal":
      return <Terminal className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}

export function ServicesManager({
  initialServices,
}: {
  initialServices: Service[];
}) {
  const { showToast } = useToast();
  const [services, setServices] = React.useState<Service[]>(initialServices);

  // Modal & Form State
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [editingService, setEditingService] = React.useState<Service | null>(null);

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [icon, setIcon] = React.useState("Layout");
  const [features, setFeatures] = React.useState<string[]>([]);
  const [featureInput, setFeatureInput] = React.useState("");
  const [displayOrder, setDisplayOrder] = React.useState(1);
  const [isActive, setIsActive] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  // Delete Candidate
  const [deleteCandidate, setDeleteCandidate] = React.useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    setServices(initialServices);
  }, [initialServices]);

  const handleOpenCreate = () => {
    setEditingService(null);
    setTitle("");
    setDescription("");
    setIcon("Layout");
    setFeatures(["Custom Solution Architecture", "Full Type-Safety & Testing"]);
    setDisplayOrder(services.length + 1);
    setIsActive(true);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (srv: Service) => {
    setEditingService(srv);
    setTitle(srv.title);
    setDescription(srv.description);
    setIcon(srv.icon || "Layout");
    setFeatures(srv.features || []);
    setDisplayOrder(srv.display_order);
    setIsActive(srv.is_active);
    setIsEditorOpen(true);
  };

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setFeatures([...features, featureInput.trim()]);
    setFeatureInput("");
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "Service title is required.",
      });
      return;
    }

    setIsSaving(true);
    try {
      const payload: Partial<Service> = {
        id: editingService?.id,
        title: title.trim(),
        description: description.trim(),
        icon,
        features,
        display_order: Number(displayOrder),
        is_active: isActive,
      };

      const res = await saveServiceAction(payload);
      if (res.success && res.service) {
        if (editingService) {
          setServices((prev) =>
            prev.map((s) => (s.id === res.service?.id ? res.service! : s))
          );
        } else {
          setServices((prev) => [...prev, res.service!]);
        }
        showToast({
          type: "success",
          title: "Service Saved",
          message: `${title} saved successfully.`,
        });
        setIsEditorOpen(false);
      } else {
        showToast({
          type: "error",
          title: "Save Failed",
          message: res.error || "Could not save service.",
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

  const handleToggleActive = async (srv: Service) => {
    const nextState = !srv.is_active;
    setServices((prev) =>
      prev.map((s) => (s.id === srv.id ? { ...s, is_active: nextState } : s))
    );
    const res = await toggleServiceActiveAction(srv.id, nextState);
    if (!res.success) {
      setServices((prev) =>
        prev.map((s) => (s.id === srv.id ? { ...s, is_active: srv.is_active } : s))
      );
      showToast({
        type: "error",
        title: "Update Failed",
        message: res.error || "Could not update service status.",
      });
    } else {
      showToast({
        type: "info",
        title: "Status Updated",
        message: `${srv.title} is now ${nextState ? "active" : "disabled"}.`,
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      const res = await deleteServiceAction(deleteCandidate.id);
      if (res.success) {
        setServices((prev) => prev.filter((s) => s.id !== deleteCandidate.id));
        showToast({
          type: "success",
          title: "Service Deleted",
          message: `Service removed successfully.`,
        });
        setDeleteCandidate(null);
      } else {
        showToast({
          type: "error",
          title: "Delete Failed",
          message: res.error || "Could not delete service.",
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
          {services.length} client engineering offering{services.length === 1 ? "" : "s"}
        </p>
        <Button onClick={handleOpenCreate} className="gap-1.5 shadow-sm">
          <Plus className="w-4 h-4" />
          Add Service
        </Button>
      </div>

      {services.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/40">
          <Sparkles className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-semibold text-foreground">No services configured</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Define your technical offerings such as Full-Stack Architecture, AI integrations, and RAG systems.
          </p>
          <Button onClick={handleOpenCreate} size="sm" className="mt-4 gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            Add First Service
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="p-5 rounded-2xl border border-border/70 bg-card hover:border-border transition-all duration-200 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                    {renderServiceIcon(srv.icon)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(srv)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border transition-all ${
                        srv.is_active
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : "border-zinc-500/30 bg-zinc-500/10 text-zinc-400"
                      }`}
                    >
                      {srv.is_active ? "Active" : "Disabled"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(srv)}
                      className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteCandidate(srv)}
                      className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-3">
                    {srv.description}
                  </p>
                </div>

                {srv.features && srv.features.length > 0 && (
                  <ul className="space-y-1 pt-2 border-t border-border/50">
                    {srv.features.map((f, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-muted-foreground flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="line-clamp-1">{f}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        title={editingService ? "Edit Service" : "Add Service"}
        description="Configure service title, description, icon, and deliverable highlights."
      >
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="srv_title" required>
              Service Title
            </Label>
            <Input
              id="srv_title"
              placeholder="e.g. AI & RAG Systems Integration"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="srv_icon" required>
                Icon Identifier
              </Label>
              <select
                id="srv_icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border/70 bg-background/60 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                {serviceIcons.map((i) => (
                  <option key={i.name} value={i.name}>
                    {i.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="srv_order">Display Order Index</Label>
              <Input
                id="srv_order"
                type="number"
                min={0}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="srv_desc" required>
              Description
            </Label>
            <Textarea
              id="srv_desc"
              rows={3}
              placeholder="Comprehensive summary of what this engineering offering delivers..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Features checklist */}
          <div className="space-y-2">
            <Label>Deliverables & Feature Bullets</Label>
            <div className="flex gap-2">
              <Input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="Type feature bullet and press Add"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddFeature}
                className="shrink-0"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
            {features.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {features.map((f, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg border border-border/60 bg-card text-xs"
                  >
                    <span className="flex items-center gap-2 text-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      {f}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-muted-foreground hover:text-destructive p-0.5 rounded"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2">
            <Checkbox
              id="srv_active"
              label="Active Service (Visible on public portfolio)"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
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
              {isSaving ? "Saving..." : "Save Service"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        title="Confirm Deletion"
        description="Are you sure you want to remove this service?"
        maxWidth="sm"
      >
        <div className="space-y-4 pt-2">
          {deleteCandidate && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs font-semibold text-foreground">
              {deleteCandidate.title}
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
              {isDeleting ? "Deleting..." : "Delete Service"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
