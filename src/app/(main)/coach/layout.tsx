import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your AI Coach",
  description: "Get personalized career advice and growth plans with our AI-powered coach",
};

export default function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
