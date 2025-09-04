import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ResumeServerData } from "./types";
import { ResumeValues } from "./validation";
import { interviewCovers, mappings } from "@/constants";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fileReplacer(key: unknown, value: unknown) {
  return value instanceof File
    ? {
        name: value.name,
        size: value.size,
        type: value.type,
        lastModified: value.lastModified,
      }
    : value;
}

export function mapToResumeValues(data: ResumeServerData): ResumeValues {
  return {
    id: data.id,
    title: data.title || undefined,
    description: data.description || undefined,
    photo: data.photoUrl || undefined,
    firstName: data.firstName || undefined,
    lastName: data.lastName || undefined,
    jobTitle: data.jobTitle || undefined,
    city: data.city || undefined,
    country: data.country || undefined,
    phone: data.phone || undefined,
    email: data.email || undefined,
    linkedin: data.linkedin || undefined,
    workExperiences: data.workExperiences.map((exp) => ({
      position: exp.position || undefined,
      company: exp.company || undefined,
      city: exp.city || undefined,
      startDate: exp.startDate?.toISOString().split("T")[0],
      endDate: exp.endDate?.toISOString().split("T")[0],
      description: exp.description || undefined,
    })),
    educations: data.educations.map((edu) => ({
      degree: edu.degree || undefined,
      school: edu.school || undefined,
      grade: edu.grade || undefined,
      city: edu.city || undefined,
      startDate: edu.startDate?.toISOString().split("T")[0],
      endDate: edu.endDate?.toISOString().split("T")[0],
    })),
    projects: data.projects.map((proj) => ({
      title: proj.title || undefined,
      description: proj.description || undefined,
      link: proj.link || undefined,
      techStack: proj.techStack || undefined,
      startDate: proj.startDate?.toISOString().split("T")[0],
      endDate: proj.endDate?.toISOString().split("T")[0],
    })),
    skills: data.skills,
    borderStyle: data.borderStyle,
    colorHex: data.colorHex,
    summary: data.summary || undefined,
  };
}





const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const normalizeTechName = (tech: string) => {
  const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
  return mappings[key as keyof typeof mappings];
};

const checkIconExists = async (url: string) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok; // Returns true if the icon exists
  } catch {
    return false;
  }
};

export const getTechLogos = async (techArray: string[]) => {
  const logoURLs = techArray.map((tech) => {
    const normalized = normalizeTechName(tech);
    return {
      tech,
      url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
    };
  });

  const results = await Promise.all(
    logoURLs.map(async ({ tech, url }) => ({
      tech,
      url: (await checkIconExists(url)) ? url : "/tech.svg",
    })),
  );

  return results;
};

export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
};