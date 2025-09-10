// src/app/api/roadmap/route.ts
import { generateAIResponseWithPrompt } from "@/lib/gemini";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface RoadmapNodeData {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  category: "foundation" | "intermediate" | "advanced" | "specialization";
}

interface Roadmap {
  title: string;
  description: string;
  duration: string;
  totalNodes: number;
  nodes: RoadmapNodeData[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const roleOrPrompt = body.role;
    if (!roleOrPrompt)
      return NextResponse.json(
        { ok: false, error: "role required" },
        { status: 400 },
      );

    const prompt = `Generate a comprehensive learning roadmap for the role: "${roleOrPrompt}".

Return ONLY a valid JSON object in this exact format (no markdown, no extra text):
{
  "title": "Complete roadmap title",
  "description": "Detailed description of the learning path",
  "duration": "X-Y Months",
  "totalNodes": number,
  "nodes": [
    {
      "id": "1",
      "title": "Topic title",
      "description": "Detailed description of what to learn",
      "duration": "X-Y weeks",
      "completed": false,
      "category": "foundation"
    }
  ]
}

Requirements:
- Generate 6-10 nodes
- Categories: "foundation", "intermediate", "advanced", "specialization"
- Progressive difficulty from foundation to specialization
- Realistic durations
- Specific, actionable descriptions
- Industry-relevant skills`;

    const aiResponse = await generateAIResponseWithPrompt(prompt);

    // Clean and parse the response
    const cleanResponse = aiResponse.replace(/```json|```/g, "").trim();
    const roadmapData = JSON.parse(cleanResponse) as Roadmap;

    return NextResponse.json({ ok: true, roadmap: roadmapData });
  } catch (err) {
    console.error("Roadmap generation error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to generate roadmap" },
      { status: 500 },
    );
  }
}
