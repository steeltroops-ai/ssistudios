"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import MainContainer from "@/components/shared/MainContainer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-theme-secondary">
      {/* Persistent Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content Area */}
      <div className="lg:ml-20 flex-1 min-h-screen flex flex-col">
        <MainContainer>{children}</MainContainer>
      </div>
    </div>
  );
}
