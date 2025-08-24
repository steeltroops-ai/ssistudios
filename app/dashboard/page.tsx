"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, LayoutGrid, AlertTriangle, MessageSquare, Download, Bell, Sparkles, FileText, FolderOpen, Activity, BarChart2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/dashboard/Header';
import Footer from '@/components/dashboard/Footer';
import NewTemplates from '@/components/dashboard/Newtemplates'; // New import

// Define the shape of a template object from the database
interface Template {
  _id: string;
  templateName: string;
  imageUrl: string;
}

// Mock data for recent projects
const recentProjects = [
  { id: 1, title: 'Summer Sale Poster', imageUrl: 'https://placehold.co/400x300/60a5fa/ffffff?text=Summer+Sale+Poster' },
  { id: 2, title: 'Webinar Ad', imageUrl: 'https://placehold.co/400x300/34d399/ffffff?text=Webinar+Ad' },
  { id: 3, title: 'Company Newsletter', imageUrl: 'https://placehold.co/400x300/f87171/ffffff?text=Newsletter' },
  { id: 4, title: 'New Product Launch', imageUrl: 'https://placehold.co/400x300/a78bfa/ffffff?text=Product+Launch' },
];

// Reusable ActivityLogCard component
const ActivityLogCard = ({ activity }: { activity: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    className="p-4 rounded-lg bg-gray-100 border border-gray-300 flex items-center gap-4 text-sm transition-colors duration-200 hover:bg-gray-200 cursor-pointer"
  >
    <div className="flex-shrink-0 p-2 rounded-full bg-blue-600/40 text-gray-900">
      <Activity size={20} />
    </div>
    <div className="flex-1">
      <p className="font-semibold text-gray-900">
        <span className="text-blue-600">{activity.userName}</span> {activity.action}
      </p>
      <p className="text-xs text-gray-600 mt-1">{activity.details}</p>
    </div>
    <span className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</span>
  </motion.div>
);

// Card component for displaying a design thumbnail and title
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

// A simple metric card component for analytics
const MetricCard = ({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string; }) => (
  <div className={`p-4 rounded-xl shadow-lg border border-gray-300 flex flex-col items-start gap-2 bg-gray-100 transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl cursor-pointer`}>
    <div className={`p-2 rounded-full text-white ${color}`}>
      {icon}
    </div>
    <h4 className="text-xl font-bold text-gray-900 mt-2">{value}</h4>
    <p className="text-sm text-gray-600">{title}</p>
  </div>
);

export default function DashboardPage() {
  const { user } = useAuth();
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
    <>
      <main className="flex-1 min-h-screen px-4 sm:px-6 lg:px-12 xl:px-20 transition-all duration-300 bg-transparent text-gray-900">

        {/* --- Header --- */}
        <div className="my-4 cursor-pointer hidden lg:block">
          <Header />
        </div>

        <header className="mb-8 hidden lg:block">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-600 to-indigo-700">{user?.username || 'Guest'}</span>
          </h1>
          <p className="text-lg text-gray-600">
            Let's get your creative projects started.
          </p>
        </header>

        {/* --- Advanced Analytics --- */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Advanced Analytics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard title="Projects Created" value="12" icon={<LayoutGrid size={24} />} color="bg-blue-500" />
            <MetricCard title="Total Downloads" value="28" icon={<Download size={24} />} color="bg-teal-500" />
            <MetricCard title="Projects Contributed" value="7" icon={<FolderOpen size={24} />} color="bg-orange-500" />
            <MetricCard title="Total Uploads" value="15" icon={<Plus size={24} />} color="bg-purple-500" />
          </div>
        </section>

        {/* --- Quick Start & Workflow --- */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-blue-600/40 border border-blue-400/50 shadow-md text-gray-900 font-semibold hover:bg-blue-600/60 transition-all duration-300 active:scale-[0.98] cursor-pointer">
              <Plus size={20} />
              <span>Create New Poster</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-purple-600/40 border border-purple-400/50 shadow-md text-gray-900 font-semibold hover:bg-purple-600/60 transition-all duration-300 active:scale-[0.98] cursor-pointer">
              <FileText size={20} />
              <span>Generate Visiting Card</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-teal-600/40 border border-teal-400/50 shadow-md text-gray-900 font-semibold hover:bg-teal-600/60 transition-all duration-300 active:scale-[0.98] cursor-pointer">
              <LayoutGrid size={20} />
              <span>Manage Templates</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-red-600/40 border border-red-400/50 shadow-md text-gray-900 font-semibold hover:bg-red-600/60 transition-all duration-300 active:scale-[0.98] cursor-pointer">
              <Bell size={20} />
              <span>View Notifications</span>
            </button>
          </div>
        </section>

                 {/* --- Newest Templates (Fetched from MongoDB) --- */}
        <NewTemplates />




        {/* --- Creative AI & Inspiration Hub --- */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Creative AI</h2>
          <div className="p-8 rounded-xl bg-gray-100 border border-gray-300 shadow-xl">
            <h3 className="text-2xl font-bold mb-2 text-gray-900">Need a spark? Let AI help.</h3>
            <p className="text-gray-600 mb-6">
              Describe your idea, and our AI will generate design concepts for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="e.g., 'A poster for a new coffee shop with a friendly vibe'"
                className="flex-1 p-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <button className="bg-green-600/80 text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600/90 transition-colors duration-300 active:scale-[0.98] cursor-pointer">
                <Sparkles size={20} />
                Generate Ideas
              </button>
            </div>
          </div>
        </section>

        {/* --- Recent Projects (Mock Data) --- */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Recent Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProjects.map((project) => (
              <DesignCard
                key={project.id}
                title={project.title}
                imageUrl={project.imageUrl}
                actionText="Continue Editing"
                actionIcon={<Download size={20} />}
              />
            ))}
          </div>
        </section>

  
        {/* --- New Professional Footer --- */}
        <Footer />

      </main>
    </>
  );
}
