import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bot, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import FeaturedDatabases from "@/components/FeaturedDatabases";
import DatabaseCategories from "@/components/DatabaseCategories";
import RecentlyAddedDatabases from "@/components/RecentlyAddedDatabases";
import NewDatabases from "@/components/NewDatabases";
import FavoriteDatabases from "@/components/FavoriteDatabases";
import { Card, CardContent } from "@/components/ui/card";

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
            
            <form onSubmit={handleSearch} className="relative max-w-xl mx-auto mb-8 animate-fade-up">
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

            {/* AI Consultant CTA */}
            <Card className="mb-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                      <Bot className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-semibold mb-2 flex items-center justify-center md:justify-start gap-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      NEW: AI Database Consultant
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Get personalized database recommendations based on your project requirements. 
                      Our AI analyzes your needs and suggests the perfect database solution with architecture diagrams.
                    </p>
                    <Button 
                      onClick={() => navigate('/ai-recommendation')}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <Bot className="mr-2 h-4 w-4" />
                      Try AI Consultant
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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