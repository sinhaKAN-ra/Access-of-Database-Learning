import { MarkdownDatabaseEntry, MarkdownFrontmatter, Rating, Comment } from '@/types/markdownDatabase';
import { DatabaseType } from '@/types/database';

// Utility function to create slug from name
export const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

// Utility function to parse frontmatter from markdown content
export const parseFrontmatter = (content: string): { frontmatter: MarkdownFrontmatter; body: string } => {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    throw new Error('Invalid markdown format: missing frontmatter');
  }

  const frontmatterText = match[1];
  const body = match[2];
  
  // Parse YAML-like frontmatter
  const frontmatter: any = {};
  frontmatterText.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      
      // Parse different value types
      if (value === 'true') frontmatter[key] = true;
      else if (value === 'false') frontmatter[key] = false;
      else if (!isNaN(Number(value)) && value !== '') frontmatter[key] = Number(value);
      else frontmatter[key] = value.replace(/^["']|["']$/g, ''); // Remove quotes
    }
  });

  return { frontmatter: frontmatter as MarkdownFrontmatter, body };
};

// Utility function to generate frontmatter string
export const generateFrontmatter = (data: MarkdownFrontmatter): string => {
  return `---
name: "${data.name}"
slug: "${data.slug}"
category: "${data.category}"
type: "${data.type}"
license: "${data.license}"
cloudOffering: ${data.cloudOffering}
selfHosted: ${data.selfHosted}
popularity: ${data.popularity}
stars: ${data.stars || 0}
createdAt: "${data.createdAt}"
updatedAt: "${data.updatedAt}"
tagline: "${data.tagline}"
keyStrength: "${data.keyStrength}"
contributors: "${data.contributors}"
---`;
};

// Parse markdown content to extract structured data
export const parseMarkdownDatabase = (content: string): MarkdownDatabaseEntry => {
  const { frontmatter, body } = parseFrontmatter(content);
  
  // Parse body sections
  const sections = body.split('\n## ').map(section => section.trim()).filter(Boolean);
  
  const entry: MarkdownDatabaseEntry = {
    ...frontmatter,
    description: '',
    shortDescription: '',
    logoUrl: '',
    websiteUrl: '',
    documentationUrl: '',
    githubUrl: '',
    features: [],
    useCases: [],
    languages: [],
    pros: [],
    cons: [],
    notRecommendedFor: [],
    useCaseDetails: [],
    ratings: [],
    comments: [],
  };

  sections.forEach(section => {
    const lines = section.split('\n');
    const title = lines[0].replace(/^## /, '').trim();
    const content = lines.slice(1).join('\n').trim();

    switch (title) {
      case 'Description':
        entry.description = content;
        break;
      case 'Short Description':
        entry.shortDescription = content;
        break;
      case 'Links':
        const linkLines = content.split('\n');
        linkLines.forEach(line => {
          if (line.includes('Website:')) entry.websiteUrl = line.split('Website:')[1].trim();
          if (line.includes('Documentation:')) entry.documentationUrl = line.split('Documentation:')[1].trim();
          if (line.includes('GitHub:')) entry.githubUrl = line.split('GitHub:')[1].trim();
          if (line.includes('Logo:')) entry.logoUrl = line.split('Logo:')[1].trim();
        });
        break;
      case 'Features':
        entry.features = content.split('\n').map(line => line.replace(/^- /, '')).filter(Boolean);
        break;
      case 'Use Cases':
        entry.useCases = content.split('\n').map(line => line.replace(/^- /, '')).filter(Boolean);
        break;
      case 'Supported Languages':
        entry.languages = content.split('\n').map(line => line.replace(/^- /, '')).filter(Boolean);
        break;
      case 'Pros':
        entry.pros = content.split('\n').map(line => line.replace(/^- /, '')).filter(Boolean);
        break;
      case 'Cons':
        entry.cons = content.split('\n').map(line => line.replace(/^- /, '')).filter(Boolean);
        break;
      case 'Not Recommended For':
        entry.notRecommendedFor = content.split('\n').map(line => line.replace(/^- /, '')).filter(Boolean);
        break;
      case 'Ratings':
        // Parse ratings from markdown
        const ratingBlocks = content.split('\n\n').filter(Boolean);
        entry.ratings = ratingBlocks.map(block => {
          const lines = block.split('\n');
          const userLine = lines[0];
          const ratingLine = lines[1];
          const commentLines = lines.slice(2);
          
          return {
            username: userLine.replace(/^User: /, ''),
            rating: parseInt(ratingLine.replace(/^Rating: /, '')),
            comment: commentLines.join('\n'),
            date: new Date().toISOString(),
          };
        });
        break;
      case 'Comments':
        // Parse comments from markdown
        const commentBlocks = content.split('\n\n').filter(Boolean);
        entry.comments = commentBlocks.map(block => {
          const lines = block.split('\n');
          const userLine = lines[0];
          const dateLine = lines[1];
          const contentLines = lines.slice(2);
          
          return {
            username: userLine.replace(/^User: /, ''),
            date: dateLine.replace(/^Date: /, ''),
            content: contentLines.join('\n'),
          };
        });
        break;
    }
  });

  return entry;
};

// Generate markdown content from database entry
export const generateMarkdownContent = (entry: MarkdownDatabaseEntry): string => {
  const frontmatter = generateFrontmatter({
    name: entry.name,
    slug: entry.slug,
    category: entry.category,
    type: entry.type,
    license: entry.license,
    cloudOffering: entry.cloudOffering,
    selfHosted: entry.selfHosted,
    popularity: entry.popularity || 50,
    stars: entry.stars,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
    tagline: entry.tagline,
    keyStrength: entry.keyStrength,
    contributors: entry.contributors,
  });

  const sections = [
    frontmatter,
    '',
    '## Description',
    entry.description,
    '',
    '## Short Description',
    entry.shortDescription || '',
    '',
    '## Links',
    entry.websiteUrl ? `Website: ${entry.websiteUrl}` : '',
    entry.documentationUrl ? `Documentation: ${entry.documentationUrl}` : '',
    entry.githubUrl ? `GitHub: ${entry.githubUrl}` : '',
    entry.logoUrl ? `Logo: ${entry.logoUrl}` : '',
    '',
    '## Features',
    ...entry.features.map(feature => `- ${feature}`),
    '',
    '## Use Cases',
    ...entry.useCases.map(useCase => `- ${useCase}`),
    '',
    '## Supported Languages',
    ...entry.languages.map(language => `- ${language}`),
    '',
    '## Pros',
    ...entry.pros.map(pro => `- ${pro}`),
    '',
    '## Cons',
    ...entry.cons.map(con => `- ${con}`),
    '',
    '## Not Recommended For',
    ...entry.notRecommendedFor.map(item => `- ${item}`),
    '',
    '## Ratings',
    ...entry.ratings.map(rating => 
      `User: ${rating.username}\nRating: ${rating.rating}\n${rating.comment || ''}`
    ),
    '',
    '## Comments',
    ...entry.comments.map(comment => 
      `User: ${comment.username}\nDate: ${comment.date}\n${comment.content}`
    ),
  ];

  return sections.filter(section => section !== '').join('\n');
};

// Convert DatabaseType to MarkdownDatabaseEntry
export const convertToMarkdownEntry = (db: DatabaseType): MarkdownDatabaseEntry => {
  return {
    name: db.name,
    slug: db.slug,
    description: db.description,
    shortDescription: db.shortDescription,
    logoUrl: db.logoUrl,
    websiteUrl: db.websiteUrl,
    documentationUrl: db.documentationUrl,
    githubUrl: db.githubUrl,
    category: db.category,
    type: db.type,
    license: db.license,
    cloudOffering: db.cloudOffering,
    selfHosted: db.selfHosted,
    features: db.features,
    useCases: db.useCases,
    languages: db.languages,
    pros: db.pros,
    cons: db.cons,
    popularity: db.popularity,
    stars: db.stars,
    createdAt: db.createdAt,
    updatedAt: db.updatedAt,
    tagline: db.tagline || '',
    keyStrength: db.keyStrength || '',
    notRecommendedFor: db.notRecommendedFor || [],
    useCaseDetails: db.useCaseDetails || [],
    contributors: db.contributors || '',
    ratings: [],
    comments: [],
  };
};

// Convert MarkdownDatabaseEntry to DatabaseType
export const convertFromMarkdownEntry = (entry: MarkdownDatabaseEntry): DatabaseType => {
  return {
    id: entry.slug, // Use slug as ID for markdown-based entries
    name: entry.name,
    slug: entry.slug,
    description: entry.description,
    shortDescription: entry.shortDescription,
    logoUrl: entry.logoUrl,
    websiteUrl: entry.websiteUrl,
    documentationUrl: entry.documentationUrl,
    githubUrl: entry.githubUrl,
    category: entry.category,
    type: entry.type,
    license: entry.license,
    cloudOffering: entry.cloudOffering,
    selfHosted: entry.selfHosted,
    features: entry.features,
    useCases: entry.useCases,
    languages: entry.languages,
    pros: entry.pros,
    cons: entry.cons,
    popularity: entry.popularity,
    stars: entry.stars,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
    tagline: entry.tagline,
    keyStrength: entry.keyStrength,
    notRecommendedFor: entry.notRecommendedFor,
    useCaseDetails: entry.useCaseDetails,
    contributors: entry.contributors,
  };
};

// File system operations (these would be implemented differently in a real environment)
// For now, we'll simulate file operations with localStorage or in-memory storage

class MarkdownFileSystem {
  private static readonly STORAGE_KEY = 'markdown_databases';

  static async writeFile(path: string, content: string): Promise<void> {
    const databases = this.getAllFiles();
    databases[path] = content;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(databases));
  }

  static async readFile(path: string): Promise<string | null> {
    const databases = this.getAllFiles();
    return databases[path] || null;
  }

  static async fileExists(path: string): Promise<boolean> {
    const databases = this.getAllFiles();
    return path in databases;
  }

  static async listFiles(directory: string): Promise<string[]> {
    const databases = this.getAllFiles();
    return Object.keys(databases).filter(path => path.startsWith(directory));
  }

  static async deleteFile(path: string): Promise<void> {
    const databases = this.getAllFiles();
    delete databases[path];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(databases));
  }

  private static getAllFiles(): Record<string, string> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  }
}

// Main service functions
export const saveMarkdownDatabase = async (entry: MarkdownDatabaseEntry): Promise<void> => {
  const slug = entry.slug || createSlug(entry.name);
  const path = `src/database/${slug}/${slug}.md`;
  const content = generateMarkdownContent(entry);
  
  await MarkdownFileSystem.writeFile(path, content);
};

export const loadMarkdownDatabase = async (slug: string): Promise<MarkdownDatabaseEntry | null> => {
  const path = `src/database/${slug}/${slug}.md`;
  const content = await MarkdownFileSystem.readFile(path);
  
  if (!content) return null;
  
  return parseMarkdownDatabase(content);
};

export const getAllMarkdownDatabases = async (): Promise<MarkdownDatabaseEntry[]> => {
  const files = await MarkdownFileSystem.listFiles('src/database/');
  const databases: MarkdownDatabaseEntry[] = [];
  
  for (const file of files) {
    if (file.endsWith('.md')) {
      const content = await MarkdownFileSystem.readFile(file);
      if (content) {
        try {
          const entry = parseMarkdownDatabase(content);
          databases.push(entry);
        } catch (error) {
          console.error(`Error parsing ${file}:`, error);
        }
      }
    }
  }
  
  return databases;
};

export const updateMarkdownDatabase = async (slug: string, updates: Partial<MarkdownDatabaseEntry>): Promise<void> => {
  const existing = await loadMarkdownDatabase(slug);
  if (!existing) throw new Error(`Database ${slug} not found`);
  
  const updated = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  await saveMarkdownDatabase(updated);
};

export const deleteMarkdownDatabase = async (slug: string): Promise<void> => {
  const path = `src/database/${slug}/${slug}.md`;
  await MarkdownFileSystem.deleteFile(path);
};

export const addRatingToDatabase = async (slug: string, rating: Rating): Promise<void> => {
  const existing = await loadMarkdownDatabase(slug);
  if (!existing) throw new Error(`Database ${slug} not found`);
  
  // Remove existing rating from same user
  existing.ratings = existing.ratings.filter(r => r.username !== rating.username);
  existing.ratings.push(rating);
  
  await saveMarkdownDatabase(existing);
};

export const addCommentToDatabase = async (slug: string, comment: Comment): Promise<void> => {
  const existing = await loadMarkdownDatabase(slug);
  if (!existing) throw new Error(`Database ${slug} not found`);
  
  existing.comments.push(comment);
  
  await saveMarkdownDatabase(existing);
};