import { Metadata } from "next";
import TemplatesContent from "./TemplatesContent";

export const metadata: Metadata = {
  title: "Templates",
  description: "Browse and manage professional design templates",
  keywords: "templates, design, posters, cards, professional",
};

export default function TemplatesPage() {
  return <TemplatesContent />;
}
