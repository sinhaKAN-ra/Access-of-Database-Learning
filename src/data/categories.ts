
import { CategoryType } from "@/types/database";

export const categories: CategoryType[] = [
  {
    id: "1",
    name: "Relational",
    slug: "relational",
    description: "Traditional SQL-based databases with tables, rows, and ACID properties",
    count: 25,
    iconName: "database"
  },
  {
    id: "2",
    name: "Document",
    slug: "document",
    description: "Schema-free databases that store data in document formats like JSON",
    count: 18,
    iconName: "file-text"
  },
  {
    id: "3",
    name: "Key-Value",
    slug: "key-value",
    description: "Simple databases that store data as key-value pairs for fast access",
    count: 12,
    iconName: "link"
  },
  {
    id: "4",
    name: "Graph",
    slug: "graph",
    description: "Databases optimized for storing and querying interconnected data",
    count: 8,
    iconName: "globe"
  },
  {
    id: "5",
    name: "Time Series",
    slug: "time-series",
    description: "Optimized for time-stamped or time-series data",
    count: 10,
    iconName: "search"
  },
  {
    id: "6", 
    name: "Vector",
    slug: "vector",
    description: "Databases designed for storing and searching embedding vectors",
    count: 7,
    iconName: "map"
  },
  {
    id: "7",
    name: "In-Memory",
    slug: "in-memory",
    description: "Databases that primarily work with data stored in RAM",
    count: 5,
    iconName: "database-backup"
  },
  {
    id: "8",
    name: "Analytics",
    slug: "analytics",
    description: "Databases optimized for analytical workloads and OLAP operations",
    count: 9,
    iconName: "file-search"
  }
];
