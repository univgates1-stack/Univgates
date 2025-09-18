import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo/Brand Name */}
          <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img 
              src="/UnivGates-Logo.png" 
              alt="UnivGates Logo" 
              className="w-10 h-10"
            />
            <span className="text-2xl font-bold text-foreground">UnivGates</span>
          </a>

          {/* Primary Navigation - Center */}
          <nav className="hidden lg:flex items-center space-x-10">
            <a href="/" className="text-foreground hover:text-primary transition-colors font-medium">
              Home
            </a>
            <a href="/universities" className="text-foreground hover:text-primary transition-colors font-medium">
              Universities
            </a>
            <a href="/programs" className="text-foreground hover:text-primary transition-colors font-medium">
              Programs
            </a>
            <a href="/contact" className="text-foreground hover:text-primary transition-colors font-medium">
              Contact Us
            </a>
            <a href="/auth" className="text-foreground hover:text-primary transition-colors font-medium">
              Login
            </a>
          </nav>

          {/* Language Switcher & CTA */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-card">
                  <span className="font-medium">EN</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border border-border">
                <DropdownMenuItem className="cursor-pointer">
                  🇺🇸 English (EN)
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  🇹🇷 Türkçe (TR)
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  🇸🇦 العربية (AR)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <a href="/auth">
              <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-soft px-6 py-2 font-medium">
                Get Started
              </Button>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;