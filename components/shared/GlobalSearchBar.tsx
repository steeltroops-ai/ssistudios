"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Command, FileText, Image, User } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  type: "template" | "project" | "user" | "page";
  description?: string;
  thumbnail?: string;
  url: string;
}

interface GlobalSearchBarProps {
  placeholder?: string;
  className?: string;
  isFocused?: boolean;
  onFocusChange?: (focused: boolean) => void;
}

export default function GlobalSearchBar({
  placeholder = "Search templates, projects, and more...",
  className = "",
  isFocused,
  onFocusChange,
}: GlobalSearchBarProps) {
  const [isOpen, setIsOpen] = useState(isFocused || false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock search results for demonstration
  const mockResults: SearchResult[] = [
    {
      id: "1",
      title: "Business Card Template",
      type: "template",
      description: "Professional business card design",
      url: "/templates/business-card-1",
    },
    {
      id: "2",
      title: "Corporate Poster",
      type: "project",
      description: "Event poster project",
      url: "/projects/corporate-poster",
    },
    {
      id: "3",
      title: "Certificate Template",
      type: "template",
      description: "Achievement certificate design",
      url: "/templates/certificate-1",
    },
  ];

  // Handle search
  useEffect(() => {
    if (query.length > 2) {
      setIsLoading(true);
      // Simulate API call
      const timer = setTimeout(() => {
        const filtered = mockResults.filter(
          (result) =>
            result.title.toLowerCase().includes(query.toLowerCase()) ||
            result.description?.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [query]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        onFocusChange?.(true);
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        onFocusChange?.(false);
        setQuery("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onFocusChange?.(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "template":
        return <FileText className="w-4 h-4" />;
      case "project":
        return <Image className="w-4 h-4" />;
      case "user":
        return <User className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div
          className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg cursor-text hover:bg-white/15 transition-colors"
          onClick={() => {
            setIsOpen(true);
            inputRef.current?.focus();
          }}
        >
          <Search className="w-4 h-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
          />
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                Searching...
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((result) => (
                  <motion.a
                    key={result.id}
                    href={result.url}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors cursor-pointer"
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery("");
                    }}
                  >
                    <div className="flex-shrink-0 text-gray-400">
                      {getTypeIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {result.title}
                      </div>
                      {result.description && (
                        <div className="text-sm text-gray-500 truncate">
                          {result.description}
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-xs text-gray-400 capitalize">
                      {result.type}
                    </div>
                  </motion.a>
                ))}
              </div>
            ) : query.length > 2 ? (
              <div className="p-4 text-center text-gray-500">
                No results found for "{query}"
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <div className="mb-2">Start typing to search...</div>
                <div className="text-xs text-gray-400">
                  Search templates, projects, and more
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
