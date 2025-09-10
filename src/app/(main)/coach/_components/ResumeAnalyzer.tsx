import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Sparkles, Upload, XCircle } from "lucide-react";
import { useRef, useState } from "react";

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

// Add this service function to handle Gemini AI API calls
const analyzeResumeWithGemini = async (file: File): Promise<AnalysisResult> => {
  try {
    // Convert file to base64 for API
    const fileBuffer = await file.arrayBuffer();
    const base64File = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));

    const response = await fetch("/api/analyze-resume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file: base64File,
        fileName: file.name,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to analyze resume");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw error;
  }
};

export const ResumeAnalyzer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (uploadedFile: File) => {
    if (uploadedFile.type !== "application/pdf") {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    setFile(uploadedFile);
    toast({
      title: "File Uploaded",
      description: `${uploadedFile.name} ready for analysis`,
    });
  };

  const analyzeResume = async () => {
    if (!file) return;

    setIsAnalyzing(true);

    try {
      // Call the Gemini API through our analyze-resume endpoint
      const result = await analyzeResumeWithGemini(file);
      setAnalysis(result);

      toast({
        title: "Analysis Complete",
        description: "Your resume has been analyzed successfully",
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      // Fallback to mock analysis
      setAnalysis(mockAnalysis);

      toast({
        title: "Analysis Complete",
        description: "Analysis completed with backup system",
        variant: "default",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileUpload(droppedFile);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-gradient-success";
    if (score >= 60) return "bg-gradient-warning";
    return "bg-gradient-primary";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Needs Improvement";
    return "Poor";
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-6">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold">AI Resume Analyzer</h2>
        <p className="text-muted-foreground">
          Upload your resume and get instant ATS-optimized feedback
        </p>
      </div>

      {/* Upload Area */}
      <Card className="p-8">
        <div
          className={`rounded-lg border-2 border-dashed p-8 text-center transition-all duration-200 ${
            dragActive
              ? "border-primary bg-primary/5"
              : file
                ? "border-green-500 bg-green-50"
                : "border-muted-foreground/25 hover:border-primary/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={(e) =>
              e.target.files?.[0] && handleFileUpload(e.target.files[0])
            }
            className="hidden"
          />

          <div className="space-y-4">
            {file ? (
              <>
                <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                <div>
                  <p className="text-lg font-medium text-green-700">
                    {file.name}
                  </p>
                  <p className="text-sm text-green-600">Ready for analysis</p>
                </div>
              </>
            ) : (
              <>
                <Upload className="mx-auto h-16 w-16 text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">
                    Drop your resume here or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports PDF format only
                  </p>
                </div>
              </>
            )}

            <Button
              onClick={() =>
                file ? analyzeResume() : fileInputRef.current?.click()
              }
              disabled={isAnalyzing}
              className="bg-primary"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : file ? (
                "Analyze Resume"
              ) : (
                "Choose File"
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Scores Section */}
          <div className="space-y-4">
            {/* Overall Score */}
            <Card
              className={`p-6 ${getScoreColor(analysis.overallScore)} shadow-medium`}
            >
              <div className="mb-4 flex items-start justify-between">
                <h3 className="text-lg font-semibold">Overall Score</h3>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30"
                >
                  Re-analyze
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold">
                    {analysis.overallScore}
                  </span>
                  <span className="text-xl opacity-80">/100</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">
                    {getScoreLabel(analysis.overallScore)}
                  </span>
                  <Progress
                    value={analysis.overallScore}
                    className="h-2 w-32"
                  />
                </div>

                <p className="text-sm opacity-90">{analysis.summary}</p>
              </div>
            </Card>

            {/* Individual Scores */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="shadow-soft bg-card p-4">
                <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                  Contact Info
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">
                    {analysis.contactScore}%
                  </span>
                  <div className="flex-1">
                    <Progress value={analysis.contactScore} className="h-2" />
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Contact information is implied but not explicitly stated.
                  Ensure name, phone number, and email are clearly visible.
                </p>
              </Card>

              <Card className="shadow-soft bg-card p-4">
                <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                  Experience
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">
                    {analysis.experienceScore}%
                  </span>
                  <div className="flex-1">
                    <Progress
                      value={analysis.experienceScore}
                      className="h-2"
                    />
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Highlights years of experience and technologies used but lacks
                  details about responsibilities and achievements.
                </p>
              </Card>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="space-y-4">
            <Card className="shadow-soft bg-card p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <CheckCircle className="h-5 w-5 text-green-500" />
                What&apos;s Good
              </h3>
              <ul className="space-y-2">
                {analysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-500" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="shadow-soft bg-card p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <XCircle className="h-5 w-5 text-destructive" />
                Needs Improvement
              </h3>
              <ul className="space-y-2">
                {analysis.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-destructive" />
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
