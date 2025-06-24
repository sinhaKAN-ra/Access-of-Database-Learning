import { Link } from "react-router-dom";
import { DatabaseType } from "@/types/database";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DatabaseCardProps {
  database: DatabaseType;
  featured?: boolean;
}

const DatabaseCard = ({ database, featured = false }: DatabaseCardProps) => {
  return (
    <div className={`database-card ${featured ? 'border-db-primary/30 bg-gradient-to-br from-card to-muted/10' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <Link to={`/database/${database.slug}`} className="group">
          <div className="flex items-center">
            {database.logoUrl ? (
              <img 
                src={database.logoUrl} 
                alt={`${database.name} logo`} 
                className="w-10 h-10 object-contain mr-3"
              />
            ) : (
              <div className="w-10 h-10 flex items-center justify-center rounded bg-muted mr-3">
                {database.name.charAt(0)}
              </div>
            )}
            <h3 className="font-semibold text-xl group-hover:text-db-primary transition-colors">
              {database.name}
            </h3>
          </div>
        </Link>
        {featured && (
          <Badge variant="outline" className="border-db-primary text-db-primary">
            Featured
          </Badge>
        )}
      </div>

      <p className="text-muted-foreground mb-4 text-left">
        {database.shortDescription || database.description.substring(0, 120) + '...'}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="secondary">{database.type}</Badge>
        <Badge variant="secondary">{database.license}</Badge>
        <Badge variant="secondary">{database.category}</Badge>
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="flex flex-wrap gap-2">
          {database.websiteUrl && (
            <a 
              href={database.websiteUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm flex items-center text-muted-foreground hover:text-db-primary transition-colors mr-3"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Website
            </a>
          )}
          {database.documentationUrl && (
            <a 
              href={database.documentationUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm flex items-center text-muted-foreground hover:text-db-primary transition-colors mr-3"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Docs
            </a>
          )}
          {database.githubUrl && (
            <a 
              href={database.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm flex items-center text-muted-foreground hover:text-db-primary transition-colors"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              GitHub
            </a>
          )}
        </div>

        <Link 
          to={`/database/${database.slug}`} 
          className="text-sm font-medium text-db-primary hover:text-db-secondary transition-colors"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default DatabaseCard;
