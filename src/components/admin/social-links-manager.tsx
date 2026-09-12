"use client";

import * as React from "react";
import { Plus, Link2, ExternalLink, Edit2, Trash2, Save, X } from "lucide-react";
import { SocialLink } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import {
  saveSocialLinkAction,
  deleteSocialLinkAction,
} from "@/actions/social-links";

export function SocialLinksManager({
  initialLinks,
}: {
  initialLinks: SocialLink[];
}) {
  const { showToast } = useToast();
  const [links, setLinks] = React.useState<SocialLink[]>(initialLinks);

  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [editingLink, setEditingLink] = React.useState<SocialLink | null>(null);

  const [platform, setPlatform] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [displayOrder, setDisplayOrder] = React.useState(1);
  const [isActive, setIsActive] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  const [deleteCandidate, setDeleteCandidate] =
    React.useState<SocialLink | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    setLinks(initialLinks);
  }, [initialLinks]);

  const handleOpenCreate = () => {
    setEditingLink(null);
    setPlatform("");
    setUrl("");
    setDisplayOrder(links.length + 1);
    setIsActive(true);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (link: SocialLink) => {
    setEditingLink(link);
    setPlatform(link.platform);
    setUrl(link.url);
    setDisplayOrder(link.display_order);
    setIsActive(link.is_active);
    setIsEditorOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform.trim() || !url.trim()) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "Platform and URL are required.",
      });
      return;
    }

    setIsSaving(true);
    try {
      const res = await saveSocialLinkAction({
        id: editingLink?.id,
        platform: platform.trim(),
        url: url.trim(),
        display_order: Number(displayOrder),
        is_active: isActive,
      });

      if (res.success && res.link) {
        if (editingLink) {
          setLinks((prev) =>
            prev.map((l) => (l.id === res.link?.id ? res.link! : l))
          );
        } else {
          setLinks((prev) => [...prev, res.link!]);
        }
        showToast({
          type: "success",
          title: "Link Saved",
          message: `${platform} link saved.`,
        });
        setIsEditorOpen(false);
      } else {
        showToast({
          type: "error",
          title: "Save Failed",
          message: res.error || "Could not save link.",
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
      const res = await deleteSocialLinkAction(deleteCandidate.id);
      if (res.success) {
        setLinks((prev) => prev.filter((l) => l.id !== deleteCandidate.id));
        showToast({
          type: "success",
          title: "Link Deleted",
          message: "Social link removed.",
        });
        setDeleteCandidate(null);
      } else {
        showToast({
          type: "error",
          title: "Delete Failed",
          message: res.error || "Could not delete link.",
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
          {links.length} public network link{links.length === 1 ? "" : "s"}
        </p>
        <Button onClick={handleOpenCreate} className="gap-1.5 shadow-sm">
          <Plus className="w-4 h-4" />
          Add Social Link
        </Button>
      </div>

      <div className="space-y-3">
        {links.map((link) => (
          <div
            key={link.id}
            className="flex items-center justify-between p-4 rounded-2xl border border-border/70 bg-card hover:border-border transition-all duration-200 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                <Link2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-foreground">
                    {link.platform}
                  </h4>
                  {!link.is_active && (
                    <span className="text-[10px] text-muted-foreground">
                      (Hidden)
                    </span>
                  )}
                </div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5"
                >
                  {link.url}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleOpenEdit(link)}
                className="p-2 rounded-lg border border-border/60 text-muted-foreground hover:text-primary transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDeleteCandidate(link)}
                className="p-2 rounded-lg border border-border/60 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        title={editingLink ? "Edit Social Link" : "Add Social Link"}
        description="Enter network platform name and full profile URL."
      >
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="link_platform" required>
              Platform Name
            </Label>
            <Input
              id="link_platform"
              placeholder="e.g. GitHub, LinkedIn, Twitter, Email"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="link_url" required>
              URL / Link
            </Label>
            <Input
              id="link_url"
              placeholder="https://github.com/... or mailto:..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="link_order">Display Order Index</Label>
            <Input
              id="link_order"
              type="number"
              min={0}
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
            />
          </div>

          <div className="pt-2">
            <Checkbox
              id="link_active"
              label="Active (Visible publicly)"
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
              {isSaving ? "Saving..." : "Save Link"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        title="Confirm Deletion"
        description="Remove this social link?"
        maxWidth="sm"
      >
        <div className="space-y-4 pt-2">
          {deleteCandidate && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs font-semibold text-foreground">
              {deleteCandidate.platform}
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
              {isDeleting ? "Deleting..." : "Delete Link"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
