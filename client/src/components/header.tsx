import { useState } from "react";
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

export default function Header({ onSearch, searchQuery }: HeaderProps) {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-primary text-2xl font-bold" data-testid="logo">
            StreamFlix
          </h1>
          <nav className="hidden md:flex space-x-6">
            <a 
              href="#" 
              className="text-foreground hover:text-primary transition-colors" 
              data-testid="nav-home"
            >
              Home
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors" 
              data-testid="nav-movies"
            >
              Movies
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors" 
              data-testid="nav-tv-shows"
            >
              TV Shows
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors" 
              data-testid="nav-my-list"
            >
              My List
            </a>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className={`relative ${isSearchVisible ? 'block' : 'hidden md:block'}`}>
            <Input
              type="text"
              placeholder="Search movies..."
              className="bg-input border border-border rounded-md px-4 py-2 pl-10 w-64 focus:outline-none focus:ring-2 focus:ring-ring"
              value={searchQuery}
              onChange={handleSearchInput}
              data-testid="search-input"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-foreground hover:text-primary"
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            data-testid="search-toggle-mobile"
          >
            <Search className="w-5 h-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground hover:text-primary"
            data-testid="notifications-button"
          >
            <Bell className="w-5 h-5" />
          </Button>
          
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-semibold" data-testid="user-avatar">
              JD
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
