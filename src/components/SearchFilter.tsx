import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchFilterProps {
  onSearch: (query: string) => void;
  className?: string;
}

export function SearchFilter({ onSearch, className }: SearchFilterProps) {
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="flex items-center gap-2">
        {!isExpanded ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Search size={20} />
          </Button>
        ) : (
          <>
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="text"
                placeholder="Search posts..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  onSearch(e.target.value);
                }}
                className="pl-10 pr-10 bg-muted/50 border-border focus:bg-background"
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsExpanded(false);
                handleClear();
              }}
              className="text-muted-foreground"
            >
              Cancel
            </Button>
          </>
        )}
      </div>
    </form>
  );
}
