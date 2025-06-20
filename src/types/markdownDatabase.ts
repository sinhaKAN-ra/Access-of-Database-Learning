export interface MarkdownDatabaseEntry {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  logoUrl?: string;
  websiteUrl?: string;
  documentationUrl?: string;
  githubUrl?: string;
  category: string;
  type: "SQL" | "NoSQL" | "NewSQL" | "Graph" | "Time Series" | "Key-Value" | "Document" | "Vector" | "Other";
  license: "Open Source" | "Commercial" | "Hybrid" | "Unknown";
  cloudOffering: boolean;
  selfHosted: boolean;
  features: string[];
  useCases: string[];
  languages: string[];
  pros: string[];
  cons: string[];
  popularity?: number;
  stars?: number;
  createdAt: string;
  updatedAt: string;
  // New fields for enhanced metadata
  tagline: string;
  keyStrength: string;
  notRecommendedFor: string[];
  useCaseDetails: UseCaseDetail[];
  contributors: string;
  // User interactions stored in markdown
  ratings: Rating[];
  comments: Comment[];
}

export interface UseCaseDetail {
  title: string;
  description: string;
  industry?: string;
  companySize?: string;
}

export interface Rating {
  username: string;
  rating: number;
  comment?: string;
  date: string;
}

export interface Comment {
  username: string;
  content: string;
  date: string;
  replies?: Comment[];
}

export interface MarkdownFrontmatter {
  name: string;
  slug: string;
  category: string;
  type: string;
  license: string;
  cloudOffering: boolean;
  selfHosted: boolean;
  popularity: number;
  stars?: number;
  createdAt: string;
  updatedAt: string;
  tagline: string;
  keyStrength: string;
  contributors: string;
}