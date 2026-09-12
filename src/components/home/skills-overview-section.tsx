"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";
import { motion } from "framer-motion";
import { Skill } from "@/types";
import { Button } from "@/components/ui/button";
import { SkillIcon } from "@/components/ui/skill-icon";
import { FadeIn } from "@/components/animations/fade-in";

interface SkillsOverviewSectionProps {
  skills: Skill[];
}

export function SkillsOverviewSection({ skills }: SkillsOverviewSectionProps) {
  const categories = React.useMemo(() => {
    const cats = Array.from(
      new Set(skills.map((s) => s.category).filter(Boolean))
    );
    return ["All", ...cats];
  }, [skills]);

  const [activeCategory, setActiveCategory] = React.useState("All");

  const filtered = React.useMemo(() => {
    if (activeCategory === "All") {
      const featured = skills.filter((s) => s.featured);
      // Show featured skills if available; otherwise show all skills
      return featured.length > 0 ? featured : skills;
    }
    return skills.filter(
      (s) => s.category?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [skills, activeCategory]);

  return (
    <section className="py-24 border-t border-border/60 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeIn delay={0.1} direction="up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
                <Wrench className="w-3.5 h-3.5" />
                Technical Competencies
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                Skills & Technologies
              </h2>
              <p className="text-base text-muted-foreground max-w-xl">
                Modern engineering stack spanning AI/ML systems, full-stack frameworks, high-throughput APIs, and cloud infrastructure.
              </p>
            </div>

            <Link href="/skills">
              <Button variant="outline" size="sm" className="gap-2 shrink-0 rounded-full h-10 px-5 border-border/80 hover:bg-card">
                Explore All Skills
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </FadeIn>

        {/* Category Filter Pills */}
        <FadeIn delay={0.2} direction="up">
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-xs cursor-pointer ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-card text-muted-foreground hover:text-foreground border border-border/70 hover:border-primary/40"
                }`}
              >
                {cat === "All" ? "Featured Stack" : cat}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Skills Cards Grid - Keyed by activeCategory so switching tabs re-animates smoothly without dropping cards */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
        >
          {filtered.map((skill) => (
            <div
              key={skill.id}
              className="p-5 rounded-2xl border border-border/80 bg-card hover:border-primary/50 transition-all duration-300 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 space-y-3 h-full"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 shadow-xs">
                  <SkillIcon name={skill.icon} className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-foreground truncate">
                    {skill.name}
                  </h4>
                  <span className="text-[11px] text-muted-foreground block truncate font-medium">
                    {skill.category}
                  </span>
                </div>
              </div>

              {skill.description && (
                <p className="text-xs text-muted-foreground/80 line-clamp-1">
                  {skill.description}
                </p>
              )}

              {/* Meter */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="font-medium">Proficiency</span>
                  <span className="font-mono font-semibold text-primary">{skill.proficiency ?? 85}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-primary rounded-full transition-all duration-500"
                    style={{ width: `${skill.proficiency ?? 85}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
