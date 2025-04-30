
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import DatabaseCard from "@/components/DatabaseCard";
import { searchDatabases } from "@/services/databaseService";
import { DatabaseType } from "@/types/database";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const [searchResults, setSearchResults] = useState<DatabaseType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Search for databases when the query changes
  useEffect(() => {
    const query = searchParams.get("query") || "";
    setSearchQuery(query);
    
    if (query.trim()) {
      setIsLoading(true);
      const fetchResults = async () => {
        try {
          const results = await searchDatabases(query);
          setSearchResults(results);
        } catch (error) {
          console.error("Error searching databases:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchResults();
    } else {
      setSearchResults([]);
    }
  }, [searchParams]);

  // Update the URL when the search query changes
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ query: searchQuery });
    }
  };

  return (
    <Layout>
      <div className="pt-24 pb-16">
        <div className="container px-4 max-w-6xl">
          <h1 className="text-4xl font-bold mb-8">Search Results</h1>

          <form onSubmit={handleSearch} className="relative max-w-md mb-10">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search databases..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {searchQuery && (
            <p className="text-muted-foreground mb-8">
              Found {searchResults.length} {searchResults.length === 1 ? "result" : "results"} for "{searchQuery}"
            </p>
          )}

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 animate-pulse bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((database) => (
                <DatabaseCard key={database.id} database={database} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold mb-2">No databases found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or browse our categories instead.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
