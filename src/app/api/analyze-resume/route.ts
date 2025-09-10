import { NextRequest, NextResponse } from "next/server";
import { analyzeResumeContent } from "@/lib/gemini";

interface AnalysisResult {
  overallScore: number;
  contactScore: number;
  experienceScore: number;
  improvements: string[];
  strengths: string[];
  summary: string;
}

const mockAnalysis: AnalysisResult = {
  overallScore: 65,
  contactScore: 75,
  experienceScore: 70,
  improvements: [
    "Poor formatting and typos make the resume look unprofessional",
    "Lacks detail in key areas, such as responsibilities, achievements, and education",
    "Missing essential contact information",
  ],
  strengths: [
    "Highlights 10+ years of experience",
    "Mentions proficiency in key technologies like .NET Core, Angular, and Azure",
    "Indicates experience with Microservices and Team Lead roles",
  ],
  summary:
    "The resume shows potential but suffers from poor formatting and a lack of detail in key areas. Clearer presentation and more quantifiable achievements are needed.",
};

async function analyzeResumeWithGemini(
  base64File: string,
  fileName: string,
): Promise<AnalysisResult> {
  try {
    const resumeText = `Resume file: ${fileName}
    
This is a sample resume analysis. In a production environment, you would:
1. Extract text from the PDF using libraries like pdf-parse or pdf2pic
2. Use OCR for scanned documents
3. Parse the extracted text for better analysis

The file has been uploaded as: ${fileName}
Base64 content length: ${base64File.length} characters`;

    const response = await analyzeResumeContent(resumeText, fileName);

    // Parse the JSON response from Gemini
    const cleanResponse = response.replace(/```json|```/g, "").trim();
    const analysis = JSON.parse(cleanResponse);

    return analysis as AnalysisResult;
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    // Fallback to mock analysis if Gemini fails
    return mockAnalysis;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { file, fileName } = await req.json();
    if (!file || !fileName) {
      return NextResponse.json(
        { error: "Missing file or fileName" },
        { status: 400 },
      );
    }
    // Call Gemini (or mock)
    const analysis = await analyzeResumeWithGemini(file, fileName);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Failed to analyze resume:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 },
    );
  }
}
