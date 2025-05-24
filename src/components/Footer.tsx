
import { Link } from "react-router-dom";
import { Database, Github, Twitter } from "lucide-react";

type FooterLink = {
  title: string;
  links: {
    name: string;
    href: string;
  }[]
}

const footerLinks: FooterLink[] = [
  {
    title: "Navigation",
    links: [
      { name: "All Databases", href: "/databases" },
      { name: "Categories", href: "/categories" },
      { name: "Contribute", href: "/contribute" },
      { name: "About", href: "/about" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Add a Database", href: "/add-database" },
      { name: "Compare Databases", href: "/compare" },
      { name: "API Documentation", href: "https://github.com/sinhaKAN-ra/Access-of-Database-Learning" },
      { name: "GitHub Repository", href: "https://github.com/sinhaKAN-ra/Access-of-Database-Learning" }
    ]
  }
]

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
            <p className="text-muted-foreground text-left">
              Your comprehensive open-source directory of databases from around the world.
              Discover, compare, and contribute to the database knowledge base.
            </p>
            <div className="flex items-center space-x-4 mt-6">
              <a href="https://github.com/sinhaKAN-ra/Access-of-Database-Learning" target="_blank" rel="noopener noreferrer" 
                className="hover:text-db-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/aolbeam" target="_blank" rel="noopener noreferrer"
                className="hover:text-db-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, index) => (
                  <li key={index}>
                    <Link to={link.href} className="text-muted-foreground hover:text-db-primary transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
