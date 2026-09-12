"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Save,
  CheckCircle2,
  FileText,
  Upload,
  ExternalLink,
} from "lucide-react";
import { Profile } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { updateProfileAction } from "@/actions/profile";
import { uploadFile } from "@/lib/supabase/storage";

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  headline: z.string().min(3, "Headline is required"),
  career_focus: z.string().optional(),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  location: z.string().optional(),
  email: z.string().email("Valid email required").optional().or(z.literal("")),
  phone: z.string().optional(),
  avatar_url: z.string().optional().or(z.literal("")),
  resume_url: z.string().optional().or(z.literal("")),
  available_for_hire: z.boolean(),
  years_experience: z.coerce.number().min(0).max(60).optional(),
  completed_projects: z.coerce.number().min(0).max(1000).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileForm({ initialProfile }: { initialProfile: Profile }) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);
  const [isUploadingResume, setIsUploadingResume] = React.useState(false);
  const resumeInputRef = React.useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      full_name: initialProfile.full_name || "",
      headline: initialProfile.headline || "",
      career_focus: initialProfile.career_focus || "",
      bio: initialProfile.bio || "",
      location: initialProfile.location || "",
      email: initialProfile.email || "",
      phone: initialProfile.phone || "",
      avatar_url: initialProfile.avatar_url || "",
      resume_url: initialProfile.resume_url || "",
      available_for_hire: initialProfile.available_for_hire ?? true,
      years_experience: initialProfile.years_experience ?? 4,
      completed_projects: initialProfile.completed_projects ?? 20,
    },
  });

  const avatarUrl = watch("avatar_url");
  const resumeUrl = watch("resume_url");
  const availableForHire = watch("available_for_hire");

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const res = await uploadFile(file, "portfolio-media", "avatars");
      if (res.url) {
        setValue("avatar_url", res.url, { shouldDirty: true });
        showToast({
          type: "success",
          title: "Image Uploaded",
          message: "Profile image uploaded successfully.",
        });
      } else {
        showToast({
          type: "error",
          title: "Upload Failed",
          message: res.error || "Could not upload image.",
        });
      }
    } catch {
      showToast({
        type: "error",
        title: "Upload Error",
        message: "Failed to upload image.",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingResume(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast({
          type: "error",
          title: "Upload Failed",
          message: data.error || "Could not upload resume document.",
        });
      } else {
        setValue("resume_url", data.url, { shouldDirty: true });
        showToast({
          type: "success",
          title: "Resume Uploaded",
          message: `File "${data.filename}" uploaded successfully. Remember to click Save Profile.`,
        });
      }
    } catch {
      showToast({
        type: "error",
        title: "Upload Error",
        message: "An unexpected error occurred during resume upload.",
      });
    } finally {
      setIsUploadingResume(false);
      if (resumeInputRef.current) resumeInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      const res = await updateProfileAction({
        ...initialProfile,
        ...data,
      });

      if (res.success) {
        showToast({
          type: "success",
          title: "Profile Updated",
          message: "Your profile information has been saved successfully.",
        });
      } else {
        showToast({
          type: "error",
          title: "Update Failed",
          message: res.error || "Could not save profile changes.",
        });
      }
    } catch {
      showToast({
        type: "error",
        title: "Error",
        message: "An unexpected error occurred while saving.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Personal & Professional Identity</CardTitle>
          <CardDescription>
            This information appears in your public hero section, about page, and metadata.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Avatar and Quick Identity Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 rounded-xl border border-border/60 bg-card/40">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/30 bg-muted flex items-center justify-center">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              <label
                htmlFor="avatar-file"
                className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-primary text-primary-foreground shadow-md cursor-pointer hover:bg-primary/90 transition-colors"
                title="Upload new avatar"
              >
                <Upload className="w-3.5 h-3.5" />
                <input
                  id="avatar-file"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={isUploadingAvatar}
                  className="sr-only"
                />
              </label>
            </div>

            <div className="flex-1 space-y-2">
              <Label htmlFor="avatar_url">Avatar Image URL</Label>
              <Input
                id="avatar_url"
                placeholder="https://images.unsplash.com/... or upload"
                {...register("avatar_url")}
              />
              <p className="text-[11px] text-muted-foreground">
                Paste an image URL or use the upload icon to push directly to Supabase Storage.
              </p>
            </div>
          </div>

          {/* Name & Headline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="full_name" required>
                Full Name
              </Label>
              <Input
                id="full_name"
                placeholder="e.g. Abdullah"
                {...register("full_name")}
              />
              {errors.full_name && (
                <p className="text-xs text-destructive">{errors.full_name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="headline" required>
                Professional Headline / Title
              </Label>
              <Input
                id="headline"
                placeholder="e.g. Full-Stack Software Engineer & AI Systems Architect"
                {...register("headline")}
              />
              {errors.headline && (
                <p className="text-xs text-destructive">{errors.headline.message}</p>
              )}
            </div>
          </div>

          {/* Career Focus */}
          <div className="space-y-1.5">
            <Label htmlFor="career_focus">Career Focus / Specialty</Label>
            <Input
              id="career_focus"
              placeholder="e.g. Scalable Web Platforms & Intelligent AI Applications"
              {...register("career_focus")}
            />
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <Label htmlFor="bio" required>
              Biography
            </Label>
            <Textarea
              id="bio"
              rows={4}
              placeholder="Describe your technical background, engineering philosophy, and expertise..."
              {...register("bio")}
            />
            {errors.bio && (
              <p className="text-xs text-destructive">{errors.bio.message}</p>
            )}
          </div>

          {/* Contact and Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="location">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                  Location
                </span>
              </Label>
              <Input
                id="location"
                placeholder="City, Country or Remote"
                {...register("location")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  Email
                </span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@domain.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                  Phone
                </span>
              </Label>
              <Input
                id="phone"
                placeholder="+1 234 567 8900"
                {...register("phone")}
              />
            </div>
          </div>

          {/* Resume & Numerical Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="resume_url">
                  <span className="flex items-center gap-1.5 font-medium">
                    <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                    Resume Document
                  </span>
                </Label>
                {resumeUrl && (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-primary hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Preview Document
                  </a>
                )}
              </div>

              {/* Hidden file input for device upload */}
              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleResumeUpload}
              />

              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  id="resume_url"
                  placeholder="Paste URL or upload file from device"
                  className="h-10 text-xs flex-1"
                  {...register("resume_url")}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUploadingResume}
                  onClick={() => resumeInputRef.current?.click()}
                  className="shrink-0 h-10 px-3.5 text-xs font-medium gap-1.5 bg-card hover:bg-accent border-border"
                >
                  <Upload className={`w-3.5 h-3.5 ${isUploadingResume ? "animate-spin" : ""}`} />
                  {isUploadingResume ? "Uploading..." : "Upload from Device"}
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Upload a PDF or Word document directly from your device, or provide a URL.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="years_experience">Years of Experience</Label>
              <Input
                id="years_experience"
                type="number"
                min={0}
                max={50}
                {...register("years_experience")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="completed_projects">Completed Projects</Label>
              <Input
                id="completed_projects"
                type="number"
                min={0}
                max={1000}
                {...register("completed_projects")}
              />
            </div>
          </div>

          {/* Availability Flag */}
          <div className="pt-2">
            <Checkbox
              id="available_for_hire"
              label="Currently Available for Hire / New Opportunities"
              description="Displays a live active status indicator badge in the public navigation and hero section."
              checked={availableForHire}
              onChange={(e) => setValue("available_for_hire", e.target.checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Submission Action Bar */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="gap-2 px-6 h-11 text-sm font-semibold shadow-md shadow-primary/20"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
              Saving Profile...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Profile Changes
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
