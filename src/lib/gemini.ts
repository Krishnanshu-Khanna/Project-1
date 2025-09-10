import { env } from "@/env";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getUserSubscriptionLevel } from "./subscription";
import { canUseAITools } from "./permissions";
import { auth } from "@clerk/nextjs/server";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export default async function generateAIResponse(
  systemMessage: string,
  userMessage?: string,
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  if (!canUseAITools(subscriptionLevel)) {
    throw new Error("Upgrade your subscription to use this feature");
  }

  const model = genAI.getGenerativeModel({ model: env.GEMINI_MODEL });
  const result = await model.generateContentStream({
    contents: [
      {
        role: "user",
        parts: [{ text: `${systemMessage}\n${userMessage || ""}` }],
      },
    ],
  });

  let responseText = "";
  for await (const chunk of result.stream) {
    responseText += chunk.text();
  }

  return responseText;
}

export async function generateAIResponseWithPrompt(prompt: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  if (!canUseAITools(subscriptionLevel)) {
    throw new Error("Upgrade your subscription to use this feature");
  }
  const model = genAI.getGenerativeModel({ model: env.GEMINI_MODEL });
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: `${prompt}\n` }] }],
  });
  return result.response.text();
}

export async function analyzeResumeContent(
  resumeContent: string,
  fileName: string,
): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  if (!canUseAITools(subscriptionLevel)) {
    throw new Error("Upgrade your subscription to use this feature");
  }

  const model = genAI.getGenerativeModel({ model: env.GEMINI_MODEL });

  const prompt = `You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze the following resume file and provide a detailed assessment.

Resume File: ${fileName}
Resume Content: ${resumeContent}

Please provide your analysis in the following EXACT JSON format (no additional text, no markdown formatting):
{
  "overallScore": number (0-100),
  "contactScore": number (0-100),
  "experienceScore": number (0-100),
  "improvements": ["specific improvement suggestion 1", "specific improvement suggestion 2", "specific improvement suggestion 3"],
  "strengths": ["identified strength 1", "identified strength 2", "identified strength 3"],
  "summary": "brief overall summary of the resume in one paragraph"
}

Evaluation Criteria:
1. ATS Compatibility (30%):
   - Keywords relevant to the job/industry
   - Standard section headers (Experience, Education, Skills)
   - Simple, readable formatting
   - Proper use of bullet points

2. Contact Information (20%):
   - Full name clearly visible
   - Professional email address
   - Phone number
   - Location (city, state)
   - LinkedIn profile or portfolio URL

3. Experience Section (25%):
   - Clear job titles and company names
   - Employment dates
   - Quantifiable achievements (numbers, percentages, dollar amounts)
   - Action verbs and impact statements
   - Relevant responsibilities

4. Skills & Keywords (15%):
   - Technical skills relevant to target role
   - Industry-specific terminology
   - Certifications and qualifications
   - Programming languages/tools if applicable

5. Overall Quality (10%):
   - Professional appearance
   - Grammar and spelling
   - Consistent formatting
   - Appropriate length (1-2 pages)

Provide specific, actionable feedback for improvements and highlight genuine strengths. Be constructive but honest in your assessment.`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });
  console.log("Gemini response:", result.response.text());
  return result.response.text();
}
