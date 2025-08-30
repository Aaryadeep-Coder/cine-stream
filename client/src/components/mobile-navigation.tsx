import { useState } from "react";
import { Home, Search, Bookmark, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MobileNavigation() {
  const [activeTab, setActiveTab] = useState("home");

  const navigationItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "search", icon: Search, label: "Search" },
    { id: "watchlist", icon: Bookmark, label: "My List" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-40">
      <div className="flex justify-around">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center space-y-1 ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              } transition-colors`}
              onClick={() => setActiveTab(item.id)}
              data-testid={`mobile-nav-${item.id}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
