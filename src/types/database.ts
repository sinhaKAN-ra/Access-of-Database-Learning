
export interface DatabaseType {
  tagline: string;
  keyStrength: string;
  notRecommendedFor: any;
  useCaseDetails: any;
  contributors: string;
  id: string;
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
  createdAt: string;
  updatedAt: string;
  popularity?: number;
  stars?: number;
}

export interface CategoryType {
  id: string;
  name: string;
  slug: string;
  description: string;
  count: number;
  iconName: string;
}
