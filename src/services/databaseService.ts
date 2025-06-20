import { DatabaseType } from "@/types/database";
import HybridDatabaseService from './hybridDatabaseService';

// This service now acts as a facade for the hybrid service
// All functions now use markdown storage instead of Supabase

// Get all databases
export const getAllDatabases = async (): Promise<DatabaseType[]> => {
  return await HybridDatabaseService.getAllDatabases();
};

// Get database by slug
export const getDatabaseBySlug = async (slug: string): Promise<DatabaseType | undefined> => {
  return await HybridDatabaseService.getDatabaseBySlug(slug);
};

// Get databases by category
export const getDatabasesByCategory = async (categoryName: string): Promise<DatabaseType[]> => {
  return await HybridDatabaseService.getDatabasesByCategory(categoryName);
};

// Add a new database
export const addDatabase = async (database: Omit<DatabaseType, "id" | "createdAt" | "updatedAt" | "slug">): Promise<DatabaseType> => {
  return await HybridDatabaseService.addDatabase(database);
};

// Get newest databases
export const getNewestDatabases = async (limit: number = 3): Promise<DatabaseType[]> => {
  return await HybridDatabaseService.getNewestDatabases(limit);
};

// Get most popular databases
export const getMostPopularDatabases = async (limit: number = 3): Promise<DatabaseType[]> => {
  return await HybridDatabaseService.getMostPopularDatabases(limit);
};

// Get recently updated databases
export const getRecentlyUpdatedDatabases = async (limit: number = 3): Promise<DatabaseType[]> => {
  return await HybridDatabaseService.getRecentlyUpdatedDatabases(limit);
};

// Search databases
export const searchDatabases = async (query: string): Promise<DatabaseType[]> => {
  return await HybridDatabaseService.searchDatabases(query);
};

// Update database
export const updateDatabase = async (
  databaseId: string,
  updates: Partial<Omit<DatabaseType, "id" | "createdAt" | "updatedAt" | "slug">>
): Promise<DatabaseType> => {
  return await HybridDatabaseService.updateDatabase(databaseId, updates);
};

// Delete database
export const deleteDatabase = async (slug: string): Promise<void> => {
  return await HybridDatabaseService.deleteDatabase(slug);
};