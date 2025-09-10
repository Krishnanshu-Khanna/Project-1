"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, CheckCircle, FileText, Map } from "lucide-react";
import { useState } from "react";
import { ResumeAnalyzer } from "./_components/ResumeAnalyzer";
import RoadmapGenerator from "./_components/RoadmapGenerator";
const Index = () => {
  const [activeTab, setActiveTab] = useState("analyzer");

  return (
    <div className="flex min-h-screen flex-col bg-background text-black dark:text-white">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden bg-white px-4 py-16 dark:bg-black sm:px-8 sm:py-24">
        <div className="relative z-10 w-full max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-black dark:text-white md:text-6xl">
            Accelerate Your Career with AI
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground dark:text-gray-300">
            Transform your career journey with AI-powered resume analysis and
            personalized learning roadmaps. Get instant feedback and structured
            paths to your dream job.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="rounded-xl bg-purple-700 px-8 py-5 text-white shadow-lg transition-all duration-200 hover:scale-105 dark:text-white"
              onClick={() => setActiveTab("analyzer")}
            >
              <FileText className="mr-2 h-5 w-5" />
              Analyze Resume
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl border-2 border-purple-700 px-8 py-5 text-purple-700 transition-all duration-200 hover:bg-purple-700 hover:text-white dark:text-purple-300"
              onClick={() => setActiveTab("roadmap")}
            >
              <Map className="mr-2 h-5 w-5" />
              Generate Roadmap
            </Button>
          </div>
        </div>
      </section>

      {/* Main Application */}
      <section className="flex w-full flex-col items-center bg-muted/30 px-4 py-12 dark:bg-black/60 sm:px-8 sm:py-20">
        <div className="w-full max-w-3xl">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mx-auto mb-10 grid h-12 w-full max-w-md grid-cols-2 rounded-xl bg-white shadow dark:bg-black/70">
              <TabsTrigger
                value="analyzer"
                className="rounded-xl py-2 text-base font-medium text-black focus:outline-none focus:ring-2 focus:ring-purple-700 dark:text-white"
              >
                <FileText className="mr-2 h-4 w-4" />
                Resume Analyzer
              </TabsTrigger>
              <TabsTrigger
                value="roadmap"
                className="rounded-xl py-2 text-base font-medium text-black focus:outline-none focus:ring-2 focus:ring-purple-700 dark:text-white"
              >
                <Map className="mr-2 h-4 w-4" />
                Roadmap Generator
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analyzer" className="mt-6">
              <ResumeAnalyzer />
            </TabsContent>

            <TabsContent value="roadmap" className="mt-6">
              <RoadmapGenerator />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="flex flex-col items-center bg-muted/30 px-4 py-16 sm:px-8 sm:py-24">
        <div className="w-full max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Ready to Accelerate Your Career?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
            Join thousands of professionals who are already using our AI-powered
            tools to advance their careers
          </p>

          <div className="mb-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              className="rounded-xl bg-white px-8 py-5 font-semibold text-purple-700 transition-all duration-200 hover:bg-purple-100"
              onClick={() => setActiveTab("analyzer")}
            >
              <FileText className="mr-2 h-5 w-5" />
              Start Analysis
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-xl border-white bg-slate-800 px-8 py-5 font-semibold text-white transition-all duration-200 hover:bg-white hover:text-purple-700"
              onClick={() => setActiveTab("roadmap")}
            >
              <Map className="mr-2 h-5 w-5" />
              Create Roadmap
            </Button>
          </div>

          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              "Instant AI-powered analysis",
              "Personalized career roadmaps",
              "ATS optimization tips",
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-cream-50 flex items-center justify-center gap-2 rounded-xl px-2 py-4 text-sm shadow dark:bg-white/10"
              >
                <CheckCircle className="h-4 w-4 text-purple-300" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
