import { DatabaseType } from '@/types/database';
import { MarkdownDatabaseEntry } from '@/types/markdownDatabase';
import {
  getAllMarkdownDatabases,
  loadMarkdownDatabase,
  saveMarkdownDatabase,
  updateMarkdownDatabase,
  deleteMarkdownDatabase,
  convertToMarkdownEntry,
  convertFromMarkdownEntry,
  createSlug,
  addRatingToDatabase,
  addCommentToDatabase,
} from './markdownDatabaseService';
import { databases as initialDatabases } from '@/data/databases';

// This service provides a hybrid approach that can work with both Supabase and Markdown
// It will gradually transition to markdown-only storage

class HybridDatabaseService {
  private static isInitialized = false;

  // Initialize with existing data
  static async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Check if we have any markdown databases
    const markdownDatabases = await getAllMarkdownDatabases();
    
    // If no markdown databases exist, migrate from initial data
    if (markdownDatabases.length === 0) {
      console.log('Migrating initial databases to markdown format...');
      
      for (const db of initialDatabases) {
        const markdownEntry = convertToMarkdownEntry(db);
        await saveMarkdownDatabase(markdownEntry);
      }
    }

    this.isInitialized = true;
  }

  // Get all databases (from markdown)
  static async getAllDatabases(): Promise<DatabaseType[]> {
    await this.initialize();
    const markdownDatabases = await getAllMarkdownDatabases();
    return markdownDatabases.map(convertFromMarkdownEntry);
  }

  // Get database by slug
  static async getDatabaseBySlug(slug: string): Promise<DatabaseType | undefined> {
    await this.initialize();
    const markdownEntry = await loadMarkdownDatabase(slug);
    return markdownEntry ? convertFromMarkdownEntry(markdownEntry) : undefined;
  }

  // Get databases by category
  static async getDatabasesByCategory(categoryName: string): Promise<DatabaseType[]> {
    const allDatabases = await this.getAllDatabases();
    return allDatabases.filter(db => db.category === categoryName);
  }

  // Add a new database
  static async addDatabase(database: Omit<DatabaseType, "id" | "createdAt" | "updatedAt" | "slug">): Promise<DatabaseType> {
    const slug = createSlug(database.name);
    const now = new Date().toISOString();
    
    const newDatabase: DatabaseType = {
      ...database,
      id: slug,
      slug,
      createdAt: now,
      updatedAt: now,
    };

    const markdownEntry = convertToMarkdownEntry(newDatabase);
    await saveMarkdownDatabase(markdownEntry);
    
    return newDatabase;
  }

  // Update database
  static async updateDatabase(
    databaseId: string,
    updates: Partial<Omit<DatabaseType, "id" | "createdAt" | "updatedAt" | "slug">>
  ): Promise<DatabaseType> {
    const existing = await this.getDatabaseBySlug(databaseId);
    if (!existing) throw new Error(`Database ${databaseId} not found`);

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const markdownEntry = convertToMarkdownEntry(updated);
    await saveMarkdownDatabase(markdownEntry);
    
    return updated;
  }

  // Delete database
  static async deleteDatabase(slug: string): Promise<void> {
    await deleteMarkdownDatabase(slug);
  }

  // Search databases
  static async searchDatabases(query: string): Promise<DatabaseType[]> {
    const allDatabases = await this.getAllDatabases();
    const searchTerm = query.toLowerCase();
    
    return allDatabases.filter(db =>
      db.name.toLowerCase().includes(searchTerm) ||
      db.description.toLowerCase().includes(searchTerm) ||
      db.category.toLowerCase().includes(searchTerm) ||
      db.type.toLowerCase().includes(searchTerm) ||
      db.features.some(feature => feature.toLowerCase().includes(searchTerm)) ||
      db.useCases.some(useCase => useCase.toLowerCase().includes(searchTerm))
    );
  }

  // Get newest databases
  static async getNewestDatabases(limit: number = 3): Promise<DatabaseType[]> {
    const allDatabases = await this.getAllDatabases();
    return allDatabases
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  // Get most popular databases
  static async getMostPopularDatabases(limit: number = 3): Promise<DatabaseType[]> {
    const allDatabases = await this.getAllDatabases();
    return allDatabases
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, limit);
  }

  // Get recently updated databases
  static async getRecentlyUpdatedDatabases(limit: number = 3): Promise<DatabaseType[]> {
    const allDatabases = await this.getAllDatabases();
    return allDatabases
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit);
  }

  // Add rating (requires GitHub username)
  static async addRating(slug: string, username: string, rating: number, comment?: string): Promise<void> {
    if (!username) throw new Error('GitHub username is required for ratings');
    
    await addRatingToDatabase(slug, {
      username,
      rating,
      comment,
      date: new Date().toISOString(),
    });
  }

  // Add comment (requires GitHub username)
  static async addComment(slug: string, username: string, content: string): Promise<void> {
    if (!username) throw new Error('GitHub username is required for comments');
    
    await addCommentToDatabase(slug, {
      username,
      content,
      date: new Date().toISOString(),
    });
  }

  // Get ratings for a database
  static async getRatings(slug: string): Promise<{ averageRating: number; totalRatings: number; ratings: any[] }> {
    const markdownEntry = await loadMarkdownDatabase(slug);
    if (!markdownEntry) return { averageRating: 0, totalRatings: 0, ratings: [] };

    const ratings = markdownEntry.ratings;
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
      : 0;

    return { averageRating, totalRatings, ratings };
  }

  // Get comments for a database
  static async getComments(slug: string): Promise<any[]> {
    const markdownEntry = await loadMarkdownDatabase(slug);
    return markdownEntry?.comments || [];
  }
}

export default HybridDatabaseService;