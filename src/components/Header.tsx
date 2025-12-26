import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { SearchFilter } from "./SearchFilter";
import { UserMenu } from "./UserMenu";

interface HeaderProps {
  onSearch?: (query: string) => void;
  showSearch?: boolean;
}

export function Header({ onSearch, showSearch = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border transition-theme">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Leaf size={18} className="text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg text-foreground hidden sm:block">
            Journal
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {showSearch && onSearch && <SearchFilter onSearch={onSearch} />}
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
