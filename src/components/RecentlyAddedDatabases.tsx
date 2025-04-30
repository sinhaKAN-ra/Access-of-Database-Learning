
import { useState, useEffect } from "react";
import { DatabaseType } from "@/types/database";
import DatabaseCard from "./DatabaseCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getRecentlyUpdatedDatabases } from "@/services/databaseService";
import { Plus } from "lucide-react";

const RecentlyAddedDatabases = () => {
  const [recentDatabases, setRecentDatabases] = useState<DatabaseType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get recently updated databases
    const fetchDatabases = async () => {
      try {
        const data = await getRecentlyUpdatedDatabases(3);
        setRecentDatabases(data);
      } catch (error) {
        console.error("Error fetching recent databases:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDatabases();
  }, []);

  return (
    <section aria-labelledby="recently-added-heading">
      <div className="flex items-center justify-between mb-8">
        <h2 id="recently-added-heading" className="text-3xl font-semibold">Recently Added</h2>
        <Link to="/databases" aria-label="View all databases">
          <Button variant="outline">View All</Button>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 animate-pulse bg-gray-200 rounded-lg" role="status" aria-label="Loading database item">
              <span className="sr-only">Loading...</span>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-6">
            {recentDatabases.map((database) => (
              <article key={database.id} itemScope itemType="https://schema.org/SoftwareApplication">
                <meta itemProp="applicationCategory" content="Database" />
                <meta itemProp="operatingSystem" content="Multiple" />
                <DatabaseCard database={database} />
              </article>
            ))}
          </div>
          <div className="mt-8 p-4 bg-muted/30 border border-dashed rounded-lg text-center">
            <p className="text-muted-foreground mb-4">
              Missing a database? Our directory is community-driven and always growing.
            </p>
            <div className="flex justify-center">
              <Link to="/add-database" aria-label="Add a new database to our directory">
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                  Add a Database
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default RecentlyAddedDatabases;
