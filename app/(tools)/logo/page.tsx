import { Metadata } from "next";
import LogoContent from "./LogoContent";

export const metadata: Metadata = {
  title: "Logo Gallery",
  description: "Browse and manage your logo collection",
  keywords: "logo, gallery, design, branding",
};

export default function LogoPage() {
  return <LogoContent />;
}
