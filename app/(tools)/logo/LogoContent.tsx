"use client";

import { Fragment, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Palette,
  Eye,
  Download,
  Heart,
  Star,
  Search,
  Filter,
  Grid,
  List,
  SortAsc,
  SortDesc,
  X,
  Plus,
  Edit,
  Trash2,
  Share,
  Copy,
  Tag,
  Calendar,
  TrendingUp,
  Clock,
  User,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import { PageBackground } from "@/components/shared/ThemeBackground";

// TypeScript interfaces for logo data
interface Logo {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
  author: string;
  createdAt: string;
  downloads: number;
  likes: number;
  isFavorite: boolean;
  fileSize: string;
  format: string;
  dimensions: string;
}

interface FilterState {
  search: string;
  categories: string[];
  sortBy: "popular" | "recent" | "alphabetical" | "downloads" | "likes";
  sortOrder: "asc" | "desc";
  viewMode: "grid" | "list";
}

// Sample logo data (in production, this would come from an API)
const sampleLogos: Logo[] = [
  {
    id: "1",
    title: "Modern Tech Logo",
    description: "Clean, minimalist logo perfect for tech companies",
    imageUrl: "/api/placeholder/400/400",
    thumbnailUrl: "/api/placeholder/200/200",
    category: "Tech",
    tags: ["minimalist", "tech", "modern", "blue"],
    author: "SSI Studios",
    createdAt: "2024-01-15",
    downloads: 1250,
    likes: 89,
    isFavorite: false,
    fileSize: "2.4 MB",
    format: "SVG",
    dimensions: "1000x1000",
  },
  {
    id: "2",
    title: "Gradient Brand Mark",
    description: "Vibrant gradient logo with dynamic energy",
    imageUrl: "/api/placeholder/400/400",
    thumbnailUrl: "/api/placeholder/200/200",
    category: "Gradient",
    tags: ["gradient", "colorful", "energy", "brand"],
    author: "SSI Studios",
    createdAt: "2024-01-10",
    downloads: 890,
    likes: 156,
    isFavorite: true,
    fileSize: "3.1 MB",
    format: "PNG",
    dimensions: "2000x2000",
  },
  {
    id: "3",
    title: "Corporate Identity",
    description: "Professional logo for corporate branding",
    imageUrl: "/api/placeholder/400/400",
    thumbnailUrl: "/api/placeholder/200/200",
    category: "Corporate",
    tags: ["corporate", "professional", "business", "clean"],
    author: "SSI Studios",
    createdAt: "2024-01-08",
    downloads: 2100,
    likes: 203,
    isFavorite: false,
    fileSize: "1.8 MB",
    format: "SVG",
    dimensions: "800x800",
  },
  {
    id: "4",
    title: "Creative Studio Mark",
    description: "Artistic logo for creative agencies",
    imageUrl: "/api/placeholder/400/400",
    thumbnailUrl: "/api/placeholder/200/200",
    category: "Creative",
    tags: ["creative", "artistic", "studio", "colorful"],
    author: "SSI Studios",
    createdAt: "2024-01-05",
    downloads: 675,
    likes: 124,
    isFavorite: true,
    fileSize: "4.2 MB",
    format: "PNG",
    dimensions: "1500x1500",
  },
  {
    id: "5",
    title: "Minimalist Icon",
    description: "Simple, elegant icon design",
    imageUrl: "/api/placeholder/400/400",
    thumbnailUrl: "/api/placeholder/200/200",
    category: "Minimalist",
    tags: ["minimalist", "simple", "icon", "elegant"],
    author: "SSI Studios",
    createdAt: "2024-01-03",
    downloads: 1450,
    likes: 267,
    isFavorite: false,
    fileSize: "1.2 MB",
    format: "SVG",
    dimensions: "500x500",
  },
  {
    id: "6",
    title: "Vintage Badge",
    description: "Retro-style badge with classic appeal",
    imageUrl: "/api/placeholder/400/400",
    thumbnailUrl: "/api/placeholder/200/200",
    category: "Vintage",
    tags: ["vintage", "retro", "badge", "classic"],
    author: "SSI Studios",
    createdAt: "2024-01-01",
    downloads: 980,
    likes: 178,
    isFavorite: true,
    fileSize: "2.8 MB",
    format: "PNG",
    dimensions: "1200x1200",
  },
];

const categories = [
  "All",
  "Tech",
  "Gradient",
  "Corporate",
  "Creative",
  "Minimalist",
  "Vintage",
  "Abstract",
  "Fun",
];

export default function LogoContent() {
  // State management
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categories: ["All"],
    sortBy: "popular",
    sortOrder: "desc",
    viewMode: "grid",
  });

  const [selectedLogo, setSelectedLogo] = useState<Logo | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hoveredLogo, setHoveredLogo] = useState<string | null>(null);

  // Filter and sort logic
  const filteredLogos = useMemo(() => {
    let filtered = sampleLogos;

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (logo) =>
          logo.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          logo.description
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          logo.tags.some((tag) =>
            tag.toLowerCase().includes(filters.search.toLowerCase())
          )
      );
    }

    // Category filter
    if (!filters.categories.includes("All")) {
      filtered = filtered.filter((logo) =>
        filters.categories.includes(logo.category)
      );
    }

    // Sort logic
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case "popular":
          comparison = b.downloads - a.downloads;
          break;
        case "recent":
          comparison =
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        case "alphabetical":
          comparison = a.title.localeCompare(b.title);
          break;
        case "downloads":
          comparison = b.downloads - a.downloads;
          break;
        case "likes":
          comparison = b.likes - a.likes;
          break;
      }
      return filters.sortOrder === "asc" ? -comparison : comparison;
    });

    return filtered;
  }, [filters]);

  // Event handlers
  const handleSearchChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  }, []);

  const handleCategoryToggle = useCallback((category: string) => {
    setFilters((prev) => {
      if (category === "All") {
        return { ...prev, categories: ["All"] };
      }

      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories.filter((c) => c !== "All"), category];

      return {
        ...prev,
        categories: newCategories.length ? newCategories : ["All"],
      };
    });
  }, []);

  const handleSortChange = useCallback((sortBy: FilterState["sortBy"]) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  }, []);

  const toggleFavorite = useCallback((logoId: string) => {
    // In production, this would make an API call
    console.log(`Toggle favorite for logo ${logoId}`);
  }, []);

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Pinterest-Style Full-Screen Logo Gallery */}
      {/* Pinterest-Style Header - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3"
      >
        <div className="w-full flex items-center justify-between">
          {/* Pinterest-Style Logo/Title */}
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Logos</h1>
            <span className="text-sm text-gray-500">
              {filteredLogos.length} pins
            </span>
          </div>

          {/* Pinterest-Style Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for logos"
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 border-0 rounded-full text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
              />
              {filters.search && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {/* Pinterest-Style Filter Pills */}
          <div className="flex items-center gap-2">
            {categories.slice(0, 6).map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryToggle(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  filters.categories.includes(category)
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}

            {/* More Filters Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <MoreHorizontal className="w-5 h-5 text-gray-600" />
              </button>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 min-w-48 z-50"
                  >
                    <h4 className="font-medium text-gray-900 mb-3">
                      More categories
                    </h4>
                    <div className="space-y-2">
                      {categories.slice(6).map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategoryToggle(category)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            filters.categories.includes(category)
                              ? "bg-black text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Pinterest-Style Masonry Grid - Full Width */}
      <div className="w-full px-4 py-6">
        {/* Active Filters Display */}
        {(filters.search || !filters.categories.includes("All")) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-6 flex flex-wrap items-center gap-2 justify-center"
          >
            <span className="text-sm text-gray-600">Active filters:</span>
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                Search: "{filters.search}"
                <button onClick={() => handleSearchChange("")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.categories
              .filter((c) => c !== "All")
              .map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {category}
                  <button onClick={() => handleCategoryToggle(category)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
          </motion.div>
        )}

        {/* Pinterest-Style Masonry Grid */}
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 2xl:columns-7 gap-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredLogos.map((logo, index) => (
              <motion.div
                key={logo.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.02,
                  layout: { duration: 0.3 },
                }}
                className="group relative break-inside-avoid mb-4 cursor-pointer"
                onMouseEnter={() => setHoveredLogo(logo.id)}
                onMouseLeave={() => setHoveredLogo(null)}
                onClick={() => setSelectedLogo(logo)}
              >
                {/* Pinterest-Style Image Container */}
                <div className="relative w-full bg-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
                  {/* Logo Image - Dynamic Height */}
                  <div
                    className="w-full flex items-center justify-center p-8"
                    style={{
                      aspectRatio: `${1 + Math.random() * 0.5}`, // Random aspect ratio for Pinterest effect
                      minHeight: "200px",
                    }}
                  >
                    {/* Placeholder for logo image */}
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Palette className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  {/* Pinterest-Style Hover Overlay */}
                  <AnimatePresence>
                    {hoveredLogo === logo.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center"
                      >
                        <div className="flex gap-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLogo(logo);
                            }}
                          >
                            <Eye className="w-5 h-5 text-gray-700" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(logo.id);
                            }}
                          >
                            <Heart
                              className={`w-5 h-5 ${
                                logo.isFavorite
                                  ? "text-red-500 fill-current"
                                  : "text-gray-700"
                              }`}
                            />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
                          >
                            <Download className="w-5 h-5 text-gray-700" />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Pinterest-Style Title Overlay (Bottom) */}
                  <AnimatePresence>
                    {hoveredLogo === logo.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent rounded-b-2xl"
                      >
                        <h3 className="text-white font-semibold text-sm mb-1">
                          {logo.title}
                        </h3>
                        <p className="text-white/80 text-xs line-clamp-2">
                          {logo.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 text-white/70 text-xs">
                            <Download className="w-3 h-3" />
                            <span>{logo.downloads.toLocaleString()}</span>
                            <Heart className="w-3 h-3 ml-2" />
                            <span>{logo.likes}</span>
                          </div>
                          <span className="text-white/60 text-xs">
                            {logo.format}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredLogos.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No logos found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() =>
                setFilters({
                  search: "",
                  categories: ["All"],
                  sortBy: "popular",
                  sortOrder: "desc",
                  viewMode: "grid",
                })
              }
              className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Pinterest-Style Logo Preview Modal */}
      <AnimatePresence>
        {selectedLogo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedLogo(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex">
                {/* Logo Preview */}
                <div className="flex-1 bg-gray-50 flex items-center justify-center p-12">
                  <div className="w-64 h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
                    <Palette className="w-32 h-32 text-white" />
                  </div>
                </div>

                {/* Logo Details - Pinterest Style */}
                <div className="w-96 p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedLogo.title}
                      </h2>
                      <p className="text-gray-600">
                        {selectedLogo.description}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedLogo(null)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  {/* Tags - Pinterest Style */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {selectedLogo.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats - Pinterest Style */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {selectedLogo.downloads.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">Downloads</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {selectedLogo.likes}
                      </div>
                      <div className="text-sm text-gray-500">Likes</div>
                    </div>
                  </div>

                  {/* Action Buttons - Pinterest Style */}
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors">
                      <Download className="w-5 h-5" />
                      Save
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                        <Share className="w-4 h-4" />
                        Share
                      </button>
                      <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                        More
                      </button>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="mt-6 pt-6 border-t border-gray-100 space-y-2 text-sm text-gray-500">
                    <div>Format: {selectedLogo.format}</div>
                    <div>Size: {selectedLogo.fileSize}</div>
                    <div>Dimensions: {selectedLogo.dimensions}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
