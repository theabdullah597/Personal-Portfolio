"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Send, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { submitContactFormAction } from "@/actions/contact";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(3, "Please enter a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof contactSchema>;

export function PublicContactForm() {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await submitContactFormAction(data);
      if (res.success) {
        setIsSubmitted(true);
        reset();
        showToast({
          type: "success",
          title: "Message Transmitted",
          message: "Thank you! Your message was received and logged into the CMS.",
        });
      } else {
        setErrorMessage(res.error || "Failed to submit message. Please try again.");
      }
    } catch {
      setErrorMessage("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-8 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 text-center space-y-4 animate-in fade-in shadow-soft">
        <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-xs">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-xl font-bold text-foreground">Message Sent Successfully</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Your inquiry has been logged in the portfolio CMS. I will review and reply to your email shortly.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSubmitted(false)}
          className="mt-3 rounded-full h-10 px-6 border-border/80 hover:bg-card"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact_name" required className="text-xs font-semibold">
            Your Name
          </Label>
          <Input
            id="contact_name"
            placeholder="e.g. Sarah Jenkins"
            autoComplete="name"
            className="rounded-xl h-11 bg-background/60 border-border/80 focus-visible:ring-primary"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_email" required className="text-xs font-semibold">
            Email Address
          </Label>
          <Input
            id="contact_email"
            type="email"
            placeholder="sarah@company.com"
            autoComplete="email"
            className="rounded-xl h-11 bg-background/60 border-border/80 focus-visible:ring-primary"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_subject" required className="text-xs font-semibold">
          Subject
        </Label>
        <Input
          id="contact_subject"
          placeholder="e.g. AI System Consultation / Full-Stack Project Inquiry"
          className="rounded-xl h-11 bg-background/60 border-border/80 focus-visible:ring-primary"
          {...register("subject")}
        />
        {errors.subject && (
          <p className="text-xs text-destructive">{errors.subject.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_message" required className="text-xs font-semibold">
          Message
        </Label>
        <Textarea
          id="contact_message"
          rows={5}
          placeholder="Tell me about your project scope, timeline, requirements, or inquiry..."
          className="rounded-2xl bg-background/60 border-border/80 focus-visible:ring-primary resize-none"
          {...register("message")}
        />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 text-sm font-semibold rounded-full shadow-soft hover:shadow-soft-lg gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
            Transmitting Inquiry...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Send Inquiry
          </span>
        )}
      </Button>
    </form>
  );
}
