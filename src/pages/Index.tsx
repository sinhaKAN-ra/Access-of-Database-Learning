
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import FeaturedDatabases from "@/components/FeaturedDatabases";
import DatabaseCategories from "@/components/DatabaseCategories";
import RecentlyAddedDatabases from "@/components/RecentlyAddedDatabases";
import NewDatabases from "@/components/NewDatabases";
import FavoriteDatabases from "@/components/FavoriteDatabases";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container px-4 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text animate-fade-in">
              db.aolbeam.com
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-up">
              The open-source directory of databases: Access to Open Learning & Beam into the world of databases.
              Discover, compare, and contribute to our knowledge base.
            </p>
            
            <form onSubmit={handleSearch} className="relative max-w-xl mx-auto mb-16 animate-fade-up">
              <Input
                type="text"
                placeholder="Search databases by name, type, or use case..."
                className="pr-12 py-6 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="absolute right-1 top-1 bottom-1 bg-gradient-to-r from-db-primary to-db-secondary hover:opacity-90"
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </div>
          
          <div className="space-y-20">
            <FeaturedDatabases />
            <DatabaseCategories />
            <NewDatabases />
            <FavoriteDatabases />
            <RecentlyAddedDatabases />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
