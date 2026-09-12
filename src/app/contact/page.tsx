import { getProfile } from "@/lib/supabase/data-service";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { ContactSection } from "@/components/home/contact-section";

export const revalidate = 60;

export const metadata = {
  title: "Contact & Project Inquiries",
  description:
    "Get in touch for contract engineering, technical consultation, full-stack development, and AI implementations.",
};

export default async function ContactPage() {
  const profile = await getProfile();

  return (
    <div className="min-h-screen flex flex-col bg-warm-canvas text-foreground">
      <PublicNavbar
        resumeUrl={profile.resume_url}
        availableForHire={profile.available_for_hire}
      />

      <main className="flex-1 pt-24 pb-12">
        <ContactSection profile={profile} />
      </main>

      <PublicFooter />
    </div>
  );
}
