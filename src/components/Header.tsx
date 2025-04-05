
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  User, 
  Moon, 
  Sun,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isLoggedIn?: boolean;
}

export function Header({ isDarkMode, toggleDarkMode, isLoggedIn = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "AI Doctor", path: "/symptom-checker" },
    { name: "Mental Health", path: "/mental-health" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8 rounded-full bg-gradient-to-r from-health-blue to-health-green flex items-center justify-center">
              <span className="text-white font-bold text-sm">A+</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline-block">
              ArogyaAI+
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>

          {isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full relative"
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-health-red"></span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="User menu"
                asChild
              >
                <Link to="/profile">
                  <User size={18} />
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="hidden md:inline-flex"
                asChild
              >
                <Link to="/login">Sign In</Link>
              </Button>
              <Button className="hidden md:inline-flex" asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden fixed inset-x-0 top-16 z-50 mt-px border-b border-border bg-background/80 backdrop-blur-md transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <nav className="container flex flex-col gap-4 py-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-sm font-medium transition-colors hover:text-primary p-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          {!isLoggedIn && (
            <div className="flex flex-col gap-2 mt-2">
              <Button variant="outline" asChild>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
