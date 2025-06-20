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
  // Enhanced metadata fields
  tagline: string;
  keyStrength: string;
  notRecommendedFor: string[];
  useCaseDetails: UseCaseDetail[];
  contributors: string;
  // User interactions stored in markdown
  ratings: Rating[];
  comments: Comment[];
  // Additional comprehensive fields
  officialDescription: string;
  architecture: string;
  dataModel: string;
  queryLanguage: string[];
  indexingSupport: string[];
  replicationSupport: boolean;
  shardingSupport: boolean;
  backupOptions: string[];
  securityFeatures: string[];
  performanceCharacteristics: string[];
  scalabilityOptions: string[];
  communitySize: string;
  enterpriseSupport: boolean;
  cloudProviders: string[];
  onPremiseSupport: boolean;
  apiSupport: string[];
  integrations: string[];
  developmentStatus: string;
  latestVersion: string;
  releaseFrequency: string;
  maintenanceStatus: string;
}

export interface UseCaseDetail {
  title: string;
  description: string;
  industry?: string;
  companySize?: string;
  technicalRequirements?: string[];
  benefits?: string[];
  challenges?: string[];
}

export interface Rating {
  username: string;
  email?: string;
  rating: number;
  comment?: string;
  date: string;
  experience?: string; // e.g., "2 years", "6 months"
  useCase?: string; // What they used it for
  companySize?: string;
  industry?: string;
}

export interface Comment {
  username: string;
  email?: string;
  content: string;
  date: string;
  replies?: Comment[];
  experience?: string;
  useCase?: string;
  helpful?: number; // Number of people who found this helpful
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
  officialDescription: string;
  architecture: string;
  dataModel: string;
  replicationSupport: boolean;
  shardingSupport: boolean;
  enterpriseSupport: boolean;
  onPremiseSupport: boolean;
  developmentStatus: string;
  latestVersion: string;
  maintenanceStatus: string;
}