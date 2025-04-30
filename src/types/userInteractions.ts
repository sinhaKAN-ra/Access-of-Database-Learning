export interface Comment {
  id: string;
  databaseId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    email: string;
    // Add other user fields as needed
  };
}

export interface Rating {
  averageRating(averageRating: any): unknown;
  totalRatings(totalRatings: any): unknown;
  id: string;
  databaseId: string;
  userId: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    email: string;
    // Add other user fields as needed
  };
}

export interface UserSubmittedUseCase {
  id: string;
  databaseId: string;
  userId: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  user?: {
    email: string;
    // Add other user fields as needed
  };
}

export interface DatabaseWithInteractions {
  id: string;
  name: string;
  slug: string;
  averageRating: number;
  totalRatings: number;
  totalComments: number;
  approvedUseCases: UserSubmittedUseCase[];
} 