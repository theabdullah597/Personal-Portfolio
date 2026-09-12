"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useBrand } from "@/components/brand/brand-provider";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  subtitle?: string;
  customLogoUrl?: string | null;
  customBrandName?: string;
}

export function BrandLogo({
  className,
  size = "md",
  showText = true,
  subtitle,
  customLogoUrl,
  customBrandName,
}: BrandLogoProps) {
  const brand = useBrand();
  const [imageError, setImageError] = React.useState(false);

  // Determine active logo and brand name
  const effectiveLogoUrl =
    customLogoUrl !== undefined
      ? customLogoUrl
      : brand?.useCustomLogo
      ? brand?.logoUrl
      : null;

  const effectiveBrandName =
    customBrandName || brand?.brandName || "Abdullah";

  // Reset image error state when url changes
  React.useEffect(() => {
    setImageError(false);
  }, [effectiveLogoUrl]);

  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={cn("inline-flex items-center gap-3 group select-none", className)}>
      {/* Insignia Emblem / Dynamic Logo */}
      <div
        className={cn(
          "relative flex items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-105",
          iconSizes[size]
        )}
      >
        {/* Ambient Gradient Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500/30 to-blue-600/30 blur-md group-hover:blur-lg transition-all duration-300" />

        {/* Outer Frame with Glass Effect */}
        <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-card/90 to-card border border-border/80 shadow-md flex items-center justify-center p-2 backdrop-blur-md overflow-hidden">
          {/* Subtle Cyber Grid Lines inside logo frame */}
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:6px_6px] opacity-20" />

          {effectiveLogoUrl && !imageError ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={effectiveLogoUrl}
              alt={effectiveBrandName}
              onError={() => setImageError(true)}
              className="w-full h-full object-contain relative z-10 transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            /* Bespoke Geometric Vector Emblem */
            <svg
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full relative z-10 transition-transform duration-300 group-hover:scale-110"
            >
              {/* Linear Gradients */}
              <defs>
                <linearGradient id="brandGradPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
                <linearGradient id="brandGradAccent" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
                <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Left Bracket / Isometric Cyber Facet */}
              <path
                d="M14 8L6 20L14 32"
                stroke="url(#brandGradPrimary)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Right Bracket / Isometric Cyber Facet */}
              <path
                d="M26 8L34 20L26 32"
                stroke="url(#brandGradPrimary)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Dynamic Center Nexus: Diagonal Code Slash & Core Node */}
              <path
                d="M23 10L17 30"
                stroke="url(#brandGradAccent)"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Central Glowing Quantum Dot */}
              <circle
                cx="20"
                cy="20"
                r="2.5"
                fill="#38BDF8"
                filter="url(#logoGlow)"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Typography */}
      {showText && (
        <div className="flex flex-col">
          <span
            className={cn(
              "font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight flex items-center gap-1.5",
              textSizes[size]
            )}
          >
            {effectiveBrandName}
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
          </span>
          {subtitle && (
            <span className="text-[11px] font-medium text-muted-foreground leading-tight">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
