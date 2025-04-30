
import { DatabaseType } from "@/types/database";

export const databases: DatabaseType[] = [
  {
    id: "1",
    name: "PostgreSQL",
    slug: "postgresql",
    description: "PostgreSQL is a powerful, open source object-relational database system with over 30 years of active development that has earned it a strong reputation for reliability, feature robustness, and performance.",
    shortDescription: "A powerful open source object-relational database",
    logoUrl: "https://www.postgresql.org/media/img/about/press/elephant.png",
    websiteUrl: "https://www.postgresql.org/",
    documentationUrl: "https://www.postgresql.org/docs/",
    githubUrl: "https://github.com/postgres/postgres",
    category: "Relational",
    type: "SQL",
    license: "Open Source",
    cloudOffering: true,
    selfHosted: true,
    features: [
      "ACID Compliance", 
      "JSON Support", 
      "Multi-Version Concurrency Control", 
      "Extensible", 
      "Full-Text Search"
    ],
    useCases: [
      "Enterprise Applications",
      "GIS Systems",
      "Web Applications",
      "Data Warehousing",
      "Analytics"
    ],
    languages: ["SQL", "PL/pgSQL", "C", "Python", "Java"],
    pros: [
      "Highly reliable and stable",
      "Strong community support",
      "Rich feature set",
      "Standards compliant",
      "Excellent documentation"
    ],
    cons: [
      "Can be resource intensive",
      "Complex configuration for optimal performance",
      "Steeper learning curve than some alternatives"
    ],
    createdAt: "1996-07-08",
    updatedAt: "2023-05-11",
    popularity: 95,
    stars: 12000
  },
  {
    id: "2",
    name: "MongoDB",
    slug: "mongodb",
    description: "MongoDB is a source-available cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas. MongoDB is developed by MongoDB Inc.",
    shortDescription: "Document database designed for ease of development and scaling",
    logoUrl: "https://webassets.mongodb.com/_com_assets/cms/mongodb_logo1-76twgcu2dm.png",
    websiteUrl: "https://www.mongodb.com/",
    documentationUrl: "https://docs.mongodb.com/",
    githubUrl: "https://github.com/mongodb/mongo",
    category: "Document",
    type: "NoSQL",
    license: "Hybrid",
    cloudOffering: true,
    selfHosted: true,
    features: [
      "Document Model", 
      "High Availability", 
      "Horizontal Scaling", 
      "Aggregation Framework", 
      "Indexing"
    ],
    useCases: [
      "Content Management",
      "Mobile Apps",
      "Real-time Analytics",
      "IoT Applications",
      "Catalog Management"
    ],
    languages: ["JavaScript", "Python", "Java", "C#", "Go"],
    pros: [
      "Flexible schema design",
      "Easy to scale horizontally",
      "Rich query language",
      "Good performance for document-based workloads",
      "Strong cloud offering (Atlas)"
    ],
    cons: [
      "Limited ACID transactions (prior to v4.0)",
      "Not as mature for complex reporting",
      "Storage efficiency concerns",
      "License changes in recent years"
    ],
    createdAt: "2009-02-11",
    updatedAt: "2023-06-23",
    popularity: 92,
    stars: 24000
  },
  {
    id: "3",
    name: "Redis",
    slug: "redis",
    description: "Redis is an open source (BSD licensed), in-memory data structure store, used as a database, cache, and message broker. Redis provides data structures such as strings, hashes, lists, sets, sorted sets with range queries, bitmaps, hyperloglogs, geospatial indexes, and streams.",
    shortDescription: "In-memory data structure store used as database, cache, and message broker",
    logoUrl: "https://redis.io/images/redis-white.png",
    websiteUrl: "https://redis.io/",
    documentationUrl: "https://redis.io/documentation",
    githubUrl: "https://github.com/redis/redis",
    category: "In-Memory",
    type: "Key-Value",
    license: "Open Source",
    cloudOffering: true,
    selfHosted: true,
    features: [
      "In-Memory Storage", 
      "Data Structures", 
      "Pub/Sub", 
      "Lua Scripting", 
      "Transactions"
    ],
    useCases: [
      "Caching",
      "Session Storage",
      "Real-time Analytics",
      "Leaderboards",
      "Message Queuing"
    ],
    languages: ["C", "Python", "Java", "Node.js", "Go"],
    pros: [
      "Extremely fast performance",
      "Simple and easy to use",
      "Versatile data structures",
      "Good documentation",
      "Active development"
    ],
    cons: [
      "Limited by available memory",
      "Data persistence can be complex",
      "Not suitable as a primary database for all use cases",
      "Cluster setup can be challenging"
    ],
    createdAt: "2009-05-10",
    updatedAt: "2023-04-17",
    popularity: 90,
    stars: 59000
  },
  {
    id: "4",
    name: "Neo4j",
    slug: "neo4j",
    description: "Neo4j is a graph database management system developed by Neo4j, Inc. Described by its developers as an ACID-compliant transactional database with native graph storage and processing, Neo4j is the most popular graph database according to DB-Engines ranking.",
    shortDescription: "Leading graph database for connected data applications",
    logoUrl: "https://dist.neo4j.com/wp-content/uploads/20210423072428/neo4j-logo-2020-1.svg",
    websiteUrl: "https://neo4j.com/",
    documentationUrl: "https://neo4j.com/docs/",
    githubUrl: "https://github.com/neo4j/neo4j",
    category: "Graph",
    type: "Graph",
    license: "Hybrid",
    cloudOffering: true,
    selfHosted: true,
    features: [
      "Native Graph Storage", 
      "Cypher Query Language", 
      "ACID Transactions", 
      "Causal Clustering", 
      "Full-Text Search"
    ],
    useCases: [
      "Knowledge Graphs",
      "Fraud Detection",
      "Recommendation Engines",
      "Network Management",
      "Identity & Access Management"
    ],
    languages: ["Java", "JavaScript", "Python", "Go", ".NET"],
    pros: [
      "Best for highly connected data",
      "Intuitive query language (Cypher)",
      "Powerful visualization capabilities",
      "Strong community and ecosystem",
      "Good performance for graph traversals"
    ],
    cons: [
      "Steep learning curve",
      "Can be resource intensive",
      "More specialized use cases",
      "Enterprise features require licensing"
    ],
    createdAt: "2007-01-02",
    updatedAt: "2023-02-15",
    popularity: 85,
    stars: 11000
  },
  {
    id: "5",
    name: "ClickHouse",
    slug: "clickhouse",
    description: "ClickHouse is an open-source column-oriented database management system that allows generating analytical data reports in real time. It is linearly scalable and can be deployed across multiple servers to manage huge datasets and process high-volume queries.",
    shortDescription: "Fast open-source OLAP database management system",
    logoUrl: "https://clickhouse.com/images/logo.svg",
    websiteUrl: "https://clickhouse.com/",
    documentationUrl: "https://clickhouse.com/docs/",
    githubUrl: "https://github.com/ClickHouse/ClickHouse",
    category: "Analytics",
    type: "Other",
    license: "Open Source",
    cloudOffering: true,
    selfHosted: true,
    features: [
      "Column-Oriented Storage", 
      "Vector Computation", 
      "Real-time Query Processing", 
      "Linear Scalability", 
      "Data Compression"
    ],
    useCases: [
      "Time Series Data",
      "Web Analytics",
      "Business Intelligence",
      "Monitoring Systems",
      "Ad Tech Analytics"
    ],
    languages: ["SQL", "C++", "Python", "Go", "Java"],
    pros: [
      "Extremely fast analytical queries",
      "Highly efficient data compression",
      "Good scalability",
      "SQL compatibility",
      "Low hardware requirements"
    ],
    cons: [
      "Not designed for transactional workloads",
      "Limited update/delete capabilities",
      "Learning curve for optimization",
      "Younger ecosystem compared to some alternatives"
    ],
    createdAt: "2016-06-15",
    updatedAt: "2023-07-19",
    popularity: 80,
    stars: 29000
  }
];
