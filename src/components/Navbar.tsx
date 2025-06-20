import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Database, Menu, X, PlusCircle, Search, Bot } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <header className="border-b backdrop-blur-sm bg-background/80 fixed w-full z-10 top-0 left-0">
      <div className="container max-w-6xl flex items-center justify-between h-16 px-4 relative">
        <Link to="/" className="flex items-center space-x-2">
          <Database className="h-6 w-6 text-db-primary" />
          <span className="font-bold text-lg">DB.AOLBEAM</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/databases"
            className="text-foreground hover:text-db-primary transition-colors"
          >
            Databases
          </Link>
          <Link
            to="/categories"
            className="text-foreground hover:text-db-primary transition-colors"
          >
            Categories
          </Link>
          <Link
            to="/ai-recommendation"
            className="text-foreground hover:text-db-primary transition-colors flex items-center gap-1"
          >
            <Bot className="h-4 w-4" />
            AI Consultant
          </Link>
          <Link
            to="/contribute"
            className="text-foreground hover:text-db-primary transition-colors"
          >
            Contribute
          </Link>
          <Link
            to="/about"
            className="text-foreground hover:text-db-primary transition-colors"
          >
            About
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-3">
          <Link to="/search">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/add-database">
            <Button className="bg-gradient-to-r from-db-primary to-db-secondary hover:opacity-90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Database
            </Button>
          </Link>
          <ThemeToggle />
          {user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="ml-2"
            >
              Logout
            </Button>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm" className="ml-2">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="sm" className="ml-2">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden py-4 px-6 space-y-4 border-t bg-background">
          <Link
            to="/databases"
            className="block py-2 text-foreground hover:text-db-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Databases
          </Link>
          <Link
            to="/categories"
            className="block py-2 text-foreground hover:text-db-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Categories
          </Link>
          <Link
            to="/ai-recommendation"
            className="block py-2 text-foreground hover:text-db-primary flex items-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <Bot className="h-4 w-4" />
            AI Consultant
          </Link>
          <Link
            to="/contribute"
            className="block py-2 text-foreground hover:text-db-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Contribute
          </Link>
          <Link
            to="/about"
            className="block py-2 text-foreground hover:text-db-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <div className="pt-4 border-t flex items-center gap-4">
            <Link
              to="/search"
              className="w-full"
              onClick={() => setIsMenuOpen(false)}
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </Link>
            <Link
              to="/add-database"
              className="w-full"
              onClick={() => setIsMenuOpen(false)}
            >
              <Button
                size="sm"
                className="bg-gradient-to-r from-db-primary to-db-secondary hover:opacity-90 w-full"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Database
              </Button>
            </Link>
          </div>
          <ThemeToggle />

          <div className="flex flex-col mt-4 space-y-2">
            {user ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
              >
                Logout
              </Button>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;