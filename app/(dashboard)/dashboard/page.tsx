import { Metadata } from "next";
import DashboardClient from "./DashboardClient";

// Server-side metadata for SEO and performance optimization
export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Professional design dashboard with templates, tools, and creative resources",
  keywords: "design, templates, posters, cards, creative tools",
  openGraph: {
    title: "SSI Studios Dashboard",
    description:
      "Professional design dashboard with templates, tools, and creative resources",
    type: "website",
  },
};

// Server component for the dashboard page
export default function DashboardPage() {
  return <DashboardClient />;
}
