"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download } from 'lucide-react';

// Define the shape of a template object from the database
interface Template {
  _id: string;
  templateName: string;
  imageUrl: string;
}

// Card component for displaying a design thumbnail and title
// This component is kept here as it's directly related to the templates section
const DesignCard = ({ title, imageUrl, actionText, actionIcon }: { title: string; imageUrl: string; actionText: string; actionIcon: React.ReactNode; }) => (
  <div className="group relative overflow-hidden rounded-xl bg-gray-100 border border-gray-300 shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl cursor-pointer">
    {/* Conditionally render the image only if imageUrl is not an empty string */}
    {imageUrl && (
      <img src={imageUrl} alt={title} className="w-full h-auto rounded-t-xl object-cover transition-opacity duration-300 group-hover:opacity-80" />
    )}
    <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
      <button className="bg-white text-gray-900 font-semibold px-6 py-2 rounded-full flex items-center gap-2 transform transition-transform duration-300 group-hover:scale-100 scale-90 cursor-pointer">
        {actionIcon}
        <span>{actionText}</span>
      </button>
    </div>
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-900 truncate">{title}</h3>
    </div>
  </div>
);

export default function NewTemplates() {
  const [newTemplates, setNewTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // This useEffect fetches templates from the API on component mount
  useEffect(() => {
    async function fetchTemplates() {
      try {
        const response = await fetch('/api/templates');
        if (!response.ok) {
          throw new Error('Templates fetch failed');
        }
        const data = await response.json();
        setNewTemplates(data.data);
      } catch (err: any) {
        setError(err.message);
        console.error("Failed to fetch templates:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTemplates();
  }, []); // Empty dependency array ensures this runs once

  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold mb-6">Newest Templates</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="text-gray-500 text-center col-span-full">Loading templates...</p>
        ) : error ? (
          <p className="text-red-500 text-center col-span-full">
            Error fetching templates: {error}
          </p>
        ) : newTemplates.length > 0 ? (
          newTemplates.map((template) => (
            <DesignCard
              key={template._id}
              title={template.templateName}
              imageUrl={template.imageUrl}
              actionText="Use Template"
              actionIcon={<Plus size={20} />}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No templates uploaded yet. Be the first!
          </p>
        )}
      </div>
    </section>
  );
}
