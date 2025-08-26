"use client";

import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Image as ImageIcon, 
  FileText, 
  Award, 
  Palette,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { CardBackground, GlassBackground } from "@/components/shared/ThemeBackground";
import { useNavigation } from "@/lib/contexts/NavigationContext";

interface TemplateCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  count: number;
  color: string;
  gradient: string;
  featured: boolean;
  thumbnail: string;
  route: string;
}

export default function TemplateCategories() {
  const { navigateTo } = useNavigation();

  const categories: TemplateCategory[] = [
    {
      id: "posters",
      title: "Poster Templates",
      description: "Professional posters for events, marketing, and announcements",
      icon: <ImageIcon size={24} />,
      count: 150,
      color: "text-blue-600",
      gradient: "from-blue-500 to-blue-600",
      featured: true,
      thumbnail: "https://placehold.co/400x600/3B82F6/FFFFFF?text=Poster+Templates",
      route: "templates",
    },
    {
      id: "cards",
      title: "Business Cards",
      description: "Elegant business card designs for professional networking",
      icon: <FileText size={24} />,
      count: 85,
      color: "text-green-600",
      gradient: "from-green-500 to-green-600",
      featured: true,
      thumbnail: "https://placehold.co/400x250/10B981/FFFFFF?text=Business+Cards",
      route: "cards",
    },
    {
      id: "certificates",
      title: "Certificates",
      description: "Award certificates and achievement recognition templates",
      icon: <Award size={24} />,
      count: 45,
      color: "text-purple-600",
      gradient: "from-purple-500 to-purple-600",
      featured: false,
      thumbnail: "https://placehold.co/400x300/8B5CF6/FFFFFF?text=Certificates",
      route: "certificates",
    },
    {
      id: "logos",
      title: "Logo Gallery",
      description: "Creative logo designs and brand identity templates",
      icon: <Palette size={24} />,
      count: 120,
      color: "text-orange-600",
      gradient: "from-orange-500 to-orange-600",
      featured: false,
      thumbnail: "https://placehold.co/400x400/F59E0B/FFFFFF?text=Logo+Gallery",
      route: "logo",
    },
  ];

  const featuredCategories = categories.filter(cat => cat.featured);
  const regularCategories = categories.filter(cat => !cat.featured);

  return (
    <section className="mb-12">
      <CardBackground className="p-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Template Categories</h2>
            <p className="text-gray-600">Explore our professional design templates</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateTo("templates")}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <span>Browse All</span>
            <ArrowRight size={16} />
          </motion.button>
        </div>

        {/* Featured Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {featuredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              onClick={() => navigateTo(category.route)}
              className="group cursor-pointer"
            >
              <GlassBackground className="p-6 h-full transition-all duration-300 group-hover:shadow-xl">
                <div className="flex gap-6">
                  {/* Category Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${category.gradient} text-white transition-transform duration-300 group-hover:scale-110`}>
                        {category.icon}
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-yellow-500" />
                        <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                          Featured
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {category.description}
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={16} className="text-green-600" />
                        <span className="text-sm font-medium text-gray-700">
                          {category.count} templates
                        </span>
                      </div>
                      <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
                    </div>
                  </div>

                  {/* Category Thumbnail */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={category.thumbnail}
                      alt={category.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                </div>
              </GlassBackground>
            </motion.div>
          ))}
        </div>

        {/* Regular Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {regularCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (featuredCategories.length + index) * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              onClick={() => navigateTo(category.route)}
              className="group cursor-pointer"
            >
              <GlassBackground className="p-6 transition-all duration-300 group-hover:shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${category.gradient} text-white transition-transform duration-300 group-hover:scale-110`}>
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {category.count} templates available
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
                </div>
                
                <p className="text-sm text-gray-600 leading-relaxed">
                  {category.description}
                </p>
              </GlassBackground>
            </motion.div>
          ))}
        </div>
      </CardBackground>
    </section>
  );
}
