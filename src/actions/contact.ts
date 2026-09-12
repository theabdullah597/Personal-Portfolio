"use server";

import * as z from "zod";
import { Resend } from "resend";
import {
  submitContactMessage,
  toggleMessageRead,
  deleteContactMessage,
} from "@/lib/supabase/data-service";
import { revalidatePath } from "next/cache";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(150),
  message: z.string().min(10, "Message must be at least 10 characters").max(3000),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export async function submitContactFormAction(
  rawData: ContactFormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const validated = contactSchema.safeParse(rawData);
    if (!validated.success) {
      const errorMsg = validated.error.issues.map((i) => i.message).join(", ");
      return { success: false, error: errorMsg };
    }

    // 1. Save to Database (Supabase)
    const res = await submitContactMessage(validated.data);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to save message to database." };
    }

    // 2. Send Email via Resend if API key is configured
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const toEmail = process.env.CONTACT_NOTIFICATION_EMAIL;

        if (!toEmail) {
          console.warn("Resend API key is present, but CONTACT_NOTIFICATION_EMAIL is not set in .env.local. Please specify where notification emails should be sent.");
        } else {
          const fromEmail = process.env.RESEND_FROM_EMAIL || "Portfolio Inquiries <onboarding@resend.dev>";
          const emailResponse = await resend.emails.send({
            from: fromEmail,
            to: toEmail,
            replyTo: validated.data.email,
            subject: `[Portfolio Inquiry] ${validated.data.subject}`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E5E7EB; border-radius: 16px; background-color: #FFFFFF;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                  <span style="background-color: #FF7A2F; color: #FFFFFF; font-weight: bold; font-size: 12px; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em;">New Contact Inquiry</span>
                </div>
                <h2 style="color: #101A35; margin: 0 0 16px 0; font-size: 22px; font-weight: 700;">${validated.data.subject}</h2>
                <div style="background-color: #F8F4EB; padding: 16px; border-radius: 12px; margin-bottom: 20px;">
                  <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <tr>
                      <td style="padding: 6px 0; font-weight: 600; color: #4B5563; width: 80px;">From:</td>
                      <td style="padding: 6px 0; color: #101A35; font-weight: 600;">${validated.data.name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-weight: 600; color: #4B5563;">Email:</td>
                      <td style="padding: 6px 0; color: #FF7A2F;"><a href="mailto:${validated.data.email}" style="color: #FF7A2F; text-decoration: none;">${validated.data.email}</a></td>
                    </tr>
                  </table>
                </div>
                <div style="margin-bottom: 24px;">
                  <h4 style="color: #4B5563; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0;">Message Content</h4>
                  <div style="background-color: #FFFFFF; border: 1px solid #E5E7EB; border-left: 4px solid #FF7A2F; padding: 16px; border-radius: 8px; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">${validated.data.message}</div>
                </div>
                <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0 16px 0;" />
                <p style="font-size: 12px; color: #9CA3AF; margin: 0;">This inquiry was recorded in your portfolio database and dispatched by Resend.</p>
              </div>
            `,
          });

          if (emailResponse.error) {
            console.error("Resend API error:", emailResponse.error);
          }
        }
      } catch (emailErr) {
        console.error("Resend notification error:", emailErr);
      }
    }

    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to submit message";
    return { success: false, error: message };
  }
}

export async function toggleMessageReadAction(
  id: string,
  is_read: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    await toggleMessageRead(id, is_read);
    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update message status";
    return { success: false, error: message };
  }
}

export async function deleteMessageAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteContactMessage(id);
    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete message";
    return { success: false, error: message };
  }
}
