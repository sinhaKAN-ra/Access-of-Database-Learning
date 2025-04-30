import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatabaseType } from "@/types/database";
import Layout from "@/components/Layout";
import DatabaseCard from "@/components/DatabaseCard";
import { Search, Filter } from "lucide-react";
import { useLocation } from "react-router-dom";
import { getAllDatabases } from "@/services/databaseService";

const DatabasesPage = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [licenseFilter, setLicenseFilter] = useState("all");
  const [databases, setDatabases] = useState<DatabaseType[]>([]);
  const [filteredDatabases, setFilteredDatabases] = useState<DatabaseType[]>([]);
  const [loading, setLoading] = useState(true);

  // Load databases from Supabase
  useEffect(() => {
    const loadDatabases = async () => {
      try {
        const data = await getAllDatabases();
        setDatabases(data);
        setFilteredDatabases(data);
      } catch (error) {
        console.error("Error loading databases:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDatabases();
  }, []);

  // Get unique categories, types and licenses
  const categories = ["all", ...new Set(databases.map((db) => db.category))];
  const types = ["all", ...new Set(databases.map((db) => db.type))];
  const licenses = ["all", ...new Set(databases.map((db) => db.license))];

  // Extract search parameter from URL if present
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchFromUrl = searchParams.get("search");
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
  }, [location.search]);

  // Filter databases based on search and filters
  useEffect(() => {
    let results = [...databases];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter((db) => 
        db.name.toLowerCase().includes(query) || 
        db.description.toLowerCase().includes(query) ||
        db.type.toLowerCase().includes(query) ||
        db.features.some(feature => feature.toLowerCase().includes(query)) ||
        db.useCases.some(useCase => useCase.toLowerCase().includes(query))
      );
    }
    
    if (categoryFilter !== "all") {
      results = results.filter((db) => db.category === categoryFilter);
    }
    
    if (typeFilter !== "all") {
      results = results.filter((db) => db.type === typeFilter);
    }
    
    if (licenseFilter !== "all") {
      results = results.filter((db) => db.license === licenseFilter);
    }
    
    setFilteredDatabases(results);
  }, [searchQuery, categoryFilter, typeFilter, licenseFilter, databases]);

  if (loading) {
    return (
      <Layout>
        <div className="pt-24 pb-16">
          <div className="container px-4 max-w-6xl">
            <p>Loading databases...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-24 pb-16">
        <div className="container px-4 max-w-6xl">
          <h1 className="text-4xl font-bold mb-8">Database Directory</h1>

          {/* Search and filters */}
          <div className="bg-card border rounded-lg p-6 mb-10">
            <div className="grid gap-6 md:grid-cols-[1fr_auto_auto_auto] items-end">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search databases..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div>
                <p className="text-sm mb-2 text-muted-foreground">Category</p>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <p className="text-sm mb-2 text-muted-foreground">Type</p>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <p className="text-sm mb-2 text-muted-foreground">License</p>
                <Select value={licenseFilter} onValueChange={setLicenseFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {licenses.map((license) => (
                      <SelectItem key={license} value={license}>
                        {license.charAt(0).toUpperCase() + license.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center mt-4 text-sm text-muted-foreground">
              <Filter className="h-4 w-4 mr-2" />
              <p>
                {filteredDatabases.length} {filteredDatabases.length === 1 ? "database" : "databases"} found
              </p>
            </div>
          </div>

          {/* Results */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDatabases.length > 0 ? (
              filteredDatabases.map((database) => (
                <DatabaseCard key={database.id} database={database} />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <h3 className="text-2xl font-semibold mb-2">No databases found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DatabasesPage;
