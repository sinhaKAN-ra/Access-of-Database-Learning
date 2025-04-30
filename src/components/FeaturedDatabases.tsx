
import React, { useState, useEffect } from 'react';
import { getMostPopularDatabases } from '@/services/databaseService';
import { DatabaseType } from '@/types/database';
import DatabaseCard from './DatabaseCard';

const FeaturedDatabases = () => {
  const [databases, setDatabases] = useState<DatabaseType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDatabases = async () => {
      try {
        const data = await getMostPopularDatabases(3);
        setDatabases(data);
      } catch (error) {
        console.error('Error fetching featured databases:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatabases();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto my-12 px-4">
        <h2 className="text-2xl font-bold mb-6">Featured Databases</h2>
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
      <h2 className="text-2xl font-bold mb-6">Featured Databases</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {databases.map((database) => (
          <DatabaseCard key={database.id} database={database} featured={true} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedDatabases;
