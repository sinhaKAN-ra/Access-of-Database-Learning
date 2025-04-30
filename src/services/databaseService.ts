import { supabase } from "@/integrations/supabase/client";
import { DatabaseType } from "@/types/database";
import { databases as initialDatabases } from "@/data/databases";

// This type adds the databases table to the Supabase types
type SupabaseDatabase = {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string | null;
  logo_url: string | null;
  website_url: string | null;
  documentation_url: string | null;
  github_url: string | null;
  category: string;
  type: string;
  license: string;
  cloud_offering: boolean | null;
  self_hosted: boolean | null;
  features: string[] | null;
  use_cases: string[] | null;
  languages: string[] | null;
  pros: string[] | null;
  cons: string[] | null;
  created_at: string;
  updated_at: string;
  popularity: number | null;
  stars: number | null;
};

// Initialize databases - if Supabase table is empty, seed it with initial data
const initializeDatabases = async (): Promise<void> => {
  const { data, error } = await supabase
    .from("databases")
    .select("*")
    .limit(1) as { data: SupabaseDatabase[] | null; error: any };
  
  if (error) {
    console.error("Error checking databases:", error);
    return;
  }
  
  // If no data found, seed the database with initial data
  if (data && data.length === 0) {
    console.log("Seeding Supabase with initial database entries...");
    
    // Insert initial databases
    for (const db of initialDatabases) {
      await supabase
        .from("databases")
        .insert({
          ...db,
          cloud_offering: db.cloudOffering,
          self_hosted: db.selfHosted,
          features: db.features,
          use_cases: db.useCases,
          short_description: db.shortDescription,
          logo_url: db.logoUrl,
          website_url: db.websiteUrl,
          documentation_url: db.documentationUrl,
          github_url: db.githubUrl,
          created_at: new Date(db.createdAt).toISOString(),
          updated_at: new Date(db.updatedAt).toISOString()
        });
    }
  }
};

// Call the initialization function when the app starts
initializeDatabases().catch(console.error);

// Helper function to map Supabase database to our DatabaseType
const mapToDatabase = (db: SupabaseDatabase): DatabaseType => {
  return {
    id: db.id,
    name: db.name,
    slug: db.slug,
    description: db.description,
    shortDescription: db.short_description || undefined,
    logoUrl: db.logo_url || undefined,
    websiteUrl: db.website_url || undefined,
    documentationUrl: db.documentation_url || undefined,
    githubUrl: db.github_url || undefined,
    category: db.category,
    type: db.type as DatabaseType["type"],
    license: db.license as DatabaseType["license"],
    cloudOffering: db.cloud_offering || false,
    selfHosted: db.self_hosted || false,
    features: db.features || [],
    useCases: db.use_cases || [],
    languages: db.languages || [],
    pros: db.pros || [],
    cons: db.cons || [],
    createdAt: db.created_at,
    updatedAt: db.updated_at,
    popularity: db.popularity || 50,
    stars: db.stars ?? undefined,
    tagline: '',
    keyStrength: '',
    notRecommendedFor: [],
    useCaseDetails: [],
    contributors: ''
  };
};

// Get all databases
export const getAllDatabases = async (): Promise<DatabaseType[]> => {
  const { data, error } = await supabase
    .from("databases")
    .select("*") as { data: SupabaseDatabase[] | null; error: any };
  
  if (error) {
    console.error("Error fetching databases:", error);
    return [];
  }
  
  // Map Supabase data structure to our DatabaseType
  return data ? data.map(mapToDatabase) : [];
};

// Get database by slug
export const getDatabaseBySlug = async (slug: string): Promise<DatabaseType | undefined> => {
  const { data, error } = await supabase
    .from("databases")
    .select("*")
    .eq("slug", slug) as { data: SupabaseDatabase[] | null; error: any };
  
  if (error) {
    console.error("Error fetching database by slug:", error);
    return undefined;
  }
  
  // Map Supabase data to DatabaseType
  return data && data.length > 0 ? mapToDatabase(data[0]) : undefined;
};

// Get databases by category
export const getDatabasesByCategory = async (categoryName: string): Promise<DatabaseType[]> => {
  const { data, error } = await supabase
    .from("databases")
    .select("*")
    .eq("category", categoryName) as { data: SupabaseDatabase[] | null; error: any };
  
  if (error) {
    console.error("Error fetching databases by category:", error);
    return [];
  }
  
  // Map Supabase data structure to our DatabaseType
  return data ? data.map(mapToDatabase) : [];
};

// Add a new database
export const addDatabase = async (database: Omit<DatabaseType, "id" | "createdAt" | "updatedAt" | "slug">): Promise<DatabaseType> => {
  // Create slug from name
  const slug = database.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  
  // Create new database object with Supabase compatible field names
  const newDatabase = {
    name: database.name,
    slug: slug,
    description: database.description,
    short_description: database.shortDescription,
    logo_url: database.logoUrl,
    website_url: database.websiteUrl,
    documentation_url: database.documentationUrl,
    github_url: database.githubUrl,
    category: database.category,
    type: database.type,
    license: database.license,
    cloud_offering: database.cloudOffering,
    self_hosted: database.selfHosted,
    features: database.features,
    use_cases: database.useCases,
    languages: database.languages,
    pros: database.pros,
    cons: database.cons,
    popularity: database.popularity || 50,
    stars: database.stars
  };
  
  // Insert into Supabase
  const { data, error } = await supabase
    .from("databases")
    .insert(newDatabase)
    .select() as { data: SupabaseDatabase[] | null; error: any };
  
  if (error) {
    console.error("Error adding database:", error);
    throw new Error(`Failed to add database: ${error.message}`);
  }
  
  if (!data || data.length === 0) {
    throw new Error("Failed to add database: No data returned");
  }
  
  // Return the newly created database with correct field mappings
  return mapToDatabase(data[0]);
};

// Get newest databases
export const getNewestDatabases = async (limit: number = 3): Promise<DatabaseType[]> => {
  const { data, error } = await supabase
    .from("databases")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit) as { data: SupabaseDatabase[] | null; error: any };
  
  if (error) {
    console.error("Error fetching newest databases:", error);
    return [];
  }
  
  // Map Supabase data structure to our DatabaseType
  return data ? data.map(mapToDatabase) : [];
};

// Get most popular databases
export const getMostPopularDatabases = async (limit: number = 3): Promise<DatabaseType[]> => {
  const { data, error } = await supabase
    .from("databases")
    .select("*")
    .order("popularity", { ascending: false })
    .limit(limit) as { data: SupabaseDatabase[] | null; error: any };
  
  if (error) {
    console.error("Error fetching popular databases:", error);
    return [];
  }
  
  // Map Supabase data structure to our DatabaseType
  return data ? data.map(mapToDatabase) : [];
};

// Get recently updated databases
export const getRecentlyUpdatedDatabases = async (limit: number = 3): Promise<DatabaseType[]> => {
  const { data, error } = await supabase
    .from("databases")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(limit) as { data: SupabaseDatabase[] | null; error: any };
  
  if (error) {
    console.error("Error fetching recently updated databases:", error);
    return [];
  }
  
  // Map Supabase data structure to our DatabaseType
  return data ? data.map(mapToDatabase) : [];
};

// Search databases
export const searchDatabases = async (query: string): Promise<DatabaseType[]> => {
  // Using Supabase's built-in text search capability
  const { data, error } = await supabase
    .from("databases")
    .select("*")
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%,type.ilike.%${query}%`) as { data: SupabaseDatabase[] | null; error: any };
  
  if (error) {
    console.error("Error searching databases:", error);
    return [];
  }
  
  // Map Supabase data structure to our DatabaseType
  return data ? data.map(mapToDatabase) : [];
};

// Update database
export const updateDatabase = async (
  databaseId: string,
  updates: Partial<Omit<DatabaseType, "id" | "createdAt" | "updatedAt" | "slug">>
): Promise<DatabaseType> => {
  // Create new database object with Supabase compatible field names
  const updatedDatabase = {
    name: updates.name,
    description: updates.description,
    short_description: updates.shortDescription,
    logo_url: updates.logoUrl,
    website_url: updates.websiteUrl,
    documentation_url: updates.documentationUrl,
    github_url: updates.githubUrl,
    category: updates.category,
    type: updates.type,
    license: updates.license,
    cloud_offering: updates.cloudOffering,
    self_hosted: updates.selfHosted,
    features: updates.features,
    use_cases: updates.useCases,
    languages: updates.languages,
    pros: updates.pros,
    cons: updates.cons,
    popularity: updates.popularity,
    stars: updates.stars
  };

  // Update in Supabase
  const { data, error } = await supabase
    .from("databases")
    .update(updatedDatabase)
    .eq("id", databaseId)
    .select() as { data: SupabaseDatabase[] | null; error: any };

  if (error) {
    console.error("Error updating database:", error);
    throw new Error(`Failed to update database: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error("Failed to update database: No data returned");
  }

  // Return the updated database with correct field mappings
  return mapToDatabase(data[0]);
};
