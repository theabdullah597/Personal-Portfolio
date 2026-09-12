"use client";

import { Mail, MapPin, Phone, MessageSquare, Sparkles } from "lucide-react";
import { Profile } from "@/types";
import { PublicContactForm } from "@/components/contact/public-contact-form";
import { FadeIn } from "@/components/animations/fade-in";

interface ContactSectionProps {
  profile: Profile;
}

export function ContactSection({ profile }: ContactSectionProps) {
  return (
    <section className="py-24 border-t border-border/60 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeIn delay={0.1} direction="up">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
              <MessageSquare className="w-3.5 h-3.5" />
              Let&apos;s Build Something
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Get In Touch
            </h2>
            <p className="text-base text-muted-foreground">
              Have a product engineering inquiry, architecture consultation, or generative AI initiative? Let&apos;s start a conversation.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Direct Cards */}
          <FadeIn delay={0.2} direction="right" className="lg:col-span-5 space-y-4">
            <div className="p-8 rounded-3xl border border-border/80 bg-card shadow-soft space-y-7">
              <h3 className="text-lg font-bold text-foreground">
                Contact Information
              </h3>

              <div className="space-y-5 text-xs">
                {profile.email && (
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 shadow-xs">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-medium">Email Address</span>
                      <a
                        href={`mailto:${profile.email}`}
                        className="font-bold text-foreground hover:text-primary transition-colors text-base"
                      >
                        {profile.email}
                      </a>
                    </div>
                  </div>
                )}

                {profile.location && (
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 shadow-xs">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-medium">Location</span>
                      <span className="font-bold text-foreground text-base">
                        {profile.location}
                      </span>
                    </div>
                  </div>
                )}

                {profile.phone && (
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 shadow-xs">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-medium">Direct Phone</span>
                      <span className="font-bold text-foreground text-base">
                        {profile.phone}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <Sparkles className="w-3.5 h-3.5" />
                  Direct Response Guarantee
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Inquiries submitted through this form are logged directly to the portfolio CMS dashboard for prompt review.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Form */}
          <FadeIn delay={0.25} direction="left" className="lg:col-span-7 p-8 sm:p-10 rounded-3xl border border-border/80 bg-card shadow-soft">
            <PublicContactForm />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
