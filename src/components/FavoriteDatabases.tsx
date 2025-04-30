
import { useState, useEffect } from "react";
import { DatabaseType } from "@/types/database";
import DatabaseCard from "./DatabaseCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getMostPopularDatabases } from "@/services/databaseService";
import { Github } from "lucide-react";

const FavoriteDatabases = () => {
  const [favoriteDatabases, setFavoriteDatabases] = useState<DatabaseType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get the most popular databases
    const fetchDatabases = async () => {
      try {
        const data = await getMostPopularDatabases(3);
        setFavoriteDatabases(data);
      } catch (error) {
        console.error("Error fetching favorite databases:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDatabases();
  }, []);

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-semibold">Favorite Databases</h2>
        <Link to="/databases">
          <Button variant="outline">View All</Button>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 animate-pulse bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-6">
            {favoriteDatabases.map((database) => (
              <DatabaseCard key={database.id} database={database} featured />
            ))}
          </div>
          <div className="mt-8 p-4 bg-muted/30 border border-dashed rounded-lg text-center">
            <p className="text-muted-foreground mb-4">
              These rankings are based on community contributions. Help improve our database by contributing!
            </p>
            <div className="flex justify-center">
              <a href="https://github.com/aolbeam/db-directory" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <Github className="mr-2 h-4 w-4" />
                  Contribute on GitHub
                </Button>
              </a>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default FavoriteDatabases;
