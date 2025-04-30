
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { categories } from "@/data/categories";
import { DatabaseType, CategoryType } from "@/types/database";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import DatabaseCard from "@/components/DatabaseCard";
import { getDatabasesByCategory, searchDatabases } from "@/services/databaseService";

const CategoryDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [filteredDatabases, setFilteredDatabases] = useState<DatabaseType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Find the category based on the slug
    const foundCategory = categories.find((cat) => cat.slug === slug);
    setCategory(foundCategory || null);

    // Filter databases by the category
    if (foundCategory) {
      const fetchDatabases = async () => {
        setIsLoading(true);
        try {
          const dbsInCategory = await getDatabasesByCategory(foundCategory.name);
          setFilteredDatabases(dbsInCategory);
        } catch (error) {
          console.error("Error fetching databases by category:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchDatabases();
    } else {
      setFilteredDatabases([]);
      setIsLoading(false);
    }
  }, [slug]);

  // Filter databases based on search within category
  useEffect(() => {
    if (!category || searchQuery.trim() === "") return;
    
    const searchWithinCategory = async () => {
      setIsLoading(true);
      try {
        // Search within this category
        const allSearchResults = await searchDatabases(searchQuery);
        const filteredByCategory = allSearchResults.filter(db => db.category === category.name);
        setFilteredDatabases(filteredByCategory);
      } catch (error) {
        console.error("Error searching within category:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    searchWithinCategory();
  }, [searchQuery, category]);

  if (!category) {
    return (
      <Layout>
        <div className="pt-24 pb-16">
          <div className="container px-4 max-w-6xl">
            <h1 className="text-4xl font-bold mb-8">Category Not Found</h1>
            <p>The category you are looking for does not exist.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-24 pb-16">
        <div className="container px-4 max-w-6xl">
          <h1 className="text-4xl font-bold mb-4">{category.name} Databases</h1>
          <p className="text-lg text-muted-foreground mb-8">{category.description}</p>

          <div className="relative max-w-md mb-10">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${category.name} databases...`}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 animate-pulse bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          ) : filteredDatabases.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDatabases.map((database) => (
                <DatabaseCard key={database.id} database={database} />
              ))}
            </div>
          ) : (
            <div className="col-span-full text-center py-16">
              <h3 className="text-2xl font-semibold mb-2">No databases found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or check back later for new additions.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryDetail;
