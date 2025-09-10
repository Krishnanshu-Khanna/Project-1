import { generateAIResponseWithPrompt } from "@/lib/gemini";

export async function generateCustomRoadmap(role: string) {
  if (!role) throw new Error("Role is required");
  const prompt = `Generate a learning roadmap for the role: ${role}. Format as JSON with title, description, duration, totalNodes, and nodes (id, title, description, duration, completed, category).`;
  const roadmap = await generateAIResponseWithPrompt(prompt);
  return roadmap;
}
