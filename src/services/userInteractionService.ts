import { supabase } from "@/integrations/supabase/client";
import { Comment, Rating, UserSubmittedUseCase } from "@/types/userInteractions";

// Helper function to map database row to Comment type
const mapToComment = (row: any): Comment => ({
  id: row.id,
  databaseId: row.database_id,
  userId: row.user_id,
  content: row.content,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  user: row.user
});

// Helper function to map database row to Rating type
const mapToRating = (row: any): Rating => ({
  id: row.id,
  databaseId: row.database_id,
  userId: row.user_id,
  rating: row.rating,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  user: row.user,
  averageRating: function (averageRating: any): unknown {
    throw new Error("Function not implemented.");
  },
  totalRatings: function (totalRatings: any): unknown {
    throw new Error("Function not implemented.");
  }
});

// Helper function to map database row to UserSubmittedUseCase type
const mapToUseCase = (row: any): UserSubmittedUseCase => ({
  id: row.id,
  databaseId: row.database_id,
  userId: row.user_id,
  title: row.title,
  description: row.description,
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  user: row.user
});

// User Profile
export interface UserProfile {
  id: string;
  email: string;
  [key: string]: any;
}

/**
 * Fetches the current user's profile from Supabase auth.
 */
export const getUserProfile = async (): Promise<UserProfile | null> => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  return {
    id: user.id,
    email: user.email,
    ...user.user_metadata
  };
};

// Comments
export const getCommentsForDatabase = async (databaseId: string): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      user:user_id (email)
    `)
    .eq("database_id", databaseId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching comments:", error);
    return [];
  }

  return (data || []).map(mapToComment);
};

export const addComment = async (databaseId: string, content: string): Promise<Comment | null> => {
  const { data, error } = await supabase
    .from("comments")
    .insert({
      database_id: databaseId,
      content,
    })
    .select(`
      *,
      user:user_id (email)
    `)
    .single();

  if (error) {
    console.error("Error adding comment:", error);
    return null;
  }

  return data ? mapToComment(data) : null;
};

export const updateComment = async (commentId: string, content: string): Promise<Comment | null> => {
  const { data, error } = await supabase
    .from("comments")
    .update({ content })
    .eq("id", commentId)
    .select(`
      *,
      user:user_id (email)
    `)
    .single();

  if (error) {
    console.error("Error updating comment:", error);
    return null;
  }

  return data ? mapToComment(data) : null;
};

export const deleteComment = async (commentId: string): Promise<boolean> => {
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) {
    console.error("Error deleting comment:", error);
    return false;
  }

  return true;
};

// Ratings
export const getRatingForDatabase = async (databaseId: string): Promise<{ averageRating: number; totalRatings: number }> => {
  const { data, error } = await supabase
    .from("ratings")
    .select("rating")
    .eq("database_id", databaseId);

  if (error) {
    console.error("Error fetching ratings:", error);
    return { averageRating: 0, totalRatings: 0 };
  }

  const ratings = data || [];
  const totalRatings = ratings.length;
  const averageRating = totalRatings > 0
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
    : 0;

  return { averageRating, totalRatings };
};

export const getUserRating = async (databaseId: string): Promise<Rating | null> => {
  const { data, error } = await supabase
    .from("ratings")
    .select(`
      *,
      user:user_id (email)
    `)
    .eq("database_id", databaseId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rating found
      return null;
    }
    console.error("Error fetching user rating:", error);
    return null;
  }

  return data ? mapToRating(data) : null;
};

export const addOrUpdateRating = async (databaseId: string, rating: number): Promise<Rating | null> => {
  const { data, error } = await supabase
    .from("ratings")
    .upsert({
      database_id: databaseId,
      rating,
    })
    .select(`
      *,
      user:user_id (email)
    `)
    .single();

  if (error) {
    console.error("Error adding/updating rating:", error);
    return null;
  }

  return data ? mapToRating(data) : null;
};

// Use Cases
export const getApprovedUseCases = async (databaseId: string): Promise<UserSubmittedUseCase[]> => {
  const { data, error } = await supabase
    .from("user_submitted_use_cases")
    .select(`
      *,
      user:user_id (email)
    `)
    .eq("database_id", databaseId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching use cases:", error);
    return [];
  }

  return (data || []).map(mapToUseCase);
};

export const getUserSubmittedUseCases = async (databaseId: string): Promise<UserSubmittedUseCase[]> => {
  const { data, error } = await supabase
    .from("user_submitted_use_cases")
    .select(`
      *,
      user:user_id (email)
    `)
    .eq("database_id", databaseId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user submitted use cases:", error);
    return [];
  }

  return (data || []).map(mapToUseCase);
};

export const submitUseCase = async (
  databaseId: string,
  title: string,
  description: string
): Promise<UserSubmittedUseCase | null> => {
  const { data, error } = await supabase
    .from("user_submitted_use_cases")
    .insert({
      database_id: databaseId,
      title,
      description,
      status: "pending",
    })
    .select(`
      *,
      user:user_id (email)
    `)
    .single();

  if (error) {
    console.error("Error submitting use case:", error);
    return null;
  }

  return data ? mapToUseCase(data) : null;
};

export const updateUseCase = async (
  useCaseId: string,
  title: string,
  description: string
): Promise<UserSubmittedUseCase | null> => {
  const { data, error } = await supabase
    .from("user_submitted_use_cases")
    .update({
      title,
      description,
    })
    .eq("id", useCaseId)
    .select(`
      *,
      user:user_id (email)
    `)
    .single();

  if (error) {
    console.error("Error updating use case:", error);
    return null;
  }

  return data ? mapToUseCase(data) : null;
}; 