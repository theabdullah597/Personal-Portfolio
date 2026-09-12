"use client";

import * as React from "react";
import {
  Mail,
  MailOpen,
  Trash2,
  Reply,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  Filter,
} from "lucide-react";
import { ContactMessage } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";
import {
  toggleMessageReadAction,
  deleteMessageAction,
} from "@/actions/contact";

export function MessagesManager({
  initialMessages,
}: {
  initialMessages: ContactMessage[];
}) {
  const { showToast } = useToast();
  const [messages, setMessages] = React.useState<ContactMessage[]>(initialMessages);
  const [filter, setFilter] = React.useState<"all" | "unread" | "read">("all");

  // Delete modal state
  const [deleteCandidate, setDeleteCandidate] =
    React.useState<ContactMessage | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const filteredMessages = React.useMemo(() => {
    if (filter === "unread") return messages.filter((m) => !m.is_read);
    if (filter === "read") return messages.filter((m) => m.is_read);
    return messages;
  }, [messages, filter]);

  const unreadCount = React.useMemo(
    () => messages.filter((m) => !m.is_read).length,
    [messages]
  );

  const handleToggleRead = async (msg: ContactMessage) => {
    const nextState = !msg.is_read;
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, is_read: nextState } : m))
    );

    const res = await toggleMessageReadAction(msg.id, nextState);
    if (!res.success) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, is_read: msg.is_read } : m))
      );
      showToast({
        type: "error",
        title: "Update Failed",
        message: res.error || "Failed to update status",
      });
    } else {
      showToast({
        type: "info",
        title: nextState ? "Marked as Read" : "Marked as Unread",
        message: `Message from ${msg.name} updated.`,
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      const res = await deleteMessageAction(deleteCandidate.id);
      if (res.success) {
        setMessages((prev) => prev.filter((m) => m.id !== deleteCandidate.id));
        showToast({
          type: "success",
          title: "Message Deleted",
          message: "The message has been permanently deleted.",
        });
        setDeleteCandidate(null);
      } else {
        showToast({
          type: "error",
          title: "Delete Failed",
          message: res.error || "Could not delete message.",
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
      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card text-muted-foreground hover:text-foreground border border-border/60"
            }`}
          >
            All Messages ({messages.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === "unread"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card text-muted-foreground hover:text-foreground border border-border/60"
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("read")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === "read"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card text-muted-foreground hover:text-foreground border border-border/60"
            }`}
          >
            Read ({messages.length - unreadCount})
          </button>
        </div>
      </div>

      {filteredMessages.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/40">
          <Mail className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-semibold text-foreground">No messages found</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {filter === "unread"
              ? "You are all caught up! No unread inquiries."
              : "When visitors fill out the public contact form, their inquiries appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`p-5 rounded-2xl border transition-all duration-200 space-y-3 ${
                !msg.is_read
                  ? "border-primary/40 bg-card/90 shadow-md shadow-primary/5"
                  : "border-border/70 bg-card/60"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-foreground">
                      {msg.subject}
                    </h3>
                    {!msg.is_read ? (
                      <Badge variant="cyan" className="text-[10px] py-0">
                        New / Unread
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] py-0 text-muted-foreground">
                        Read
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1.5 font-medium text-foreground">
                      <User className="w-3.5 h-3.5 text-primary" />
                      {msg.name}
                    </span>
                    <span className="text-primary hover:underline">
                      {msg.email}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(msg.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {/* Reply via email */}
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 bg-accent/30 text-xs font-medium text-foreground hover:bg-accent hover:border-border transition-colors"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    Reply
                  </a>

                  {/* Toggle Read */}
                  <button
                    type="button"
                    onClick={() => handleToggleRead(msg)}
                    className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground transition-colors"
                    title={msg.is_read ? "Mark as unread" : "Mark as read"}
                  >
                    {msg.is_read ? (
                      <Mail className="w-4 h-4" />
                    ) : (
                      <MailOpen className="w-4 h-4 text-primary" />
                    )}
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => setDeleteCandidate(msg)}
                    className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-destructive transition-colors"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Body */}
              <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed bg-background/40 p-4 rounded-xl border border-border/40 font-sans">
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        title="Confirm Deletion"
        description="Are you sure you want to delete this contact message permanently?"
        maxWidth="sm"
      >
        <div className="space-y-4 pt-2">
          {deleteCandidate && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-foreground font-medium">
              From: <span className="font-bold">{deleteCandidate.name}</span> (
              {deleteCandidate.email})
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
              {isDeleting ? "Deleting..." : "Delete Message"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
