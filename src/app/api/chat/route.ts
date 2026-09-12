import { NextRequest, NextResponse } from "next/server";
import { getProfile, getProjects, getSkills, getExperiences } from "@/lib/supabase/data-service";

/**
 * Future AI Portfolio Assistant Endpoint:
 * "Ask Abdullah — AI Portfolio Assistant"
 *
 * Designed to support future RAG / Vector search (Qdrant, pgvector) and streaming LLM responses.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    // Context retrieval architecture placeholder
    const [profile, skills, projects] = await Promise.all([
      getProfile(),
      getSkills(),
      getProjects({ publishedOnly: true }),
    ]);

    // Structured response preparing for future LLM stream
    return NextResponse.json({
      status: "ready",
      assistant: "Ask Abdullah — AI Portfolio Assistant",
      note: "AI chatbot endpoint is initialized and ready for LLM / RAG integration.",
      echo_context: {
        portfolio_owner: profile.full_name,
        available_skills_count: skills.length,
        published_projects_count: projects.length,
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "active",
    endpoint: "/api/chat",
    capabilities: [
      "Vector embeddings retrieval",
      "Semantic project search",
      "Career background synthesis",
      "LLM streaming",
    ],
  });
}
