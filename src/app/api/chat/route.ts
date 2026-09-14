import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  getProfile,
  getProjects,
  getSkills,
  getExperiences,
  getEducation,
  getServices,
  getSocialLinks,
} from "@/lib/supabase/data-service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set in environment variables");
      return NextResponse.json(
        { error: "AI Assistant is currently unavailable." },
        { status: 503 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    // Fetch context from the portfolio's data service
    const [profile, projects, skills, experiences, education, services, socialLinks] = await Promise.all([
      getProfile(),
      getProjects({ publishedOnly: true }),
      getSkills(),
      getExperiences(),
      getEducation(),
      getServices(true),
      getSocialLinks(),
    ]);

    // Construct the system instruction prompt
    const systemPrompt = `
You are an AI assistant representing the portfolio of ${profile.full_name}, a ${profile.headline}.
Your role is to answer questions about their work, skills, and experience professionally, enthusiastically, and accurately based ONLY on the provided context.

IMPORTANT RULES:
1. NEVER invent or hallucinate information (employment, clients, projects, salaries, certifications, technologies, education, personal details).
2. If you don't know the answer based on the context, politely state that you don't have that information and suggest contacting ${profile.full_name} via email at ${socialLinks.find(s => s.platform.toLowerCase().includes('mail'))?.url?.replace('mailto:', '') || 'their contact page'}.
3. Be concise, friendly, and professional. Avoid huge walls of text.
4. Format your responses using markdown where appropriate (lists, bold text).

CONTEXT:
--- Profile ---
Name: ${profile.full_name}
Headline: ${profile.headline}
Bio: ${profile.bio}
Location: ${profile.location}
Available for hire: ${profile.available_for_hire ? "Yes" : "No"}

--- Projects (Published) ---
${projects.map((p) => `- ${p.title} (${p.category}): ${p.short_description}. Technologies: ${p.technologies?.join(", ")}. ${p.github_url ? "GitHub: " + p.github_url : ""} ${p.live_url ? "Live: " + p.live_url : ""}`).join("\n")}

--- Skills ---
${skills.map((s) => `- ${s.name} (${s.category}, ${s.proficiency}% proficiency)`).join("\n")}

--- Experience ---
${experiences.map((e) => `- ${e.role} at ${e.company} (${e.location}). ${e.start_date} to ${e.currently_working ? "Present" : e.end_date}. ${e.description}. Tech: ${e.technologies?.join(", ")}`).join("\n")}

--- Education ---
${education.map((e) => `- ${e.degree} in ${e.field} from ${e.institution}. ${e.start_date} to ${e.currently_studying ? "Present" : e.end_date}. ${e.description}`).join("\n")}

--- Services ---
${services.map((s) => `- ${s.title}: ${s.description}. Features: ${s.features?.join(", ")}`).join("\n")}

--- Social Links ---
${socialLinks.map((s) => `- ${s.platform}: ${s.url}`).join("\n")}
`;

    // Map chat history to Gemini format
    const geminiMessages = messages.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    let responseText = "";

    try {
      // Initialize chat session
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "System Instruction: " + systemPrompt }],
          },
          {
            role: "model",
            parts: [{ text: "Understood. I will answer based ONLY on this context." }],
          },
          ...geminiMessages.slice(0, -1), // Everything except the latest message
        ],
      });

      const latestMessage = messages[messages.length - 1].content;

      // Generate the response
      const result = await chat.sendMessage(latestMessage);
      responseText = result.response.text();
    } catch (e: any) {
      console.warn("Primary model failed, falling back to gemini-pro. Error:", e.message);
      const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" });
      const chat = fallbackModel.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "System Instruction: " + systemPrompt }],
          },
          {
            role: "model",
            parts: [{ text: "Understood. I will answer based ONLY on this context." }],
          },
          ...geminiMessages.slice(0, -1),
        ],
      });
      const latestMessage = messages[messages.length - 1].content;
      const result = await chat.sendMessage(latestMessage);
      responseText = result.response.text();
    }

    return NextResponse.json({ text: responseText });
  } catch (error: any) {
    console.error("Chatbot API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process your request." },
      { status: 500 }
    );
  }
}
