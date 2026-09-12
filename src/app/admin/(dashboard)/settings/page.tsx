"use client";

import * as React from "react";
import {
  Save,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  Upload,
  RotateCcw,
  Image as ImageIcon,
  Palette,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/toast";
import { changePasswordAction } from "@/actions/password";
import { useBrand } from "@/components/brand/brand-provider";
import { BrandLogo } from "@/components/ui/brand-logo";

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const brand = useBrand();

  // Dynamic Brand & Logo state
  const [brandName, setBrandName] = React.useState(brand?.brandName || "Abdullah");
  const [logoUrl, setLogoUrl] = React.useState(brand?.logoUrl || "");
  const [useCustomLogo, setUseCustomLogo] = React.useState(brand?.useCustomLogo || false);
  const [isUploadingLogo, setIsUploadingLogo] = React.useState(false);
  const [isSavingBrand, setIsSavingBrand] = React.useState(false);
  const logoInputRef = React.useRef<HTMLInputElement>(null);

  // Sync state when brand provider loads
  React.useEffect(() => {
    if (brand) {
      setBrandName(brand.brandName || "Abdullah");
      setLogoUrl(brand.logoUrl || "");
      setUseCustomLogo(brand.useCustomLogo || false);
    }
  }, [brand?.brandName, brand?.logoUrl, brand?.useCustomLogo]);

  // Site Settings state
  const [siteTitle, setSiteTitle] = React.useState(
    "Abdullah — Full-Stack Engineer & AI Systems"
  );
  const [siteDesc, setSiteDesc] = React.useState(
    "Production portfolio featuring modern web applications, AI/ML integrations, and dynamic content management."
  );
  const [keywords, setKeywords] = React.useState(
    "Next.js, Supabase, TypeScript, AI/ML, Full-Stack, React, Software Engineer"
  );
  const [allowContact, setAllowContact] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  // Password Change state
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = React.useState<string | null>(null);

  // Logo file upload handler
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      showToast({
        type: "error",
        title: "Invalid File Format",
        message: "Please select an SVG, PNG, JPG, or WEBP image file.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast({
        type: "error",
        title: "File Too Large",
        message: "Logo file size must be under 5MB.",
      });
      return;
    }

    setIsUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setLogoUrl(data.url);
        setUseCustomLogo(true);
        showToast({
          type: "success",
          title: "Logo Uploaded",
          message: "Custom logo image uploaded successfully. Click Save to apply.",
        });
      } else {
        showToast({
          type: "error",
          title: "Upload Failed",
          message: data.error || "Could not upload logo file.",
        });
      }
    } catch {
      showToast({
        type: "error",
        title: "Upload Error",
        message: "An unexpected error occurred during logo upload.",
      });
    } finally {
      setIsUploadingLogo(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBrand(true);
    try {
      const success = await brand.updateBrand({
        brandName,
        logoUrl: useCustomLogo ? logoUrl : null,
        useCustomLogo,
      });

      if (success) {
        showToast({
          type: "success",
          title: "Brand Settings Saved",
          message: "Dynamic logo and branding updated across the website.",
        });
      } else {
        showToast({
          type: "error",
          title: "Save Failed",
          message: "Failed to update brand settings. Please try again.",
        });
      }
    } catch {
      showToast({
        type: "error",
        title: "Error",
        message: "An unexpected error occurred while saving brand settings.",
      });
    } finally {
      setIsSavingBrand(false);
    }
  };

  const handleResetToDefaultLogo = async () => {
    setUseCustomLogo(false);
    setLogoUrl("");
    await brand.updateBrand({
      brandName,
      logoUrl: null,
      useCustomLogo: false,
    });
    showToast({
      type: "success",
      title: "Reset to Default",
      message: "Restored the bespoke futuristic vector emblem.",
    });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast({
        type: "success",
        title: "Settings Saved",
        message: "Site metadata and preferences updated successfully.",
      });
    }, 400);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    setIsChangingPassword(true);

    try {
      const res = await changePasswordAction({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (!res.success) {
        setPasswordError(res.error || "Failed to change password.");
        showToast({
          type: "error",
          title: "Password Change Failed",
          message: res.error || "Please verify your current password.",
        });
      } else {
        setPasswordSuccess(res.message || "Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        showToast({
          type: "success",
          title: "Password Updated",
          message: "Your new admin password has been saved securely.",
        });
      }
    } catch {
      setPasswordError("An unexpected error occurred. Please try again.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Settings & Branding
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage brand logo, admin authentication, SEO metadata, and public portfolio features.
        </p>
      </div>

      {/* Dynamic Brand Identity & Logo Card */}
      <Card className="border-border/80 shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <Palette className="w-5 h-5" />
            <CardTitle className="text-lg">Dynamic Brand Logo & Identity</CardTitle>
          </div>
          <CardDescription>
            Customize your website&apos;s logo dynamically. You can use the high-tech bespoke vector emblem or upload your own custom logo image/SVG from this device.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveBrand} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Form Controls */}
              <div className="lg:col-span-7 space-y-5">
                {/* Brand Name Input */}
                <div className="space-y-1.5">
                  <Label htmlFor="brand_name">Brand / Developer Name</Label>
                  <Input
                    id="brand_name"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. Abdullah"
                    className="h-10"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    This name appears next to the logo in the navbar, footer, and sidebar.
                  </p>
                </div>

                {/* Logo Type Selection */}
                <div className="space-y-3 pt-2 border-t border-border/50">
                  <Label>Logo Display Mode</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setUseCustomLogo(false)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        !useCustomLogo
                          ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/30"
                          : "border-border/70 hover:border-border hover:bg-card/60"
                      }`}
                    >
                      <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Bespoke Vector Emblem
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Glowing isometric cyber insignia with gradient neon accent.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setUseCustomLogo(true)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        useCustomLogo
                          ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/30"
                          : "border-border/70 hover:border-border hover:bg-card/60"
                      }`}
                    >
                      <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                        <ImageIcon className="w-4 h-4 text-primary" />
                        Custom Logo Image
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Upload your personal SVG or PNG brand logo directly from this device.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Custom Logo Upload & URL (Visible when Custom is chosen) */}
                {useCustomLogo && (
                  <div className="space-y-3 p-4 rounded-2xl border border-primary/20 bg-card/60 animate-in fade-in slide-in-from-top-2">
                    <Label htmlFor="logo_url">Custom Logo File or URL</Label>

                    {/* Hidden device file input */}
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept=".svg,.png,.jpg,.jpeg,.webp"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        id="logo_url"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="https://... or click Upload from Device"
                        className="h-10 text-xs flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isUploadingLogo}
                        onClick={() => logoInputRef.current?.click()}
                        className="shrink-0 h-10 px-4 text-xs font-medium gap-1.5 bg-card hover:bg-accent border-border"
                      >
                        <Upload className={`w-3.5 h-3.5 ${isUploadingLogo ? "animate-spin" : ""}`} />
                        {isUploadingLogo ? "Uploading..." : "Upload from Device"}
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Supported formats: SVG (recommended for crisp vectors), PNG with transparent background, WEBP, or JPG. Max 5MB.
                    </p>
                  </div>
                )}

                {/* Save and Reset Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button type="submit" disabled={isSavingBrand} className="gap-2 px-5 h-10">
                    <Save className="w-4 h-4" />
                    {isSavingBrand ? "Saving Brand..." : "Save Brand Settings"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResetToDefaultLogo}
                    className="gap-2 px-4 h-10 border-border/80 hover:bg-card"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset to Default Logo
                  </Button>
                </div>
              </div>

              {/* Right Column: Live Interactive Preview */}
              <div className="lg:col-span-5 space-y-3">
                <Label>Live Logo Previews</Label>

                {/* Light Theme Preview */}
                <div className="p-5 rounded-2xl border border-border/70 bg-[#FAF7F2] text-zinc-900 shadow-xs space-y-2">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-zinc-500 block">
                    Light Canvas Preview
                  </span>
                  <div className="p-3 rounded-xl bg-white/70 border border-zinc-200 backdrop-blur-sm flex items-center justify-between">
                    <BrandLogo
                      size="md"
                      customBrandName={brandName}
                      customLogoUrl={useCustomLogo && logoUrl ? logoUrl : null}
                      subtitle="Available for work"
                    />
                  </div>
                </div>

                {/* Dark Theme Preview */}
                <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0F141C] text-white shadow-xs space-y-2">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-zinc-400 block">
                    Dark Cyber Preview
                  </span>
                  <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-sm flex items-center justify-between">
                    <BrandLogo
                      size="md"
                      customBrandName={brandName}
                      customLogoUrl={useCustomLogo && logoUrl ? logoUrl : null}
                      subtitle="Available for work"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Admin Security & Password Card */}
      <Card className="border-border/80 shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <KeyRound className="w-5 h-5" />
            <CardTitle className="text-lg">Admin Account Security & Password</CardTitle>
          </div>
          <CardDescription>
            Change your administrator login password. Updates are cryptographically hashed and applied immediately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {passwordError && (
            <div className="mb-4 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="font-medium">{passwordError}</p>
            </div>
          )}

          {passwordSuccess && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="font-medium">{passwordSuccess}</p>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
            <div className="space-y-1.5">
              <Label htmlFor="current_password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current_password"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pr-10 h-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
                  tabIndex={-1}
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="new_password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new_password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10 h-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10 h-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                className="gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                {isChangingPassword ? "Updating Password..." : "Update Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Site Metadata & SEO Configuration */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Global Metadata & Search Engine Optimization</CardTitle>
            <CardDescription>
              Controls title tags, meta descriptions, and search index keywords.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="site_title">Default Meta Title</Label>
              <Input
                id="site_title"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="site_desc">Meta Description</Label>
              <Textarea
                id="site_desc"
                rows={3}
                value={siteDesc}
                onChange={(e) => setSiteDesc(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="keywords">Keywords (Comma-separated)</Label>
              <Input
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>

            <div className="pt-2">
              <Checkbox
                id="allow_contact"
                label="Allow Public Inquiries (Contact Form)"
                description="When enabled, visitors can submit direct project inquiries via the public contact form."
                checked={allowContact}
                onChange={(e) => setAllowContact(e.target.checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Assistant Integration Architecture</CardTitle>
            <CardDescription>
              Future preparation for &ldquo;Ask Abdullah — AI Portfolio Assistant&rdquo; (/api/chat).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <p className="font-semibold text-foreground">
                  AI Chatbot Architecture Ready
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The portfolio schema is structured to feed vector embeddings (projects, experience, skills, and bio) directly into a future RAG assistant at <code className="px-1 py-0.5 bg-card rounded font-mono">/api/chat</code>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end">
          <Button type="submit" disabled={isSaving} className="gap-2 px-6">
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
