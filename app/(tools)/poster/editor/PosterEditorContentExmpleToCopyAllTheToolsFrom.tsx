"use client";

import { Edit } from "lucide-react";
import { PageBackground } from "@/components/shared/ThemeBackground";
import { EnhancedResponsiveEditorLayout } from "@/components/editor";

export default function PosterEditorContent() {
  return (
    <PageBackground className="h-screen flex flex-col overflow-hidden">
      <EnhancedResponsiveEditorLayout>
        {/* Canvas Content */}
        <div className="flex items-center justify-center text-white/80">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-white/10 flex items-center justify-center">
              <Edit className="w-8 h-8" />
            </div>
            <div>
              <h3 className="panel-title">Start Creating</h3>
              <p className="property-label mt-2">
                Select a tool from the sidebar to begin designing your poster
              </p>
            </div>
          </div>
        </div>
      </EnhancedResponsiveEditorLayout>
    </PageBackground>
  );
}
