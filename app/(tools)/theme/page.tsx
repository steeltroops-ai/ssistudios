import { Metadata } from "next";
import ThemeContent from "./ThemeContent";

export const metadata: Metadata = {
  title: "Theme Settings",
  description: "Customize your dashboard theme and appearance",
  keywords: "theme, settings, appearance, customization",
};

export default function ThemePage() {
  return <ThemeContent />;
}
