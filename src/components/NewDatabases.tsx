
import { useEffect, useState } from 'react';
import { getNewestDatabases } from '@/services/databaseService';
import { DatabaseType } from '@/types/database';
import DatabaseCard from './DatabaseCard';

const NewDatabases = () => {
  const [databases, setDatabases] = useState<DatabaseType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDatabases = async () => {
      try {
        const data = await getNewestDatabases(3);
        setDatabases(data);
      } catch (error) {
        console.error('Error fetching new databases:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatabases();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto my-12 px-4">
        <h2 className="text-2xl font-bold mb-6">Newest Additions</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 animate-pulse bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-12 px-4">
      <h2 className="text-2xl font-bold mb-6">Newest Additions</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {databases.map((database) => (
          <DatabaseCard key={database.id} database={database} />
        ))}
      </div>
    </div>
  );
};

export default NewDatabases;
