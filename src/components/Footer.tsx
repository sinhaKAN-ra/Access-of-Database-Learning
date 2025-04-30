
import { Link } from "react-router-dom";
import { Database, Github, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-tr from-muted/50 to-background border-t py-12 mt-20">
      <div className="container max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Database className="h-6 w-6 text-db-primary" />
              <span className="font-bold text-lg">DB.AOLBEAM</span>
            </Link>
            <p className="text-muted-foreground">
              Your comprehensive open-source directory of databases from around the world.
              Discover, compare, and contribute to the database knowledge base.
            </p>
            <div className="flex items-center space-x-4 mt-6">
              <a href="https://github.com/aolbeam/db-directory" target="_blank" rel="noopener noreferrer" 
                className="hover:text-db-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/aolbeam" target="_blank" rel="noopener noreferrer"
                className="hover:text-db-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/databases" className="text-muted-foreground hover:text-db-primary transition-colors">
                  All Databases
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-muted-foreground hover:text-db-primary transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/contribute" className="text-muted-foreground hover:text-db-primary transition-colors">
                  Contribute
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-db-primary transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/add-database" className="text-muted-foreground hover:text-db-primary transition-colors">
                  Add a Database
                </Link>
              </li>
              <li>
                <Link to="/compare" className="text-muted-foreground hover:text-db-primary transition-colors">
                  Compare Databases
                </Link>
              </li>
              <li>
                <a href="https://github.com/aolbeam/db-directory/wiki/API" className="text-muted-foreground hover:text-db-primary transition-colors">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="https://github.com/aolbeam/db-directory" target="_blank" rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-db-primary transition-colors">
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-6 text-sm text-muted-foreground text-center">
          <p>
            © {new Date().getFullYear()} db.aolbeam.com. All database information is provided 
            by the community and is licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/" 
            className="underline hover:text-db-primary transition-colors" target="_blank" rel="noopener noreferrer">
              CC BY-SA 4.0
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
