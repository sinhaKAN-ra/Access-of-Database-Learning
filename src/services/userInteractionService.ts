import HybridDatabaseService from './hybridDatabaseService';

// Updated user interaction service that works with markdown storage
// No longer requires authentication - uses GitHub usernames instead

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
}

// Simple user profile that just stores GitHub username
export const getUserProfile = async (): Promise<UserProfile | null> => {
  // Check if user has set their GitHub username in localStorage
  const username = localStorage.getItem('github_username');
  if (!username) return null;
  
  return {
    id: username,
    username,
  };
};

// Set GitHub username for user interactions
export const setGitHubUsername = (username: string): void => {
  localStorage.setItem('github_username', username);
};

// Clear GitHub username
export const clearGitHubUsername = (): void => {
  localStorage.removeItem('github_username');
};

// Comments
export const getCommentsForDatabase = async (databaseSlug: string): Promise<any[]> => {
  return await HybridDatabaseService.getComments(databaseSlug);
};

export const addComment = async (databaseSlug: string, content: string): Promise<any> => {
  const user = await getUserProfile();
  if (!user) throw new Error('GitHub username required. Please set your username first.');
  
  await HybridDatabaseService.addComment(databaseSlug, user.username, content);
  
  return {
    id: Date.now().toString(),
    databaseId: databaseSlug,
    userId: user.id,
    content,
    createdAt: new Date().toISOString(),
    user: { username: user.username },
  };
};

export const updateComment = async (commentId: string, content: string): Promise<any> => {
  // For markdown storage, we would need to implement comment editing
  // This is more complex as we need to find and update specific comments
  throw new Error('Comment editing not yet implemented for markdown storage');
};

export const deleteComment = async (commentId: string): Promise<boolean> => {
  // For markdown storage, we would need to implement comment deletion
  // This is more complex as we need to find and remove specific comments
  throw new Error('Comment deletion not yet implemented for markdown storage');
};

// Ratings
export const getRatingForDatabase = async (databaseSlug: string): Promise<{ averageRating: number; totalRatings: number }> => {
  const { averageRating, totalRatings } = await HybridDatabaseService.getRatings(databaseSlug);
  return { averageRating, totalRatings };
};

export const getUserRating = async (databaseSlug: string): Promise<any> => {
  const user = await getUserProfile();
  if (!user) return null;
  
  const { ratings } = await HybridDatabaseService.getRatings(databaseSlug);
  return ratings.find(r => r.username === user.username) || null;
};

export const addOrUpdateRating = async (databaseSlug: string, rating: number): Promise<any> => {
  const user = await getUserProfile();
  if (!user) throw new Error('GitHub username required. Please set your username first.');
  
  await HybridDatabaseService.addRating(databaseSlug, user.username, rating);
  
  return {
    id: Date.now().toString(),
    databaseId: databaseSlug,
    userId: user.id,
    rating,
    createdAt: new Date().toISOString(),
    user: { username: user.username },
  };
};

// Use Cases (simplified for markdown storage)
export const getApprovedUseCases = async (databaseSlug: string): Promise<any[]> => {
  // For now, return empty array - use cases are stored in the main database entry
  return [];
};

export const getUserSubmittedUseCases = async (databaseSlug: string): Promise<any[]> => {
  // For now, return empty array - use cases are stored in the main database entry
  return [];
};

export const submitUseCase = async (
  databaseSlug: string,
  title: string,
  description: string
): Promise<any> => {
  const user = await getUserProfile();
  if (!user) throw new Error('GitHub username required. Please set your username first.');
  
  // For markdown storage, we could add this as a comment or separate section
  // For now, we'll add it as a special comment
  const content = `**Use Case Submission**\n\n**Title:** ${title}\n\n**Description:** ${description}`;
  return await addComment(databaseSlug, content);
};

export const updateUseCase = async (
  useCaseId: string,
  title: string,
  description: string
): Promise<any> => {
  throw new Error('Use case editing not yet implemented for markdown storage');
};