
import { Link } from "react-router-dom";
import { CategoryType } from "@/types/database";
import { 
  Database, FileText, Link as LinkIcon, Globe, 
  Search, Map, DatabaseBackup, FileSearch 
} from "lucide-react";

interface CategoryCardProps {
  category: CategoryType;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  // Map category icon name to actual icon component
  const getIcon = () => {
    switch (category.iconName) {
      case "database":
        return <Database className="h-8 w-8 text-db-primary" />;
      case "file-text":
        return <FileText className="h-8 w-8 text-db-primary" />;
      case "link":
        return <LinkIcon className="h-8 w-8 text-db-primary" />;
      case "globe":
        return <Globe className="h-8 w-8 text-db-primary" />;
      case "search":
        return <Search className="h-8 w-8 text-db-primary" />;
      case "map":
        return <Map className="h-8 w-8 text-db-primary" />;
      case "database-backup":
        return <DatabaseBackup className="h-8 w-8 text-db-primary" />;
      case "file-search":
        return <FileSearch className="h-8 w-8 text-db-primary" />;
      default:
        return <Database className="h-8 w-8 text-db-primary" />;
    }
  };

  return (
    <Link 
      to={`/category/${category.slug}`}
      className="database-card group"
    >
      <div className="flex flex-col items-center text-center p-4">
        <div className="rounded-full bg-db-primary/10 p-4 mb-4 group-hover:bg-db-primary/20 transition-colors">
          {getIcon()}
        </div>
        <h3 className="font-semibold text-lg mb-2 group-hover:text-db-primary transition-colors">
          {category.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          {category.description}
        </p>
        <span className="text-sm font-medium text-db-secondary">
          {category.count} databases
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;
